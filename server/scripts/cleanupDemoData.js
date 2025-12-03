// server/scripts/cleanupDemoData.js
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import Theatre from "../models/Theatre.js";
import SeatMap from "../models/SeatMap.js";

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing in server/.env");

  // If your server connects to `${MONGODB_URI}/quickshow`,
  // and you want to clean THAT db, uncomment the next line:
  // const dbUri = `${uri}/quickshow`;
  const dbUri = uri;

  await mongoose.connect(dbUri);
  console.log("✅ Connected:", mongoose.connection.name);

  // Find the demo movie id (if any)
  const demoMovie = await Movie.findOne({ title: "KukiShow Seed Movie" }).select("_id");
  const demoMovieId = demoMovie?._id;

  // Delete shows tied to demo movie or demo theatre/screens
  const theatreDel = await Theatre.deleteMany({ name: "KukiShow Demo Theatre" });
  const seatmapDel = await SeatMap.deleteMany({ name: { $regex: /^Layout-/ } });
  const showDelByMovie = demoMovieId ? await Show.deleteMany({ movie: demoMovieId }) : { deletedCount: 0 };
  // Also remove any shows we seeded by screenName convention
  const showDelByScreen = await Show.deleteMany({ screenName: { $in: ["Screen 1", "Screen 2"] } });

  // Delete the demo movie
  const movieDel = await Movie.deleteOne({ title: "KukiShow Seed Movie" });

  console.log("🧹 Cleanup summary:");
  console.log("  Theatres removed:", theatreDel.deletedCount);
  console.log("  SeatMaps removed:", seatmapDel.deletedCount);
  console.log("  Shows removed (by movie):", showDelByMovie.deletedCount);
  console.log("  Shows removed (by screenName):", showDelByScreen.deletedCount);
  console.log("  Movie removed:", movieDel.deletedCount);

  await mongoose.disconnect();
  console.log("✅ Done.");
}

run().catch(async (e) => {
  console.error(e);
  await mongoose.disconnect();
  process.exit(1);
});
