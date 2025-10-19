// server/routes/theatres.js
import express from "express";
import Theatre from "../models/Theatre.js";

const theatresRouter = express.Router();

// GET /api/theatres?city=mumbai
theatresRouter.get("/", async (req, res) => {
  try {
    const city = (req.query.city || "").toLowerCase().trim();
    const filter = city ? { city } : {};
    const theatres = await Theatre.find(filter).sort({ name: 1 });
    res.json(theatres);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch theatres" });
  }
});

export default theatresRouter;
