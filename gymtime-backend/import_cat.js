const mongoose = require('mongoose');
const Exercise = require('./models/Exercise');
require('dotenv').config();

const categoryMap = {
  // Forza
  "lever (plate loaded)": "682da15fab5ba355e66a5ae6",
  "weighted": "682da15fab5ba355e66a5ae6",
  "smith": "682da15fab5ba355e66a5ae6",
  "weighted chest dip": "682da15fab5ba355e66a5ae6",
  "sled (plate loaded)": "682da15fab5ba355e66a5ae6",
  "sled": "682da15fab5ba355e66a5ae6",
  "self-assisted": "682da15fab5ba355e66a5ae6",
  "lever (selectorized)": "682da15fab5ba355e66a5ae6",
  "lever": "682da15fab5ba355e66a5ae6",
  "cable (pull side)": "682da15fab5ba355e66a5ae6",
  "cable standing fly": "682da15fab5ba355e66a5ae6",
  "assisted (machine)": "682da15fab5ba355e66a5ae6",
  "assisted chest dip": "682da15fab5ba355e66a5ae6",
  "assisted": "682da15fab5ba355e66a5ae6",
  "dumbbell": "682da15fab5ba355e66a5ae6",
  "barbell": "682da15fab5ba355e66a5ae6",
  "cable": "682da15fab5ba355e66a5ae6",

  // Corpo Libero
  "body weight": "682ef4a9b5d1f4e73f6c6ace",
  "suspended": "682ef4a9b5d1f4e73f6c6ace",
  "suspension": "682ef4a9b5d1f4e73f6c6ace",
  "plyometric": "682ef4a9b5d1f4e73f6c6ace",

  // Mobilità
  "band resistive": "682ef4a2b5d1f4e73f6c6acc",
  "isometric": "682ef4a2b5d1f4e73f6c6acc",
  "band-assisted": "682ef4a2b5d1f4e73f6c6acc",
  "assisted (partner)": "682ef4a2b5d1f4e73f6c6acc"
};

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gymtime')
  .then(async () => {
    const exercises = await Exercise.find();
    for (const ex of exercises) {
      if (!ex.equipment || ex.equipment.length === 0) continue;

      const eqString = ex.equipment.join(' ').toLowerCase();
      let matchedCategoryId = null;

      for (let keyword in categoryMap) {
        if (eqString.includes(keyword)) {
          matchedCategoryId = categoryMap[keyword];
          break;
        }
      }

      if (matchedCategoryId) {
        ex.categoryId = matchedCategoryId;
        await ex.save();
        console.log(`✅ ${ex.name} → categoria aggiornata`);
      } else {
        console.warn(`⚠️ ${ex.name} → nessuna categoria trovata per: ${eqString}`);
      }
    }

    console.log("✅ Mappatura completata con successo!");
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("❌ Errore:", err);
  });
