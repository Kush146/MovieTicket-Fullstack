import Booking from "../models/Booking.js"
import Show from "../models/Show.js";
import User from "../models/User.js";
import PromoCode from "../models/PromoCode.js";
import { clerkClient } from "@clerk/express";

const ADMIN_EMAIL = "kushkore.work@gmail.com";

// API to check if user is admin
export const isAdmin = async (req, res) =>{
    try {
        const { userId } = req.auth();
        const user = await clerkClient.users.getUser(userId);
        
        // Check if user email matches admin email
        const userEmail = user.emailAddresses[0]?.emailAddress;
        const isAdminUser = userEmail === ADMIN_EMAIL;
        
        res.json({success: true, isAdmin: isAdminUser})
    } catch (error) {
        console.error(error);
        res.json({success: false, isAdmin: false, message: error.message})
    }
}

// API to get dashboard data
export const getDashboardData = async (req, res) =>{
    try {
        const now = new Date();
        const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        // Total stats
        const allBookings = await Booking.find({isPaid: true});
        const totalBookings = allBookings.length;
        const totalRevenue = allBookings.reduce((acc, booking)=> acc + booking.amount, 0);
        
        // Recent stats
        const recentBookings = await Booking.find({
            isPaid: true,
            createdAt: { $gte: last7Days }
        });
        const recentRevenue = recentBookings.reduce((acc, booking)=> acc + booking.amount, 0);
        
        // Today's stats
        const todayStart = new Date(now.setHours(0, 0, 0, 0));
        const todayBookings = await Booking.find({
            isPaid: true,
            createdAt: { $gte: todayStart }
        });
        const todayRevenue = todayBookings.reduce((acc, booking)=> acc + booking.amount, 0);
        
        // Active shows
        const activeShows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie').limit(6);
        
        // User stats
        const totalUser = await User.countDocuments();
        const newUsers = await User.countDocuments({ createdAt: { $gte: last7Days } });
        
        // Booking status breakdown
        const paidBookings = await Booking.countDocuments({ isPaid: true, isCancelled: false });
        const unpaidBookings = await Booking.countDocuments({ isPaid: false, isCancelled: false });
        const cancelledBookings = await Booking.countDocuments({ isCancelled: true });
        
        // Recent bookings (last 5)
        const latestBookings = await Booking.find({})
            .populate('user')
            .populate({
                path: "show",
                populate: {path: "movie"}
            })
            .sort({ createdAt: -1 })
            .limit(5);
        
        // Revenue by day (last 7 days)
        const revenueByDay = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);
            
            const dayBookings = await Booking.find({
                isPaid: true,
                createdAt: { $gte: date, $lt: nextDate }
            });
            const dayRevenue = dayBookings.reduce((acc, booking) => acc + booking.amount, 0);
            
            revenueByDay.push({
                date: date.toISOString().split('T')[0],
                revenue: dayRevenue,
                bookings: dayBookings.length
            });
        }

        const dashboardData = {
            totalBookings,
            totalRevenue,
            recentBookings: recentBookings.length,
            recentRevenue,
            todayBookings: todayBookings.length,
            todayRevenue,
            activeShows,
            totalUser,
            newUsers,
            bookingStatus: {
                paid: paidBookings,
                unpaid: unpaidBookings,
                cancelled: cancelledBookings
            },
            latestBookings,
            revenueByDay
        }

        res.json({success: true, dashboardData})
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}

// API to get all shows
export const getAllShows = async (req, res) =>{
    try {
        const shows = await Show.find({showDateTime: { $gte: new Date() }}).populate('movie').sort({ showDateTime: 1 })
        res.json({success: true, shows})
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}

// API to get all bookings
export const getAllBookings = async (req, res) =>{
    try {
        const bookings = await Booking.find({}).populate('user').populate({
            path: "show",
            populate: {path: "movie"}
        }).sort({ createdAt: -1 })
        res.json({success: true, bookings })
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}

// API to get all promo codes
export const getAllPromoCodes = async (req, res) => {
    try {
        const promoCodes = await PromoCode.find({}).sort({ createdAt: -1 });
        res.json({success: true, promoCodes});
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message});
    }
}

// API to create promo code
export const createPromoCode = async (req, res) => {
    try {
        const promoCode = await PromoCode.create(req.body);
        res.json({success: true, promoCode});
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message});
    }
}

// API to update promo code
export const updatePromoCode = async (req, res) => {
    try {
        const { id } = req.params;
        const promoCode = await PromoCode.findByIdAndUpdate(id, req.body, { new: true });
        res.json({success: true, promoCode});
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message});
    }
}

// API to delete promo code
export const deletePromoCode = async (req, res) => {
    try {
        const { id } = req.params;
        await PromoCode.findByIdAndDelete(id);
        res.json({success: true, message: "Promo code deleted"});
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message});
    }
}

// API to get analytics
export const getAnalytics = async (req, res) => {
    try {
        const now = new Date();
        const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        // Total stats
        const totalBookings = await Booking.countDocuments({ isPaid: true });
        const totalRevenue = await Booking.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        
        // Recent bookings (last 30 days)
        const recentBookings = await Booking.countDocuments({
            isPaid: true,
            createdAt: { $gte: last30Days }
        });
        
        const recentRevenue = await Booking.aggregate([
            { $match: { isPaid: true, createdAt: { $gte: last30Days } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        
        // Bookings by status
        const bookingsByStatus = {
            paid: await Booking.countDocuments({ isPaid: true, isCancelled: false }),
            unpaid: await Booking.countDocuments({ isPaid: false, isCancelled: false }),
            cancelled: await Booking.countDocuments({ isCancelled: true })
        };
        
        // Top movies by bookings
        const topMovies = await Booking.aggregate([
            { $match: { isPaid: true } },
            { $lookup: { from: "shows", localField: "show", foreignField: "_id", as: "showData" } },
            { $unwind: "$showData" },
            { $lookup: { from: "movies", localField: "showData.movie", foreignField: "_id", as: "movieData" } },
            { $unwind: "$movieData" },
            { $group: {
                _id: "$movieData._id",
                title: { $first: "$movieData.title" },
                poster_path: { $first: "$movieData.poster_path" },
                count: { $sum: 1 },
                revenue: { $sum: "$amount" }
            }},
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        
        res.json({
            success: true,
            analytics: {
                totalBookings,
                totalRevenue: totalRevenue[0]?.total || 0,
                recentBookings,
                recentRevenue: recentRevenue[0]?.total || 0,
                bookingsByStatus,
                topMovies
            }
        });
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message});
    }
}