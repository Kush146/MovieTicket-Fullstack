import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {type: String, required: true, ref: 'User'},
    show: {type: String, required: true, ref: 'Show'},
    amount: {type: Number, required: true},
    originalAmount: {type: Number}, // Amount before discounts
    discountAmount: {type: Number, default: 0},
    promoCode: {type: String},
    loyaltyPointsUsed: {type: Number, default: 0},
    bookedSeats: {type: Array, required: true},
    isPaid: {type: Boolean,  default:false},
    paymentLink: {type: String},
    isCancelled: {type: Boolean, default: false},
    cancelledAt: {type: Date},
    refundAmount: {type: Number, default: 0},
    bookingReference: {type: String, unique: true}, // For QR code
    paymentRetryCount: {type: Number, default: 0}, // Track payment retry attempts
},{timestamps: true })

// Generate booking reference before saving
bookingSchema.pre('save', async function(next) {
    if (!this.bookingReference) {
        this.bookingReference = `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    }
    next();
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;