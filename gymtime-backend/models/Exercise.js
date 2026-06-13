const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  muscleGroups: [String],
  equipment: [String],
  difficulty: { type: String, enum: ["Principiante", "Intermedio", "Avanzato"] },
  type: String,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' } // JOIN logica
});

module.exports = mongoose.model('Exercise', exerciseSchema);
