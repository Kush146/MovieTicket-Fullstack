import 'dotenv/config.js';                 // loads .env automatically
import connectDB from '../configs/db.js';  // reuse your existing connection code
import Theatre from '../models/Theatre.js';

const data = [
  { name: "PVR Phoenix Palladium", city: "mumbai", address: "Lower Parel" },
  { name: "INOX R-City",            city: "mumbai", address: "Ghatkopar" },
  { name: "Carnival Treasure Island", city: "indore", address: "TI Mall" },
  { name: "INOX Sapna Sangeeta",    city: "indore", address: "Sapna Sangeeta Rd" },
  { name: "Balaghat Talkies",       city: "balaghat", address: "Gandhi Ward" },
  { name: "PVR Kumar Pacific",      city: "pune", address: "Kumar Pacific Mall" },
  { name: "City Pride Kothrud",     city: "pune", address: "Kothrud" },
  { name: "INOX Raghuleela",        city: "navi mumbai", address: "Vashi" },
  { name: "Cinemax Seawoods",       city: "navi mumbai", address: "Seawoods Grand Central" },
];

(async () => {
  try {
    await connectDB(); // uses whatever your db.js expects (MONGO_URI / MONGO_URL)
    await Theatre.deleteMany({});
    await Theatre.insertMany(data);
    console.log("Seeded theatres:", data.length);
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
})();
