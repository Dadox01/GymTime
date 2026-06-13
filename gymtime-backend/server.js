const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const exercisesRoute = require('./routes/exercises');
const categoriesRoute = require('./routes/categories');

// MONGODB_URI nel .env
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gymtime')
  .then(() => console.log('✅ Connesso a MongoDB'))
  .catch(err => console.error('❌ Errore connessione MongoDB:', err));

app.use('/api/exercises', exercisesRoute);
app.use('/api/categories', categoriesRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
