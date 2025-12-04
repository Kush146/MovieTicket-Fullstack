import Review from "../models/Review.js";
import Movie from "../models/Movie.js";
import Booking from "../models/Booking.js";
import { clerkClient } from "@clerk/express";

// Create or update a review
export const createReview = async (req, res) => {
    try {
        const userId = req.auth().userId;
        const { movieId, rating, review } = req.body;

        // Get user info
        const clerkUser = await clerkClient.users.getUser(userId);
        const userName = clerkUser.firstName || clerkUser.username || 'Anonymous';
        const userEmail = clerkUser.emailAddresses[0]?.emailAddress;

        // Check if user has booked this movie (for verified purchase)
        const hasBooking = await Booking.findOne({
            user: userId,
            isPaid: true,
            isCancelled: false
        }).populate({
            path: 'show',
            match: { movie: movieId }
        });

        const isVerified = !!hasBooking?.show;

        // Check if review already exists
        const existingReview = await Review.findOne({ user: userId, movie: movieId });

        if (existingReview) {
            // Update existing review
            existingReview.rating = rating;
            existingReview.review = review || existingReview.review;
            existingReview.isVerified = isVerified;
            await existingReview.save();
            return res.json({ success: true, review: existingReview, message: "Review updated" });
        }

        // Create new review
        const newReview = await Review.create({
            user: userId,
            userName,
            userEmail,
            movie: movieId,
            rating,
            review: review || '',
            isVerified
        });

        // Update movie average rating
        await updateMovieRating(movieId);

        res.json({ success: true, review: newReview, message: "Review created" });
    } catch (error) {
        console.error(error.message);
        if (error.code === 11000) {
            return res.json({ success: false, message: "You have already reviewed this movie" });
        }
        res.json({ success: false, message: error.message });
    }
};

// Get reviews for a movie
export const getMovieReviews = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { page = 1, limit = 10, sort = 'recent' } = req.query;

        const sortOptions = {
            'recent': { createdAt: -1 },
            'helpful': { helpful: -1, createdAt: -1 },
            'rating-high': { rating: -1, createdAt: -1 },
            'rating-low': { rating: 1, createdAt: -1 }
        };

        const reviews = await Review.find({ movie: movieId })
            .sort(sortOptions[sort] || sortOptions.recent)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Review.countDocuments({ movie: movieId });

        // Calculate average rating
        const avgRating = await Review.aggregate([
            { $match: { movie: movieId } },
            { $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
        ]);

        res.json({
            success: true,
            reviews,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total,
            averageRating: avgRating[0]?.avgRating || 0,
            totalReviews: avgRating[0]?.count || 0
        });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get user's review for a movie
export const getUserReview = async (req, res) => {
    try {
        const userId = req.auth().userId;
        const { movieId } = req.params;

        const review = await Review.findOne({ user: userId, movie: movieId });
        res.json({ success: true, review: review || null });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Mark review as helpful
export const markHelpful = async (req, res) => {
    try {
        const userId = req.auth().userId;
        const { reviewId } = req.params;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.json({ success: false, message: "Review not found" });
        }

        const isHelpful = review.helpfulUsers.includes(userId);
        if (isHelpful) {
            review.helpfulUsers = review.helpfulUsers.filter(id => id !== userId);
            review.helpful = Math.max(0, review.helpful - 1);
        } else {
            review.helpfulUsers.push(userId);
            review.helpful += 1;
        }

        await review.save();
        res.json({ success: true, helpful: review.helpful, isHelpful: !isHelpful });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Delete review
export const deleteReview = async (req, res) => {
    try {
        const userId = req.auth().userId;
        const { reviewId } = req.params;

        const review = await Review.findOne({ _id: reviewId, user: userId });
        if (!review) {
            return res.json({ success: false, message: "Review not found or unauthorized" });
        }

        const movieId = review.movie;
        await Review.findByIdAndDelete(reviewId);

        // Update movie rating
        await updateMovieRating(movieId);

        res.json({ success: true, message: "Review deleted" });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Helper function to update movie average rating
const updateMovieRating = async (movieId) => {
    try {
        const result = await Review.aggregate([
            { $match: { movie: movieId } },
            { $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
        ]);

        if (result.length > 0) {
            await Movie.findByIdAndUpdate(movieId, {
                vote_average: Math.round(result[0].avgRating * 10) / 10,
                reviewCount: result[0].count
            });
        }
    } catch (error) {
        console.error("Error updating movie rating:", error.message);
    }
};

