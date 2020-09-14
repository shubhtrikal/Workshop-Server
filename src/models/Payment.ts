import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,

      trim: true,
    },
    entity: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      trim: true,
      required: true,
    },
    currency: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      trim: true,
    },
    order_id: {
      type: String,
      nullable: true,
    },
    invoice_id: {
      type: String,
      nullable: true,
    },
    international: {
      type: Boolean,
      trim: true,
    },
    method: {
      type: String,
      trim: true,
    },
    amount_refunded: {
      type: String,
      trim: true,
    },
    refund_status: {
      type: String,
      trim: true,
      nullable: true,
    },
    captured: {
      type: Boolean,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      nullable: true,
    },
    card_id: {
      type: String,
      trim: true,
      nullable: true,
    },
    bank: {
      type: String,
      trim: true,
      nullable: true,
    },
    createdAt: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", paymentSchema);
