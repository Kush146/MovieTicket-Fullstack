import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";


// API Controller Function to Get User Bookings
export const getUserBookings = async (req, res)=>{
    try {
        const user = req.auth().userId;

        const bookings = await Booking.find({user}).populate({
            path: "show",
            populate: {path: "movie"}
        }).sort({createdAt: -1 })
        res.json({success: true, bookings})
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}

// API Controller Function to update Favorite Movie in Clerk User Metadata
export const updateFavorite = async (req, res)=>{
    try {
        const { movieId } = req.body;
        const userId = req.auth().userId;

        const user = await clerkClient.users.getUser(userId)

        if(!user.privateMetadata.favorites){
            user.privateMetadata.favorites = []
        }

        if(!user.privateMetadata.favorites.includes(movieId)){
            user.privateMetadata.favorites.push(movieId)
        }else{
            user.privateMetadata.favorites = user.privateMetadata.favorites.filter(item => item !== movieId)
        }

        await clerkClient.users.updateUserMetadata(userId, {privateMetadata: user.privateMetadata})

        res.json({success: true, message: "Favorite movies updated" })
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const getFavorites = async (req, res) =>{
    try {
        const user = await clerkClient.users.getUser(req.auth().userId)
        const favorites = user.privateMetadata.favorites;

        // Getting movies from database
        const movies = await Movie.find({_id: {$in: favorites}})

        res.json({success: true, movies})
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Get user loyalty points
export const getLoyaltyPoints = async (req, res) => {
    try {
        const userId = req.auth().userId;
        const user = await User.findOne({ clerkId: userId });
        
        res.json({
            success: true,
            loyaltyPoints: user?.loyaltyPoints || 0,
            totalSpent: user?.totalSpent || 0
        });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Watchlist functions (similar to favorites but separate)
export const updateWatchlist = async (req, res) => {
    try {
        const { movieId } = req.body;
        const userId = req.auth().userId;

        const user = await clerkClient.users.getUser(userId)

        if(!user.privateMetadata.watchlist){
            user.privateMetadata.watchlist = []
        }

        if(!user.privateMetadata.watchlist.includes(movieId)){
            user.privateMetadata.watchlist.push(movieId)
        }else{
            user.privateMetadata.watchlist = user.privateMetadata.watchlist.filter(item => item !== movieId)
        }

        await clerkClient.users.updateUserMetadata(userId, {privateMetadata: user.privateMetadata})

        res.json({success: true, message: "Watchlist updated" })
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const getWatchlist = async (req, res) => {
    try {
        const user = await clerkClient.users.getUser(req.auth().userId)
        const watchlist = user.privateMetadata.watchlist || [];

        // Getting movies from database
        const movies = await Movie.find({_id: {$in: watchlist}})

        res.json({success: true, movies})
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Get user dashboard stats
export const getUserDashboard = async (req, res) => {
    try {
        const userId = req.auth().userId;

        // Get booking stats
        const totalBookings = await Booking.countDocuments({ user: userId });
        const upcomingBookings = await Booking.countDocuments({ 
            user: userId, 
            isPaid: true,
            isCancelled: false,
            'show.showDateTime': { $gte: new Date() }
        });
        const pastBookings = await Booking.countDocuments({ 
            user: userId, 
            isPaid: true,
            isCancelled: false,
            'show.showDateTime': { $lt: new Date() }
        });

        // Get total spent
        const user = await User.findOne({ clerkId: userId });
        const totalSpent = user?.totalSpent || 0;

        // Get loyalty points
        const loyaltyPoints = user?.loyaltyPoints || 0;

        // Get favorite and watchlist counts
        const clerkUser = await clerkClient.users.getUser(userId);
        const favoriteCount = clerkUser.privateMetadata.favorites?.length || 0;
        const watchlistCount = clerkUser.privateMetadata.watchlist?.length || 0;

        // Get recent bookings
        const recentBookings = await Booking.find({ user: userId })
            .populate({
                path: "show",
                populate: { path: "movie" }
            })
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,
            stats: {
                totalBookings,
                upcomingBookings,
                pastBookings,
                totalSpent,
                loyaltyPoints,
                favoriteCount,
                watchlistCount
            },
            recentBookings
        });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}