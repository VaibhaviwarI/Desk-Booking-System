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
      enum: ["BOOKED", "CHECKED_IN", "CANCELLED", "EXPIRED"],
      default: "BOOKED",
    },

    checkedInAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// One desk cannot be booked twice for the same slot (only enforced on active BOOKED records)
bookingSchema.index(
  {
    desk: 1,
    bookingDate: 1,
    timeSlot: 1,
  },
  {
    unique: true,
    partialFilterExpression: { status: "BOOKED" },
  }
);

// One user cannot book two desks in the same slot (only enforced on active BOOKED records)
bookingSchema.index(
  {
    user: 1,
    bookingDate: 1,
    timeSlot: 1,
  },
  {
    unique: true,
    partialFilterExpression: { status: "BOOKED" },
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
//"No two bookings may have the same desk AND same date AND same timeSlot at the same time."

// Two requests both try to INSERT a booking with the same (desk, bookingDate, timeSlot).

// MongoDB writes both (or attempts to) — it doesn't stop the second one at the door.

// When writing the unique index entry, MongoDB detects the duplicate key.

// It rejects the second insert with E11000 duplicate key error.