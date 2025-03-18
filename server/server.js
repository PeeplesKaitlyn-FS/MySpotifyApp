const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 3000;

// API routes
const apiRouter = require("./routes/song");
app.use("/api", apiRouter);

// Static build folder
app.use(express.static(path.join(__dirname, "../client/public")));

// Serve index.html for any unknown routes
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});