import mongoose from 'mongoose';

const RentSchema = new mongoose.Schema({
  rent_id: { type: Number, required: true, unique: true },
  ownerOfStore: { type: String, required: true },
  location: { type: String, required: true },
  sqft: { type: Number, required: true },
  price: { type: Number, required: true }
});

// Indexes for filtering
RentSchema.index({ location: 1 });
RentSchema.index({ ownerOfStore: 1 });

export default mongoose.model('Rent', RentSchema);
