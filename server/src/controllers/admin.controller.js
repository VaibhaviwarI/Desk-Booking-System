const User = require("../models/User");
const Booking = require("../models/Booking");
const Waitlist = require("../models/Waitlist");
const Floor = require("../models/Floor");
const Desk = require("../models/Desk");

/* =========================================================
   GET ALL USERS (ADMIN)
========================================================= */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("team", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   UPDATE USER ROLE / TEAM (ADMIN)
========================================================= */
const updateUserRole = async (req, res) => {
  try {
    const { role, team } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (role) user.role = role;
    if (team !== undefined) user.team = team;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        team: user.team,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   GET ALL BOOKINGS OVERVIEW (ADMIN)
========================================================= */
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email role")
      .populate("desk", "deskNumber zone deskType")
      .populate("floor", "floorNumber name")
      .sort({ bookingDate: -1 });

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
   GET SYSTEM OVERVIEW STATS (ADMIN)
========================================================= */
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFloors = await Floor.countDocuments();
    const totalDesks = await Desk.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: "BOOKED" });
    const waitlistedCount = await Waitlist.countDocuments({ status: "WAITLISTED" });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalFloors,
        totalDesks,
        activeBookings,
        waitlistedCount,
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
  getAllUsers,
  updateUserRole,
  getAllBookings,
  getAdminStats,
};
