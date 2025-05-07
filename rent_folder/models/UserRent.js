import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
  typeOfCustomer: {
    type: String,
    enum: ['ShopOwner', 'Shoptaker'],
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
      '{VALUE} is not a valid email address!'
    ]
  },
  otp: {
    type: String,
    default: null
  },
  otpExpiresAt: {
    type: Date,
    default: null
  },
  isActive: { type: Boolean, default: false },
  verificationToken: { type: String, default: null },
  tokenExpiresAt: { type: Date, default: null }
});

// Email already unique, but we add index for type of customer
UserSchema.index({ typeOfCustomer: 1 });

export default mongoose.model('UserRent', UserSchema);
