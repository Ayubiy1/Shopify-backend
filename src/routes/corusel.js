const express = require("express");
const router = express.Router();

const Carousel = require("../models/Corusel");
const upload = require("../middleware/upload");
const Corusel = require("../models/Corusel");

// CREATE
router.post("/", async (req, res) => {
  console.log(req.body);
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
  // console.log(req.body);

  try {
    const carousel = await Carousel.findById(req.params.id);
    res.json(carousel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put("/:id", upload.single("image"), async (req, res) => {
  console.log(req.body);

  try {
    const data = {
      category: req.body.category,
    };

    if (req.file) {
      data.image = req.file.path; // 🔥 Cloudinary URL
    }

    const updated = await Corusel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    console.log(updated);

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ADD VIEW
router.patch("/:id/view", async (req, res) => {
  try {
    await Corusel.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id/click", async (req, res) => {
  try {
    await Corusel.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// router.put("/:id", async (req, res) => {
//   try {
//     const updated = await Carousel.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     console.log(updated);

//     // res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

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
