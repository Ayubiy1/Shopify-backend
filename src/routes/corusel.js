const express = require("express");
const router = express.Router();

const Carousel = require("../models/Corusel");

// CREATE
router.post("/", async (req, res) => {
  try {
    const newCarousel = new Carousel(req.body);
    await newCarousel.save();
    res.status(201).json(newCarousel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ all
router.get("/", async (req, res) => {
  try {
    const carousels = await Carousel.find();
    res.json(carousels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ one
router.get("/:id", async (req, res) => {
  try {
    const carousel = await Carousel.findById(req.params.id);
    res.json(carousel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updated = await Carousel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Carousel.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
