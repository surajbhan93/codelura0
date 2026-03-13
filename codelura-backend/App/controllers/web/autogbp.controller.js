import {
  generatePostService,
  publishPostService,
  runAutoGBPService
} from "../../services/autogbp.service.js";

import AutoGBPSettings from "../../models/autogbpSettings.model.js";


// Generate AI Post
export const generatePost = async (req, res) => {

  try {

    const { topic } = req.body;

    const post = await generatePostService(topic);

    res.json({
      success: true,
      data: post
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};



// Publish Single Post
export const publishPost = async (req, res) => {

  try {

    const { id, accountId, locationId } = req.body;

    const post = await publishPostService(id, accountId, locationId);

    res.json({
      success: true,
      data: post
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};



// Save AutoGBP Settings (Account + Locations)
export const saveSettings = async (req, res) => {

  try {

    const { accountId, locations } = req.body;

    const settings = await AutoGBPSettings.findOneAndUpdate(

      {},
      {
        accountId,
        locations,
        enabled: true
      },

      {
        new: true,
        upsert: true
      }

    );

    res.json({
      success: true,
      data: settings
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};



// Get Current Settings
export const getSettings = async (req, res) => {

  try {

    const settings = await AutoGBPSettings.findOne();

    res.json({
      success: true,
      data: settings
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};



// Run Auto Post Manually (Test)
export const runAutoPost = async (req, res) => {

  try {

    await runAutoGBPService();

    res.json({
      success: true,
      message: "AutoGBP executed successfully"
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};