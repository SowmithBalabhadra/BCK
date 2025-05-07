import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} }
}, { minimize: false });

// 🔍 Indexes for better performance
userSchema.index({ email: 1 });     // Email is already unique, but indexing makes queries faster
userSchema.index({ name: 1 });      // Helpful if searching/filtering by name

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
