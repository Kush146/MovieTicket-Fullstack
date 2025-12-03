import express from "express";
import { protectAdmin } from "../middleware/auth.js";
import { 
    getAllBookings, 
    getAllShows, 
    getDashboardData, 
    isAdmin,
    getAllPromoCodes,
    createPromoCode,
    updatePromoCode,
    deletePromoCode,
    getAnalytics
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get('/is-admin', protectAdmin, isAdmin)
adminRouter.get('/dashboard', protectAdmin, getDashboardData)
adminRouter.get('/all-shows', protectAdmin, getAllShows)
adminRouter.get('/all-bookings', protectAdmin, getAllBookings)
adminRouter.get('/analytics', protectAdmin, getAnalytics)

// Promo code routes
adminRouter.get('/promo-codes', protectAdmin, getAllPromoCodes)
adminRouter.post('/promo-codes', protectAdmin, createPromoCode)
adminRouter.put('/promo-codes/:id', protectAdmin, updatePromoCode)
adminRouter.delete('/promo-codes/:id', protectAdmin, deletePromoCode)

export default adminRouter;