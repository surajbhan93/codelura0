import Team from "../../models/Team.js";

/* =========================
   Create Team Member
========================= */
export const createTeam = async (req, res) => {
  try {
    const {
      name,
      role,
      image,
      description,
      linkedin,
      github,
      email,
      isActive,
    } = req.body;

    if (!name || !role || !image) {
      return res.status(400).json({
        success: false,
        message: "Name, role and image are required.",
      });
    }

    const team = await Team.create({
      name,
      role,
      image,
      description,
      linkedin,
      github,
      email,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Team member added successfully.",
      data: team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* =========================
   Get Active Team
========================= */
export const getTeam = async (req, res) => {
  try {
    const team = await Team.find({
      isActive: true,
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* =========================
   Get All Team (Admin)
========================= */
export const getAllTeam = async (req, res) => {
  try {
    const team = await Team.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* =========================
   Update Team
========================= */
export const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findById(id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    Object.assign(team, req.body);

    await team.save();

    res.status(200).json({
      success: true,
      message: "Team member updated successfully.",
      data: team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* =========================
   Delete Team
========================= */
export const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findByIdAndDelete(id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Team member deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* =========================
   Toggle Active Status
========================= */
export const toggleTeamStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findById(id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    team.isActive = !team.isActive;

    await team.save();

    res.status(200).json({
      success: true,
      message: `Team member ${
        team.isActive ? "activated" : "deactivated"
      } successfully.`,
      data: team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};