const express = require("express");
const { Resend } = require("resend");

const router = express.Router();
const resend = new Resend({ apiKey: process.env.RESEND_API_KEY });

// vaqtincha saqlash
const otpStore = new Map();

// OTP yuborish
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email kerak" });

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore.set(email, otp);

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Tasdiqlash kodi",
      html: `<h2>Sizning OTP: <b>${otp}</b></h2>`,
    });

    res.json({ success: true, message: "OTP yuborildi" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Email yuborilmadi" });
  }
});

// OTP tasdiqlash
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ error: "Email va OTP kerak" });

  if (Number(otp) === otpStore.get(email)) {
    otpStore.delete(email);
    return res.json({ verified: true });
  }

  res.status(400).json({ verified: false });
});

module.exports = router; // ✅ CommonJS

// import express from "express";
// const router = express.Router();

// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// // vaqtincha saqlash (demo uchun)
// const otpStore = new Map();

// router.post("/send-otp", async (req, res) => {
//   const { email } = req.body;

//   const otp = Math.floor(100000 + Math.random() * 900000);
//   otpStore.set(email, otp);

//   await resend.emails.send({
//     from: "onboarding@resend.dev",
//     to: email,
//     subject: "Tasdiqlash kodi",
//     html: `<h2>Sizning OTP: <b>${otp}</b></h2>`,
//   });

//   res.json({ success: true });
// });

// router.post("/verify-otp", (req, res) => {
//   const { email, otp } = req.body;

//   if (Number(otp) === otpStore.get(email)) {
//     otpStore.delete(email);
//     return res.json({ verified: true });
//   }

//   res.status(400).json({ verified: false });
// });

// module.exports = router;
