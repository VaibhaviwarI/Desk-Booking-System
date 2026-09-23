const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    desk: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Desk",
      required: true,
    },

    floor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Floor",
      required: true,
    },

    bookingDate: {
      type: Date,
      required: true,
    },

    timeSlot: {
      type: String,
      enum: ["FULL_DAY", "FIRST_HALF", "SECOND_HALF"],
      default: "FULL_DAY",
    },

    status: {
      type: String,
      enum: [
        "BOOKED",
        "CHECKED_IN",
        "CANCELLED",
        "EXPIRED"
      ],
      default: "BOOKED",
    },

    checkedInAt: Date,

    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);

bookingSchema.index(
  {
    desk: 1, //in ascending order
    bookingDate: 1,
    timeSlot: 1,
  },
  {
    unique: true,
  }
);
//"No two bookings may have the same desk AND same date AND same timeSlot at the same time."

// Two requests both try to INSERT a booking with the same (desk, bookingDate, timeSlot).

// MongoDB writes both (or attempts to) — it doesn't stop the second one at the door.

// When writing the unique index entry, MongoDB detects the duplicate key.

// It rejects the second insert with E11000 duplicate key error.