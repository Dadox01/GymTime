const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Create
router.post('/', async (req, res) => {
  try {
    const category = new Category(req.body);
    const saved = await category.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Errore nella creazione della categoria', details: err.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero delle categorie', details: err.message });
  }
});

// Read by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Categoria non trovata' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero della categoria', details: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Categoria non trovata' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Errore durante l\'aggiornamento', details: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Categoria non trovata' });
    res.json({ message: 'Categoria eliminata', id: deleted._id });
  } catch (err) {
    res.status(500).json({ error: 'Errore durante la cancellazione', details: err.message });
  }
});

module.exports = router;
