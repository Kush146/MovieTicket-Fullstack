import { inngest } from "../inngest/index.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js"
import PromoCode from "../models/PromoCode.js"
import User from "../models/User.js"
import stripe from 'stripe'


// Function to check availability of selected seats for a movie
const checkSeatsAvailability = async (showId, selectedSeats)=>{
    try {
        const showData = await Show.findById(showId)
        if(!showData) return false;

        const occupiedSeats = showData.occupiedSeats;

        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);

        return !isAnySeatTaken;
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const createBooking = async (req, res)=>{
    try {
        const {userId} = req.auth();
        const {showId, selectedSeats, promoCode, useLoyaltyPoints} = req.body;
        const { origin } = req.headers;

        // Check if the seat is available for the selected show
        const isAvailable = await checkSeatsAvailability(showId, selectedSeats)

        if(!isAvailable){
            return res.json({success: false, message: "Selected Seats are not available."})
        }

        // Get the show details
        const showData = await Show.findById(showId).populate('movie');

        // Calculate base amount
        let baseAmount = showData.showPrice * selectedSeats.length;
        let discountAmount = 0;
        let promoCodeUsed = null;
        let loyaltyPointsUsed = 0;

        // Apply promo code if provided
        if (promoCode) {
            const promo = await PromoCode.findOne({ 
                code: promoCode.toUpperCase(), 
                isActive: true 
            });

            if (!promo) {
                return res.json({success: false, message: "Invalid promo code"});
            }

            // Check validity
            const now = new Date();
            if (now < promo.validFrom || now > promo.validUntil) {
                return res.json({success: false, message: "Promo code has expired"});
            }

            if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
                return res.json({success: false, message: "Promo code usage limit reached"});
            }

            if (baseAmount < promo.minAmount) {
                return res.json({success: false, message: `Minimum amount of ${promo.minAmount} required for this promo code`});
            }

            // Calculate discount
            if (promo.discountType === 'PERCENTAGE') {
                discountAmount = (baseAmount * promo.discountValue) / 100;
                if (promo.maxDiscount) {
                    discountAmount = Math.min(discountAmount, promo.maxDiscount);
                }
            } else {
                discountAmount = Math.min(promo.discountValue, baseAmount);
            }

            promoCodeUsed = promo.code;
        }

        // Apply loyalty points discount (1 point = 0.01 currency unit)
        let loyaltyDiscount = 0;
        if (useLoyaltyPoints) {
            const user = await User.findById(userId);
            if (!user) {
                // Create user if doesn't exist
                const newUser = await User.create({
                    _id: userId,
                    name: '',
                    email: '',
                    image: '',
                    loyaltyPoints: 0
                });
            }
            const userData = user || await User.findById(userId);
            if (userData && userData.loyaltyPoints > 0) {
                const maxLoyaltyDiscount = baseAmount * 0.5; // Max 50% discount from loyalty points
                loyaltyDiscount = Math.min(userData.loyaltyPoints * 0.01, maxLoyaltyDiscount, baseAmount - discountAmount);
                loyaltyPointsUsed = Math.floor(loyaltyDiscount / 0.01);
            }
        }

        const finalAmount = Math.max(0, baseAmount - discountAmount - loyaltyDiscount);

        // Create a new booking
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: finalAmount,
            originalAmount: baseAmount,
            discountAmount: discountAmount + loyaltyDiscount,
            promoCode: promoCodeUsed,
            loyaltyPointsUsed: loyaltyPointsUsed,
            bookedSeats: selectedSeats
        })

        // Update promo code usage
        if (promoCodeUsed) {
            await PromoCode.findOneAndUpdate(
                { code: promoCodeUsed },
                { $inc: { usedCount: 1 } }
            );
        }

        // Deduct loyalty points if used
        if (loyaltyPointsUsed > 0) {
            await User.findByIdAndUpdate(userId, {
                $inc: { loyaltyPoints: -loyaltyPointsUsed }
            });
        }

        selectedSeats.map((seat)=>{
            showData.occupiedSeats[seat] = userId;
        })

        showData.markModified('occupiedSeats');

        await showData.save();

         // Stripe Gateway Initialize
         const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

         // Creating line items to for Stripe
         const line_items = [{
            price_data: {
                currency: 'usd',
                product_data:{
                    name: showData.movie.title
                },
                unit_amount: Math.floor(booking.amount) * 100
            },
            quantity: 1
         }]

         const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-bookings`,
            cancel_url: `${origin}/my-bookings`,
            line_items: line_items,
            mode: 'payment',
            payment_method_types: ['card'], // Stripe supports multiple methods, can add more
            metadata: {
                bookingId: booking._id.toString(),
                promoCode: promoCodeUsed || '',
                loyaltyPointsUsed: loyaltyPointsUsed.toString()
            },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // Expires in 30 minutes
         })

         booking.paymentLink = session.url
         await booking.save()

         // Run Inngest Sheduler Function to check payment status after 10 minutes
         await inngest.send({
            name: "app/checkpayment",
            data: {
                bookingId: booking._id.toString()
            }
         })

         res.json({success: true, url: session.url})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Retry payment for failed/unpaid booking
export const retryPayment = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {bookingId} = req.params;
        const { origin } = req.headers;

        const booking = await Booking.findById(bookingId);
        
        if (!booking) {
            return res.json({success: false, message: "Booking not found"});
        }

        if (booking.user !== userId) {
            return res.json({success: false, message: "Unauthorized"});
        }

        if (booking.isPaid) {
            return res.json({success: false, message: "Booking already paid"});
        }

        if (booking.isCancelled) {
            return res.json({success: false, message: "Cannot retry payment for cancelled booking"});
        }

        // Increment retry count
        booking.paymentRetryCount += 1;
        await booking.save();

        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        const showData = await Show.findById(booking.show).populate('movie');

        const line_items = [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: showData.movie.title
                },
                unit_amount: Math.floor(booking.amount) * 100
            },
            quantity: 1
        }];

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-bookings`,
            cancel_url: `${origin}/my-bookings`,
            line_items: line_items,
            mode: 'payment',
            payment_method_types: ['card'],
            metadata: {
                bookingId: booking._id.toString(),
                promoCode: booking.promoCode || '',
                loyaltyPointsUsed: booking.loyaltyPointsUsed.toString()
            },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
        });

        booking.paymentLink = session.url;
        await booking.save();

        res.json({success: true, url: session.url});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

export const getOccupiedSeats = async (req, res)=>{
    try {
        
        const {showId} = req.params;
        const showData = await Show.findById(showId)

        const occupiedSeats = Object.keys(showData.occupiedSeats)

        res.json({success: true, occupiedSeats})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Cancel booking
export const cancelBooking = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {bookingId} = req.params;

        const booking = await Booking.findById(bookingId).populate('show');
        
        if (!booking) {
            return res.json({success: false, message: "Booking not found"});
        }

        if (booking.user !== userId) {
            return res.json({success: false, message: "Unauthorized"});
        }

        if (booking.isCancelled) {
            return res.json({success: false, message: "Booking already cancelled"});
        }

        // Check if show has already started (can't cancel past shows)
        const showData = await Show.findById(booking.show);
        if (showData && new Date(showData.showDateTime) < new Date()) {
            return res.json({success: false, message: "Cannot cancel past shows"});
        }

        // Release seats
        booking.bookedSeats.forEach((seat) => {
            delete showData.occupiedSeats[seat];
        });
        showData.markModified('occupiedSeats');
        await showData.save();

        // Calculate refund (full refund if paid, 0 if unpaid)
        const refundAmount = booking.isPaid ? booking.amount : 0;

        // Refund loyalty points if used
        if (booking.loyaltyPointsUsed > 0) {
            await User.findByIdAndUpdate(userId, {
                $inc: { loyaltyPoints: booking.loyaltyPointsUsed }
            });
        }

        // Update booking
        booking.isCancelled = true;
        booking.cancelledAt = new Date();
        booking.refundAmount = refundAmount;
        await booking.save();

        // TODO: Process refund through Stripe if paid
        // if (booking.isPaid && refundAmount > 0) {
        //     // Implement Stripe refund logic here
        // }

        res.json({
            success: true,
            message: "Booking cancelled successfully",
            refundAmount
        });

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}
