import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
    },
    college: {
      type: String,
      trim: true,
      required: true,
    },
    dataScience: {
      type: Boolean,

      required: true,
    },
    dataStructures: {
      type: Boolean,

      required: true,
    },
    workshopA: {
      type: Boolean,
      required: true,
    },
    workshopB: {
      type: Boolean,
      required: true,
    },
    earlyBirdDataStructure: {
      type: Boolean,
    },
    earlyBirdDataScience: {
      type: Boolean,
    },
    earlyBirdWorkshopA: {
      type: Boolean,
    },
    earlyBirdWorkshopB: {
      type: Boolean,
    },
    amount: {
      type: String,
      trim: true,
      required: true,
    },
    paymentId: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
