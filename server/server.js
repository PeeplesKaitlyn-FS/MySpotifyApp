const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  console.log('Server received a request');
  res.sendFile('../client/public/index.html', { headers: { 'Content-Type': 'text/html' } });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;