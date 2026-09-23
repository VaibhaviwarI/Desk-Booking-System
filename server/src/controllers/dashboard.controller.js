const Booking = require("../models/Booking");
const Floor = require("../models/Floor");
const Desk = require("../models/Desk");
const Waitlist = require("../models/Waitlist");

const getDashboardStats = async (req, res) => {
  try {
    const totalFloors = await Floor.countDocuments();
    const totalDesks = await Desk.countDocuments({ isActive: true });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeBookingsToday = await Booking.countDocuments({
      bookingDate: { $gte: today },
      status: "BOOKED",
    });

    const checkedInToday = await Booking.countDocuments({
      bookingDate: { $gte: today },
      status: "CHECKED_IN",
    });

    const activeWaitlist = await Waitlist.countDocuments({
      status: "WAITLISTED",
    });

    const floorOccupancy = await Floor.find().select("floorNumber name capacity occupiedCount");

    res.status(200).json({
      success: true,
      stats: {
        totalFloors,
        totalDesks,
        activeBookingsToday,
        checkedInToday,
        activeWaitlist,
        floorOccupancy,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};
