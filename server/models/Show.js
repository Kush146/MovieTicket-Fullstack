import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
  {
    movie: { type: String, ref: "Movie", required: true }, // String because Movie uses TMDB ID as _id

    theatre: { type: mongoose.Schema.Types.ObjectId, ref: "Theatre", required: false },
    screenName: { type: String, required: false, default: "Screen 1" }, // e.g., "Screen 1"

    showDateTime: { type: Date, required: true, index: true },

    showPrice: { type: Number, required: true },
    priceTiers: { type: Object, default: {} }, // { STD: 250, PRM: 400 }

    seatMap: { type: mongoose.Schema.Types.ObjectId, ref: "SeatMap", required: false },

    // availability snapshot for now
    occupiedSeats: { type: Object, default: {} },
  },
  { timestamps: true, minimize: false }
);

// Prevent duplicate compilation in dev/hot-reload
// Index on movie and showDateTime to prevent duplicate shows for same movie at same time
showSchema.index({ movie: 1, showDateTime: 1 }, { unique: true });

const Show = mongoose.models.Show || mongoose.model("Show", showSchema);
export default Show;
