const Waitlist = require("../models/Waitlist");

const getMyWaitlist = async (req, res) => {
  try {
    const waitlists = await Waitlist.find({
      user: req.user._id,
    })
      .populate("floor", "floorNumber name")
      .sort({ bookingDate: -1 });

    res.status(200).json({
      success: true,
      waitlists,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMyWaitlist,
};