import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: "Processing Order" },
  date: { type: Date, default: Date.now() },
  payment: { type: Boolean, default: false },
  owner_email: { type: String, default: false }  // Added field
});

// Index for querying orders by user and date
orderSchema.index({ userId: 1 });
orderSchema.index({ date: -1 });

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
