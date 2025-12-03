import stripe from "stripe";
import Booking from '../models/Booking.js'
import User from '../models/User.js'
import { inngest } from "../inngest/index.js";

export const stripeWebhooks = async (request, response)=>{
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers["stripe-signature"];

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (error) {
        return response.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;
                const sessionList = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id
                })

                const session = sessionList.data[0];
                const { bookingId } = session.metadata;

                const booking = await Booking.findById(bookingId);
                if (!booking) {
                    console.error('Booking not found:', bookingId);
                    break;
                }

                await Booking.findByIdAndUpdate(bookingId, {
                    isPaid: true,
                    paymentLink: ""
                })

                // Award loyalty points (1% of booking amount, rounded)
                const pointsToAward = Math.round(booking.amount * 0.01);
                await User.findByIdAndUpdate(
                    booking.user,
                    { 
                        $inc: { 
                            loyaltyPoints: pointsToAward,
                            totalSpent: booking.amount
                        } 
                    }
                );

                 // Send Confirmation Email
                 await inngest.send({
                    name: "app/show.booked",
                    data: {bookingId}
                 })
                
                break;
            }
        
            default:
                console.log('Unhandled event type:', event.type)
        }
        response.json({received: true})
    } catch (err) {
        console.error("Webhook processing error:", err);
        response.status(500).send("Internal Server Error");
    }
}