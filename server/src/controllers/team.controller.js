const Team = require("../models/Team");
const User = require("../models/User");

const createTeam = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existing = await Team.findOne({ name });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Team name already exists",
      });
    }

    const team = await Team.create({ name, description });

    res.status(201).json({
      success: true,
      message: "Team created successfully",
      team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTeams = async (req, res) => {
  try {
    const teams = await Team.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      teams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const assignUserToTeam = async (req, res) => {
  try {
    const { userId, teamId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    user.team = teamId;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User assigned to team successfully",
      user: {
        _id: user._id,
        name: user.name,
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

module.exports = {
  createTeam,
  getTeams,
  assignUserToTeam,
};
