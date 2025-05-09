import mongoose from "mongoose";

// Define the schema for the Admin model
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, sparse: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name_of_the_shop: { type: String, unique: true, required: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
//hdsdfns
// Create the Admin model
const adminModel =
  mongoose.models.admin || mongoose.model("seller", adminSchema);

export default adminModel;