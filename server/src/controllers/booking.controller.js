const mongoose = require("mongoose");

const Booking = require("../models/Booking");
const Desk = require("../models/Desk");
const Floor = require("../models/Floor");

const getDistance = require("../utils/distance");
    const Waitlist = require("../models/Waitlist");

const { TEAM_QUOTA_PER_FLOOR } = require("../constants/office.constants");
const { BOOKING_STATUS } = require("../constants/booking.constants");

/* =========================================================
   BOOK DESK
========================================================= */

const bookDesk = async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const { floorId, bookingDate, timeSlot } = req.body;

    const userId = req.user._id;

    /* ---------- 1. CHECK FLOOR ---------- */

    const floor = await Floor.findById(floorId);

    if (!floor) {
      throw new Error("Floor not found");
    }

    /* ---------- 2. FLOOR CAPACITY ---------- */

    if (floor.occupiedCount >= floor.capacity) {
      throw new Error("Floor capacity reached");
    }

    /* ---------- 3. USER ALREADY BOOKED? ---------- */

    // One user can have only one booking per slot.
    const existingBooking = await Booking.findOne({
      user: userId,
      bookingDate,
      timeSlot,
      status: BOOKING_STATUS.BOOKED,
    });

    if (existingBooking) {
      throw new Error("You already booked a desk for this slot");
    }

    /* ---------- 4. TEAM QUOTA ---------- */

    // Fetch all bookings of this floor/date and populate only teammates.
    const teamBookingsForQuota = await Booking.find({
      floor: floorId,
      bookingDate,
      status: BOOKING_STATUS.BOOKED,
    }).populate({
      path: "user",
      match: {
        team: req.user.team,
      },
    });

    const teamBookingCount = teamBookingsForQuota.filter(
      (booking) => booking.user
    ).length;

    if (teamBookingCount >= TEAM_QUOTA_PER_FLOOR) {
      throw new Error("Team quota reached on this floor");
    }

    /* ---------- 5. GET ALL ACTIVE DESKS ---------- */

    const desks = await Desk.find({
      floor: floorId,
      isActive: true,
    }).sort({
      zone: 1,
      deskNumber: 1,
    });

    /* ---------- 6. GET ALREADY BOOKED DESKS ---------- */

    const bookedDeskIds = await Booking.find({
      floor: floorId,
      bookingDate,
      timeSlot,
      status: BOOKING_STATUS.BOOKED,
    }).distinct("desk");

    /* ---------- 7. FILTER AVAILABLE DESKS ---------- */

    const availableDesks = desks.filter(
      (desk) => !bookedDeskIds.some((id) => id.equals(desk._id))
    );

    // if (availableDesks.length === 0) {
    //   throw new Error("No desk available on this floor");
    // }


if (availableDesks.length === 0) {

  await Waitlist.create({
    user: userId,
    floor: floorId,
    bookingDate,
    timeSlot,
  });

  await session.commitTransaction();
  session.endSession();

  return res.status(200).json({
    success: true,
    waitlisted: true,
    message: "No desks available. Added to waitlist.",
  });

}

    let selectedDesk = null;

    /* ---------- 8. FIXED DESK PRIORITY ---------- */

    // If employee owns a fixed desk, always allocate it.
    const fixedDesk = availableDesks.find(
      (desk) =>
        desk.deskType === "FIXED" &&
        desk.reservedFor &&
        desk.reservedFor.equals(userId)
    );

    if (fixedDesk) {
      selectedDesk = fixedDesk;
    }

    /* ---------- 9. TEAM NEIGHBOURHOOD ---------- */

    if (!selectedDesk) {
      const teamBookings = await Booking.find({
        bookingDate,
        floor: floorId,
        status: BOOKING_STATUS.BOOKED,
      })
        .populate({
          path: "user",
          match: {
            team: req.user.team,
          },
        })
        .populate("desk");

      const teammateDesks = teamBookings
        .filter((booking) => booking.user)
        .map((booking) => booking.desk);

      // First teammate on floor.
      if (teammateDesks.length === 0) {
        selectedDesk = availableDesks[0];
      } else {
        // Find team's centroid.
        const centroid = {
          x:
            teammateDesks.reduce((sum, desk) => sum + desk.x, 0) /
            teammateDesks.length,

          y:
            teammateDesks.reduce((sum, desk) => sum + desk.y, 0) /
            teammateDesks.length,
        };

        // Sort desks by distance from centroid.
        availableDesks.sort((a, b) => {
          const distanceA = getDistance(a, centroid);
          const distanceB = getDistance(b, centroid);

          return distanceA - distanceB;
        });

        selectedDesk = availableDesks[0];
      }
    }

    /* ---------- 10. CREATE BOOKING ---------- */

    const booking = await Booking.create(
      [
        {
          user: userId,
          desk: selectedDesk._id,
          floor: floorId,
          bookingDate,
          timeSlot,
          expiresAt: new Date(
            new Date(bookingDate).setHours(10, 0, 0, 0)
          ),
        },
      ],
      { session }
    );

    /* ---------- 11. UPDATE FLOOR OCCUPANCY ---------- */

    // Atomic increment.
    await Floor.findByIdAndUpdate(
      floorId,
      {
        $inc: {
          occupiedCount: 1,
        },
      },
      { session }
    );

    /* ---------- 12. COMMIT TRANSACTION ---------- */

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Desk booked successfully",

      booking: booking[0],

      assignedDesk: {
        deskNumber: selectedDesk.deskNumber,
        zone: selectedDesk.zone,
        deskType: selectedDesk.deskType,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    // Race condition handled by unique index.
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Desk already booked by another employee",
      });
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   GET MY BOOKINGS
========================================================= */

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
    })
      .populate("desk", "deskNumber zone deskType")
      .populate("floor", "floorNumber name")
      .sort({
        bookingDate: -1,
      });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   CANCEL BOOKING
========================================================= */

const cancelBooking = async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      user: req.user._id,
    }).session(session);

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status !== BOOKING_STATUS.BOOKED) {
      throw new Error("Booking cannot be cancelled");
    }

    booking.status = BOOKING_STATUS.CANCELLED;

    await booking.save({ session });

    // Atomic decrement.
    await Floor.findByIdAndUpdate(
      booking.floor,
      {
        $inc: {
          occupiedCount: -1,
        },
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   CHECK-IN BOOKING
========================================================= */

const checkInBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== BOOKING_STATUS.BOOKED) {
      return res.status(400).json({
        success: false,
        message: "Booking already checked in or cancelled",
      });
    }

    booking.status = BOOKING_STATUS.CHECKED_IN;
    booking.checkedInAt = new Date();

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Checked in successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  bookDesk,
  getMyBookings,
  cancelBooking,
  checkInBooking,
};