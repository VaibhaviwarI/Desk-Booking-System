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

const cancelWaitlist = async (req, res) => {
  try {
    const waitlist = await Waitlist.findOne({
      _id: req.params.waitlistId,
      user: req.user._id,
    });

    if (!waitlist) {
      return res.status(404).json({
        success: false,
        message: "Waitlist entry not found",
      });
    }

    if (waitlist.status !== "WAITLISTED") {
      return res.status(400).json({
        success: false,
        message: "Waitlist entry cannot be cancelled",
      });
    }

    waitlist.status = "CANCELLED";
    await waitlist.save();

    res.status(200).json({
      success: true,
      message: "Waitlist entry cancelled successfully",
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
  cancelWaitlist,
};