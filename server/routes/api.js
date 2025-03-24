const express = require('express');
const router = express.Router();
const ActivityLog = require('../models/ActivityLog');

// In-memory storage for current activity (for simplicity; use Redis in production)
let currentActivity = null;
let startTime = null;

// Start or switch activity
router.post('/start', async (req, res) => {
  const { activity } = req.body;

  try {
    // If there's an active activity, stop it and log the duration
    if (currentActivity && startTime) {
      const duration = (new Date() - startTime) / 1000; // Duration in seconds
      const log = new ActivityLog({
        name: currentActivity,
        duration,
        date: new Date(),
      });
      await log.save();
    }

    // Start the new activity
    currentActivity = activity;
    startTime = new Date();
    res.json({ currentActivity, startTime });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start activity' });
  }
});

// Stop the current activity
router.post('/stop', async (req, res) => {
  try {
    if (currentActivity && startTime) {
      const duration = (new Date() - startTime) / 1000;
      const log = new ActivityLog({
        name: currentActivity,
        duration,
        date: new Date(),
      });
      await log.save();
    }

    currentActivity = null;
    startTime = null;
    res.json({ currentActivity: null, startTime: null });
  } catch (error) {
    res.status(500).json({ error: 'Failed to stop activity' });
  }
});

// Get current activity
router.get('/current', (req, res) => {
  res.json({ currentActivity, startTime });
});

// Get daily logs
router.get('/logs', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const logs = await ActivityLog.find({
      date: { $gte: today },
    });
    const dailyLogs = logs.reduce((acc, log) => {
      acc[log.name] = (acc[log.name] || 0) + log.duration;
      return acc;
    }, {});
    res.json(dailyLogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

module.exports = router;
