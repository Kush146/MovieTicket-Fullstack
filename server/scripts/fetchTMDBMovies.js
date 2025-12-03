// server/scripts/fetchTMDBMovies.js
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Movie from "../models/Movie.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const { MONGODB_URI, TMDB_API_KEY, TMDB_BEARER } = process.env;

if (!MONGODB_URI) throw new Error("MONGODB_URI missing in server/.env");
if (!TMDB_API_KEY && !TMDB_BEARER)
  throw new Error("Add TMDB_API_KEY (v3) or TMDB_BEARER (v4) to server/.env");

const useV3 = Boolean(TMDB_API_KEY); // ✅ will be true
const BASE = "https://api.themoviedb.org/3";
const REGION = "IN";


function buildUrl(pathname, params = {}) {
  // explicit URL builder to avoid double-basing bugs
  const qp = new URLSearchParams(params);
  if (useV3) qp.set("api_key", TMDB_API_KEY);
  const qs = qp.toString();
  return `${BASE}${pathname}${qs ? "?" + qs : ""}`;
}

async function tmdbGET(pathname, params = {}) {
  const url = buildUrl(pathname, params);
  const headers = TMDB_BEARER
    ? { Authorization: `Bearer ${TMDB_BEARER}`, Accept: "application/json" }
    : { Accept: "application/json" };

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`TMDB ${pathname} ${res.status}: ${text}\nURL: ${url}`);
  }
  return res.json();
}

async function getNowPlaying(page = 1) {
  return tmdbGET("/movie/now_playing", {
    language: "en-US",
    page: String(page),
    region: REGION,
  });
}

async function getMovieDetails(id) {
  // includes runtime
  return tmdbGET(`/movie/${id}`, { language: "en-US" });
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  const page1 = await getNowPlaying(1);
  const results = page1.results || [];
  console.log(`📥 TMDB now_playing fetched ${results.length} items`);

  let upserted = 0;

  for (const m of results) {
    let runtime = 120;
    try {
      const details = await getMovieDetails(m.id);
      runtime = details.runtime || 120;
    } catch (e) {
      console.warn(`⚠️ runtime fetch failed for id=${m.id}: ${e.message}`);
    }

    await Movie.updateOne(
      { _id: m.id }, // your schema likely uses numeric TMDB id as _id
      {
        _id: m.id,
        title: m.title ?? "",
        overview: m.overview ?? "",
        poster_path: m.poster_path ?? "",
        backdrop_path: m.backdrop_path ?? "",
        release_date: m.release_date ?? "",
        vote_average: typeof m.vote_average === "number" ? m.vote_average : 0,
        runtime,
      },
      { upsert: true }
    );
    upserted++;
  }

  console.log(`🎬 Upserted ${upserted} movies from TMDB (region=${REGION}).`);
  await mongoose.disconnect();
  console.log("✅ Done.");
}

run().catch(async (e) => {
  console.error(e);
  try { await mongoose.disconnect(); } catch {}
  // no process.exit — let Node close cleanly (prevents UV_HANDLE_CLOSING on Windows)
});
