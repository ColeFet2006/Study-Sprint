const express = require("express");
const router = express.Router();
const Session = require("../models/Session");

// GET all sessions
router.get("/", async (req, res) => {
  try {
    const sessions = await Session.find().sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sessions." });
  }
});

// POST a new session
router.post("/", async (req, res) => {
  try {
    const { major, studyTopic, extraNotes, minutes, date } = req.body;

    if (!major || !studyTopic || !minutes || !date) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const newSession = new Session({
      major,
      studyTopic,
      extraNotes,
      minutes,
      date
    });

    const savedSession = await newSession.save();
    res.status(201).json(savedSession);
  } catch (error) {
    res.status(500).json({ error: "Failed to save session." });
  }
});

// DELETE all sessions
router.delete("/", async (req, res) => {
  try {
    await Session.deleteMany({});
    res.json({ message: "All sessions deleted." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete sessions." });
  }
});

module.exports = router;