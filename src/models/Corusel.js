const express = require("express");
const mongoose = require("mongoose");

const CarouselSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  category: String,
  views: {
    type: Number,
    default: 0,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  status: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Carousel", CarouselSchema);
