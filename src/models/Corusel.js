const express = require("express");
const mongoose = require("mongoose");

const CarouselSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  category: String,
});

module.exports = mongoose.model("Carousel", CarouselSchema);
