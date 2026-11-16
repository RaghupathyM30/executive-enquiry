const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Enquiry = require("./models/Enquiry");

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Submit enquiry
app.post("/api/enquiry", async (req, res) => {
  try {
    const { name, email, phone, programme, message } = req.body;

    const errors = {};

    if (!name || !name.trim()) {
      errors.name = "Please enter your name";
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!phone || !/^\+?[0-9\s()-]{7,20}$/.test(phone) ||
        phone.replace(/\D/g, "").length < 7 ||
        phone.replace(/\D/g, "").length > 15) {
      errors.phone = "Please enter a valid phone number";
    }

    if (!programme || !programme.trim()) {
      errors.programme = "Please select a programme";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const enquiry = await Enquiry.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      programme: programme.trim(),
      message: message || ""
    });

    res.status(201).json({
      success: true,
      message: "Your enquiry has been submitted successfully."
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again."
    });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000");
});