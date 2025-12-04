import express from "express";
import { createReview, getMovieReviews, getUserReview, markHelpful, deleteReview } from "../controllers/reviewController.js";
import { protectUser } from "../middleware/auth.js";

const reviewRouter = express.Router();

reviewRouter.post("/", protectUser, createReview);
reviewRouter.get("/movie/:movieId", getMovieReviews);
reviewRouter.get("/movie/:movieId/user", protectUser, getUserReview);
reviewRouter.post("/:reviewId/helpful", protectUser, markHelpful);
reviewRouter.delete("/:reviewId", protectUser, deleteReview);

export default reviewRouter;

