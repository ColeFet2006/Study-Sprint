const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    major: {
      type: String,
      required: true,
      trim: true
    },
    studyTopic: {
      type: String,
      required: true,
      trim: true
    },
    extraNotes: {
      type: String,
      default: "",
      trim: true
    },
    minutes: {
      type: Number,
      required: true,
      min: 1
    },
    date: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Session", sessionSchema);