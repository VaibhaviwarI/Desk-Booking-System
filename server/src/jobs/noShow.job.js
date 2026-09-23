const cron = require("node-cron");
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Waitlist = require("../models/Waitlist");
const Floor = require("../models/Floor");
const { BOOKING_STATUS } = require("../constants/booking.constants");

/**
 * Process no-show bookings atomically using MongoDB transactions.
 * Expiring the booking and reassigning to a waitlisted user occurs in a single transaction.
 */
const processNoShows = async () => {
  try {
    const now = new Date();
    const expiredBookings = await Booking.find({
      status: BOOKING_STATUS.BOOKED,
      expiresAt: { $lt: now },
    });

    for (const booking of expiredBookings) {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Mark current booking as EXPIRED
        booking.status = BOOKING_STATUS.EXPIRED;
        await booking.save({ session });

        // Find earliest waitlisted user for this floor, date, and time slot
        const waitlistEntry = await Waitlist.findOne({
          floor: booking.floor,
          bookingDate: booking.bookingDate,
          timeSlot: booking.timeSlot,
          status: "WAITLISTED",
        })
          .sort({ createdAt: 1 })
          .session(session);

        if (waitlistEntry) {
          // Reassign released desk to waitlisted user
          await Booking.create(
            [
              {
                user: waitlistEntry.user,
                desk: booking.desk,
                floor: booking.floor,
                bookingDate: booking.bookingDate,
                timeSlot: booking.timeSlot,
                expiresAt: new Date(
                  new Date(booking.bookingDate).setHours(10, 0, 0, 0)
                ),
                status: BOOKING_STATUS.BOOKED,
              },
            ],
            { session }
          );

          waitlistEntry.status = "ASSIGNED";
          await waitlistEntry.save({ session });
        } else {
          // Decrement floor occupancy if desk was not reassigned
          await Floor.findByIdAndUpdate(
            booking.floor,
            { $inc: { occupiedCount: -1 } },
            { session }
          );
        }

        await session.commitTransaction();
        session.endSession();
      } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(
          `Failed to process no-show transaction for booking ${booking._id}:`,
          err.message
        );
      }
    }
  } catch (error) {
    console.error("Error running processNoShows job:", error.message);
  }
};

const initNoShowJob = () => {
  // Run no-show processor every 15 minutes
  cron.schedule("*/15 * * * *", () => {
    processNoShows();
  });
};

module.exports = {
  processNoShows,
  initNoShowJob,
};
