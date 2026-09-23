const Desk = require("../models/Desk");

const createDesk = async (req, res) => {
  try {
    const { floor, deskNumber, zone, deskType, reservedFor, x, y } = req.body;

    const existing = await Desk.findOne({ floor, deskNumber });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Desk ${deskNumber} already exists on this floor`,
      });
    }

    const desk = await Desk.create({
      floor,
      deskNumber,
      zone: zone || "A",
      deskType: deskType || "FLEXIBLE",
      reservedFor: reservedFor || null,
      x: x || 0,
      y: y || 0,
    });

    res.status(201).json({
      success: true,
      message: "Desk created successfully",
      desk,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getDesks = async (req, res) => {
  try {
    const filter = {};
    if (req.query.floorId) {
      filter.floor = req.query.floorId;
    }

    const desks = await Desk.find(filter)
      .populate("floor", "floorNumber name")
      .populate("reservedFor", "name email")
      .sort({ zone: 1, deskNumber: 1 });

    res.status(200).json({
      success: true,
      desks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateDesk = async (req, res) => {
  try {
    const desk = await Desk.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!desk) {
      return res.status(404).json({
        success: false,
        message: "Desk not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Desk updated successfully",
      desk,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteDesk = async (req, res) => {
  try {
    const desk = await Desk.findByIdAndDelete(req.params.id);
    if (!desk) {
      return res.status(404).json({
        success: false,
        message: "Desk not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Desk deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createDesk,
  getDesks,
  updateDesk,
  deleteDesk,
};
