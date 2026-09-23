const Floor = require("../models/Floor");

const createFloor = async (req, res) => {
  try {
    const { floorNumber, name, capacity } = req.body;

    const existing = await Floor.findOne({ floorNumber });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Floor number ${floorNumber} already exists`,
      });
    }

    const floor = await Floor.create({
      floorNumber,
      name,
      capacity,
    });

    res.status(201).json({
      success: true,
      message: "Floor created successfully",
      floor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getFloors = async (req, res) => {
  try {
    const floors = await Floor.find().sort({ floorNumber: 1 });
    res.status(200).json({
      success: true,
      floors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateFloor = async (req, res) => {
  try {
    const floor = await Floor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!floor) {
      return res.status(404).json({
        success: false,
        message: "Floor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Floor updated successfully",
      floor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteFloor = async (req, res) => {
  try {
    const floor = await Floor.findByIdAndDelete(req.params.id);
    if (!floor) {
      return res.status(404).json({
        success: false,
        message: "Floor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Floor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createFloor,
  getFloors,
  updateFloor,
  deleteFloor,
};
