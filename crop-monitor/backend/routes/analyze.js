// backend/routes/analyze.js
const express = require('express');
const fs = require('fs');
const axios = require('axios');
const { ARIA_API_KEY } = require('../config');
const router = express.Router();

router.post('/', async (req, res) => {
  const imageFile = req.file;

  if (!imageFile) {
    return res.status(400).json({ error: 'No image provided' });
  }

  try {
    // Prepare image data for ARIA analysis
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imageFile.path));

    // Send the image to ARIA for processing
    const response = await axios.post(
      'https://api.rhymes.ai/v1/image-analysis',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${ARIA_API_KEY}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const { plantCount, vitality, location } = response.data;

    // Respond with the analysis results
    res.json({ plantCount, vitality, location });

    // Remove the file after analysis
    fs.unlinkSync(imageFile.path);
  } catch (error) {
    console.error("Error processing image:", error.message);
    res.status(500).json({ error: "Failed to analyze image" });
  }
});

module.exports = router;
