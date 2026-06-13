const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise');

// GET all
router.get('/', async (req, res) => {
  try {
    const exercises = await Exercise.find().populate("categoryId");
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ error: 'Errore durante il recupero degli esercizi', details: err.message });
  }
});

// GET by id
router.get('/:id', async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id).populate("categoryId");
    if (!exercise) return res.status(404).json({ message: 'Esercizio non trovato' });
    res.json(exercise);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero esercizio', details: err.message });
  }
});

// POST
router.post('/', async (req, res) => {
  try {
    const newExercise = new Exercise(req.body);
    const saved = await newExercise.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Errore durante la creazione', details: err.message });
  }
});

// PUT
router.put('/:id', async (req, res) => {
  try {
    const updated = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Esercizio non trovato' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Errore aggiornamento', details: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Exercise.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Esercizio non trovato' });
    res.json({ message: 'Esercizio eliminato', id: deleted._id });
  } catch (err) {
    res.status(500).json({ error: 'Errore eliminazione', details: err.message });
  }
});

module.exports = router;
