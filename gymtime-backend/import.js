const mongoose = require('mongoose');
const Exercise = require('./models/Exercise'); // importa il modello
const fs = require('fs');
require('dotenv').config();

// Carica il file JSON
const rawData = fs.readFileSync('./dataset/exercises.json');
const exercises = JSON.parse(rawData);

// Connettiti al DB e importa
mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    await Exercise.deleteMany(); // opzionale: pulisce la collection
    await Exercise.insertMany(exercises);
    console.log('✅ Esercizi importati con successo!');
    process.exit();
  } catch (err) {
    console.error('❌ Errore durante l\'importazione:', err);
    process.exit(1);
  }
});
