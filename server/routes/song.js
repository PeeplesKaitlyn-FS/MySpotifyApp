const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Song = require('../models/song');

// GET all songs
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a song by ID
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json(song);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new song
router.post('/', async (req, res) => {
  try {
    const newSong = new Song(req.body);
    await newSong.save();
    res.json(newSong);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT a song by ID
router.put('/:id', async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json(song);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a song by ID
router.delete('/:id', async (req, res) => {
  try {
    await Song.findByIdAndRemove(req.params.id);
    res.json({ message: 'Song deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;