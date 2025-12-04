import express from "express";
import {
  addShow,
  getNowPlayingMovies,
  getUpcomingMovies,
  getShow,
  getShows,
  getSeatAvailability,
  triggerAutoAddMovies,
} from "../controllers/showController.js";
import { protectAdmin } from "../middleware/auth.js";
import Show from "../models/Show.js";
import SeatMap from "../models/SeatMap.js";
import Theatre from "../models/Theatre.js";

const showRouter = express.Router();

// PUBLIC now-playing (was protected)
showRouter.get("/now-playing", getNowPlayingMovies);

// PUBLIC upcoming movies
showRouter.get("/upcoming", getUpcomingMovies);

showRouter.post("/add", protectAdmin, addShow);
showRouter.get("/all", getShows);
showRouter.post("/auto-add", protectAdmin, triggerAutoAddMovies); // Manual trigger for testing

// Keep specific routes before the generic :movieId route
// Order matters: more specific routes first
showRouter.get("/:showId/seats", getSeatAvailability); // Real-time seat availability
showRouter.get("/:showId/seatmap", async (req, res) => {
  try {
    const { showId } = req.params;
    const show = await Show.findById(showId)
      .populate("seatMap")
      .populate("movie", "_id title")
      .populate("theatre", "_id name city address");
    if (!show) return res.status(404).json({ error: "Show not found" });
    if (!show.seatMap) return res.status(400).json({ error: "No seatMap linked to this show" });
    res.json({
      show: {
        id: show._id,
        movie: show.movie,
        theatre: show.theatre,
        screenName: show.screenName,
        showDateTime: show.showDateTime,
        price: show.showPrice,
        priceTiers: show.priceTiers || {},
      },
      layout: {
        id: show.seatMap._id,
        name: show.seatMap.name,
        grid: show.seatMap.grid,
        aisles: show.seatMap.aisles || [],
        sections: show.seatMap.sections || [],
        seats: show.seatMap.seats,
      },
      availability: show.occupiedSeats || {},
    });
  } catch (err) {
    console.error("GET /api/show/:showId/seatmap error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

showRouter.get("/:movieId", getShow);

export default showRouter;
