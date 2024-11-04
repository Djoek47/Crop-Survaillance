// index.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const { analyzeImage } = require('./plantAnalysisService'); // Import your analysis function

const app = express();
const PORT = process.env.PORT || 5000;

const upload = multer({ dest: 'uploads/' }); // Directory to store uploaded images

// Endpoint to handle image upload and analysis
app.post('/api/analyze-plants', upload.single('image'), async (req, res) => {
  try {
    const analysisResult = await analyzeImage(req.file.path); // Process the image
    res.json(analysisResult);
  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).send('Analysis failed');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
