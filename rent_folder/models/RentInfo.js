import mongoose from 'mongoose';

const RentInfoSchema = new mongoose.Schema({
  ownerOfStore: { type: String, required: true },
  location: { type: String, required: true },
  sqft: { type: Number, required: true },
  price: { type: Number, required: true },
  renterOfStore: { type: String, required: true },
  rentId: { type: Number, required: true },

  is_profit: { type: Boolean, default: true },
  is_normal: { type: Boolean, default: false },
  is_loss: { type: Boolean, default: false },

  rent_giver_gmail: { type: String },
  rent_taker_gmail: { type: String }
});

// Helpful indexes
RentInfoSchema.index({ location: 1 });
RentInfoSchema.index({ rentId: 1 });
RentInfoSchema.index({ ownerOfStore: 1 });
RentInfoSchema.index({ renterOfStore: 1 });

export default mongoose.model('RentInfo', RentInfoSchema);

// Custom validation could be enabled as needed
