const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "You are not authenticated" });
  }
  res.redirect("/profile");
});

module.exports = router;