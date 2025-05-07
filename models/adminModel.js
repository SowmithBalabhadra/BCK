import mongoose from "mongoose";

// Define the schema for the Admin model
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true ,sparse: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Admin model
const adminModel =
  mongoose.models.admin || mongoose.model("seller", adminSchema);

export default adminModel;


