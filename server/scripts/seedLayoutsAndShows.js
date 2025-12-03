// server/scripts/seedLayoutsAndShows.js
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";

// resolve the directory of this file and load env from /server
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI missing. Check server/.env file contents");
  process.exit(1);
}
console.log("✅ Loaded .env, connecting to MongoDB...");

// Models (make sure filenames & imports use exact casing)
import Theatre from "../models/Theatre.js";
import SeatMap from "../models/SeatMap.js";
import Show from "../models/Show.js";
import Movie from "../models/Movie.js";

// -------------------------------------------------------
// Helpers
// -------------------------------------------------------
function makeGridSeatMap({ name, rows, cols, type = "STD", aisleEvery = 0 }) {
  const seats = [];
  for (let r = 0; r < rows; r++) {
    const rowLabel = String.fromCharCode(65 + r); // A, B, C...
    for (let c = 1; c <= cols; c++) {
      seats.push({
        row: rowLabel,
        number: c,
        seatKey: `${rowLabel}${c}`,
        type,
      });
    }
  }
  const aisles =
    aisleEvery && aisleEvery > 0
      ? Array.from({ length: Math.floor(cols / aisleEvery) - 0 }, (_, i) => (i + 1) * aisleEvery)
          .filter((x) => x < cols)
      : [];
  return {
    name,
    grid: { rows, cols },
    aisles,
    sections: [],
    seats,
  };
}

async function upsertSeatMap(doc) {
  const existing = await SeatMap.findOne({ name: doc.name });
  if (existing) return existing;
  return SeatMap.create(doc);
}

// Create a movie that satisfies your Movie schema (required fields)
async function upsertSeedMovie() {
  // Detect if your schema expects a Number or ObjectId for _id
  const idType = Movie.schema.paths._id.instance; // "Number" or "ObjectID"
  const seedId = idType === "Number" ? 999000001 : new mongoose.Types.ObjectId();

  // Try by _id first (best), then by title if someone changed schema
  let movie = await Movie.findOne({ _id: seedId });
  if (movie) return movie;

  movie = await Movie.findOne({ title: "KukiShow Seed Movie" });
  if (movie) return movie;

  // Provide ALL required fields your error listed
  const doc = {
    _id: seedId,
    title: "KukiShow Seed Movie",
    overview: "Seeded movie for testing seat layouts and show creation.",
    poster_path: "/seed-poster.jpg",
    backdrop_path: "/seed-backdrop.jpg",
    release_date: "2025-01-01", // string or Date depending on your schema; string is usually OK with TMDB-style schemas
    vote_average: 8.1,
    runtime: 120,
    // Add any other non-required fields your app uses here:
    // genre_ids: [18],
    // original_language: "en",
  };

  return Movie.create(doc);
}

// -------------------------------------------------------
// Main
// -------------------------------------------------------
async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  // 1) Seat maps
  const mapStandard = await upsertSeatMap(
    makeGridSeatMap({ name: "Layout-Std-5x8", rows: 5, cols: 8, type: "STD", aisleEvery: 4 })
  );
  const mapPremium = await upsertSeatMap(
    makeGridSeatMap({ name: "Layout-Prm-6x10", rows: 6, cols: 10, type: "PRM", aisleEvery: 5 })
  );
  console.log("🎫 Seat maps ready:", mapStandard.name, ",", mapPremium.name);

  // 2) Theatre with two screens
  const theatreName = "KukiShow Demo Theatre";
  const city = "demo-city";
  const address = "Demo Mall, 1st Floor";

  let theatre = await Theatre.findOne({ name: theatreName, city });
  if (!theatre) {
    theatre = await Theatre.create({
      name: theatreName,
      city,
      address,
      screens: [
        { name: "Screen 1", seatMap: mapStandard._id },
        { name: "Screen 2", seatMap: mapPremium._id },
      ],
    });
  } else {
    const screens = theatre.screens || [];
    if (!screens.find((s) => s.name === "Screen 1")) {
      screens.push({ name: "Screen 1", seatMap: mapStandard._id });
    }
    if (!screens.find((s) => s.name === "Screen 2")) {
      screens.push({ name: "Screen 2", seatMap: mapPremium._id });
    }
    theatre.screens = screens;
    await theatre.save();
  }
  console.log("🏢 Theatre:", theatre.name);

  // 3) Seed movie with all required fields
  const movie = await upsertSeedMovie();
  console.log("🎬 Movie:", movie.title, `(idType=${Movie.schema.paths._id.instance})`);

  // 4) Create two shows (one per screen)
  const start1 = new Date(Date.now() + 60 * 60 * 1000); // +1h
  const start2 = new Date(Date.now() + 2 * 60 * 60 * 1000); // +2h

  async function createShowIfMissing({ screenName, seatMapId, time, price }) {
    const exists = await Show.findOne({
      movie: movie._id,
      theatre: theatre._id,
      screenName,
      showDateTime: time,
    });
    if (exists) return exists;

    return Show.create({
      movie: movie._id,
      theatre: theatre._id,
      screenName,
      seatMap: seatMapId,
      showDateTime: time,
      showPrice: price,
      priceTiers: { STD: price, PRM: price + 100 },
      occupiedSeats: {}, // all available
    });
  }

  const show1 = await createShowIfMissing({
    screenName: "Screen 1",
    seatMapId: mapStandard._id,
    time: start1,
    price: 250,
  });

  const show2 = await createShowIfMissing({
    screenName: "Screen 2",
    seatMapId: mapPremium._id,
    time: start2,
    price: 300,
  });

  console.log("🕒 Shows created:");
  console.log("   • Show 1:", show1._id.toString(), "at", show1.showDateTime.toISOString());
  console.log("   • Show 2:", show2._id.toString(), "at", show2.showDateTime.toISOString());

  console.log("\n✅ Done! Test endpoints:");
  console.log(`GET /api/shows/${show1._id.toString()}/seatmap`);
  console.log(`GET /api/shows/${show2._id.toString()}/seatmap`);

  await mongoose.disconnect();
  process.exit(0);
}

run().catch(async (e) => {
  console.error(e);
  await mongoose.disconnect();
  process.exit(1);
});
