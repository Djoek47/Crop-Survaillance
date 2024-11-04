// backend/app.js
const express = require('express');
const analyzePlantsRoute = require('./routes/analyzePlants');

const app = express();
app.use(express.json());

// Use the route
app.use('/api/analyze-plants', analyzePlantsRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
