const express = require('express');
const app = express();
const cors = require('cors');
const net = require('net');
const { exec } = require('child_process');
require('dotenv').config();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

const testServer = net.createServer().once('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use. Attempting to kill the process...`);

    // Kill the process on the specified port (works on Unix-based systems)
    exec(`lsof -i :${PORT} | awk 'NR!=1 {print $2}' | xargs kill -9`, (error) => {
      if (error) {
        console.error(`Error killing process on port ${PORT}:`, error);
      } else {
        console.log(`Killed process on port ${PORT}. Starting server...`);
        startServer();
      }
    });
  } else {
    console.error('Error starting server:', err);
  }
}).once('listening', () => {
  testServer.close(startServer);
}).listen(PORT);
