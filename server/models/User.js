import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    image: {type: String, required: true},
    loyaltyPoints: {type: Number, default: 0},
    totalSpent: {type: Number, default: 0} // Track total spending for loyalty tiers
})

const User = mongoose.model('User', userSchema)

export default User;