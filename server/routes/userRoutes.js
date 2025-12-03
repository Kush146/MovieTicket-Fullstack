import express from "express";
import { getFavorites, getUserBookings, updateFavorite, getLoyaltyPoints } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get('/bookings', getUserBookings)
userRouter.post('/update-favorite', updateFavorite)
userRouter.get('/favorites', getFavorites)
userRouter.get('/loyalty-points', getLoyaltyPoints)

export default userRouter;