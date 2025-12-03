import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  row: { type: String, required: true },
  number: { type: Number, required: true },
  seatKey: { type: String, required: true, index: true },
  type: { type: String, default: "STD" },
});

const seatMapSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    grid: { rows: Number, cols: Number },
    aisles: [Number],
    sections: [{ id: String, label: String }],
    seats: { type: [seatSchema], required: true },
  },
  { timestamps: true }
);

const SeatMap = mongoose.models.SeatMap || mongoose.model("SeatMap", seatMapSchema);
export default SeatMap;
