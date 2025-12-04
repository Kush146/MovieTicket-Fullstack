import express from "express";
import { getFavorites, getUserBookings, updateFavorite, getLoyaltyPoints, updateWatchlist, getWatchlist, getUserDashboard } from "../controllers/userController.js";
import { protectUser } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.get('/bookings', protectUser, getUserBookings)
userRouter.post('/update-favorite', protectUser, updateFavorite)
userRouter.get('/favorites', protectUser, getFavorites)
userRouter.get('/loyalty-points', protectUser, getLoyaltyPoints)
userRouter.post('/update-watchlist', protectUser, updateWatchlist)
userRouter.get('/watchlist', protectUser, getWatchlist)
userRouter.get('/dashboard', protectUser, getUserDashboard)

export default userRouter;