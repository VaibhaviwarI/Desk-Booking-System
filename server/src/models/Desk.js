const mongoose = require("mongoose");

const deskSchema = new mongoose.Schema(
  {
    floor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Floor",
      required: true,
    },
    deskNumber: {
      type: String,
      required: true,
    },
    zone: {
      type: String,
      default: "A",
    },
    deskType: {
      type: String,
      enum: ["FLEXIBLE", "FIXED"],
      default: "FLEXIBLE",
    },
    reservedFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    x: {
      type: Number,
      default: 0,
    },
    y: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

deskSchema.index({ floor: 1, deskNumber: 1 }, { unique: true });

module.exports = mongoose.model("Desk", deskSchema);
