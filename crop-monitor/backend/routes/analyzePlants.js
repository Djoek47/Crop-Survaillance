// backend/routes/analyzePlants.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const multer = require('multer');
const upload = multer();

const ARIA_API_URL = 'https://api.rhymes.ai/v1/chat/completions';
const ARIA_API_KEY = 'YOUR_ARIA_API_KEY'; // Replace with your actual API key

router.post('/', upload.single('image'), async (req, res) => {
  try {
    // Prepare the payload for ARIA
    const formData = {
      model: "aria",
      messages: [
        {
          role: "user",
          content: "Analyze this image for plant or tree count."
        }
      ]
    };

    // Send request to ARIA API
    const response = await axios.post(ARIA_API_URL, formData, {
      headers: {
        Authorization: `Bearer ${ARIA_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Extract the plant data from ARIA's response
    const plantData = response.data?.choices?.[0]?.message?.content;
    res.json({
      plantCount: plantData.plantCount || 0,
      vitality: plantData.vitality || 0,
      location: plantData.location || [51.505, -0.09], // Default location if none provided
    });
  } catch (error) {
    console.error("Error analyzing image with ARIA:", error);
    res.status(500).json({ error: "Failed to analyze image" });
  }
});

module.exports = router;
