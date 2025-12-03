import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema({
    code: {type: String, required: true, unique: true, uppercase: true},
    discountType: {type: String, enum: ['PERCENTAGE', 'FIXED'], required: true},
    discountValue: {type: Number, required: true}, // Percentage (0-100) or fixed amount
    minAmount: {type: Number, default: 0}, // Minimum booking amount to use this code
    maxDiscount: {type: Number}, // Maximum discount for percentage type
    validFrom: {type: Date, default: Date.now},
    validUntil: {type: Date, required: true},
    usageLimit: {type: Number}, // Total number of times this code can be used
    usedCount: {type: Number, default: 0},
    isActive: {type: Boolean, default: true},
    description: {type: String}
},{timestamps: true })

const PromoCode = mongoose.model("PromoCode", promoCodeSchema);

export default PromoCode;

