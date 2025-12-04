import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: { type: String, required: true }, // Clerk user ID
    userName: { type: String, required: true }, // User's display name
    userEmail: { type: String }, // User's email
    movie: { type: String, required: true, ref: 'Movie' }, // Movie ID
    rating: { type: Number, required: true, min: 1, max: 5 }, // 1-5 stars
    review: { type: String, maxlength: 1000 }, // Optional text review
    isVerified: { type: Boolean, default: false }, // Verified purchase
    helpful: { type: Number, default: 0 }, // Helpful votes count
    helpfulUsers: [{ type: String }], // Users who marked as helpful
}, { timestamps: true });

// Compound index to prevent duplicate reviews from same user for same movie
reviewSchema.index({ user: 1, movie: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;

