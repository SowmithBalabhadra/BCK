import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    owner_email: { type: String, default: false }
});

const itemModel = mongoose.models.food || mongoose.model("items", itemSchema);
export default itemModel;
