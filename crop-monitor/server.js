// server.js

const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const app = express();

app.use(bodyParser.json());

// Endpoint to handle Aria requests
app.post('/api/ask-aria', (req, res) => {
  const message = req.body.message;
  exec(`python3 ask_aria.py "${message}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      res.status(500).send(`Error: ${error.message}`);
      return;
    }
    res.send(stdout.trim());
  });
});

// Endpoint to handle Allegro video generation
app.post('/api/generate-video', (req, res) => {
  const prompt = req.body.prompt;
  exec(`python3 generate_video.py "${prompt}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      res.status(500).send(`Error: ${error.message}`);
      return;
    }
    res.send(stdout.trim());
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
