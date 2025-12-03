import mongoose from "mongoose";

const screenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seatMap: { type: mongoose.Schema.Types.ObjectId, ref: "SeatMap" },
});

const theatreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true, index: true },
    address: { type: String, default: "" },
    screens: [screenSchema],
  },
  { timestamps: true }
);

const Theatre = mongoose.models.Theatre || mongoose.model("Theatre", theatreSchema);
export default Theatre;
