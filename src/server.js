const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static('public'));

// Serve the stellar.toml file with correct MIME type
app.get('/.well-known/stellar.toml', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.sendFile(path.join(__dirname, '../public/.well-known/stellar.toml'));
});

// API routes
app.use('/api/sep24', require('./api/sep24'));

// Serve the main application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 