const express = require('express');
const app = express();

app.get('/api/test', (req, res) => {
  res.send('Hello from the API!');
});

module.exports = app;