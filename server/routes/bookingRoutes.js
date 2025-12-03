import express from 'express';
import { createBooking, getOccupiedSeats, cancelBooking, retryPayment } from '../controllers/bookingController.js';
import { validatePromoCode } from '../controllers/promoController.js';

const bookingRouter = express.Router();


bookingRouter.post('/create', createBooking);
bookingRouter.get('/seats/:showId', getOccupiedSeats);
bookingRouter.post('/cancel/:bookingId', cancelBooking);
bookingRouter.post('/retry-payment/:bookingId', retryPayment);
bookingRouter.post('/validate-promo', validatePromoCode);

export default bookingRouter;