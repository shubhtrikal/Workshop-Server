import mongoose from 'mongoose';

const promoSchema = new mongoose.Schema(
  {
    promoCode: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    participants: [String],
    discount: {
      type: Number,
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model('Promo', promoSchema);
