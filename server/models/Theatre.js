import mongoose from "mongoose";

const theatreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true, index: true },   // use lowercase in data
  address: { type: String, default: "" },
}, { timestamps: true });

const Theatre = mongoose.model("Theatre", theatreSchema);
export default Theatre;
