import { useState, useEffect } from "react";
import { api } from "../api";
import "./ExerciseFormModal.css";

function ExerciseFormModal({ isEdit = false, exerciseData = null, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    muscleGroups: "",
    equipment: "",
    difficulty: "Principiante",
    type: "",
    categoryId: ""
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Carica categorie e dati esercizio se in modalità modifica
  useEffect(() => {
    // Carica categorie
    api.get("/categories").then((res) => setCategories(res.data));

    // Se è in modalità modifica, carica i dati dell'esercizio
    if (isEdit && exerciseData) {
      if (exerciseData._id) {
        // Carica dati completi dal server
        api.get(`/exercises/${exerciseData._id}`).then((res) => {
          const ex = res.data;
          setFormData({
            name: ex.name || "",
            description: ex.description || "",
            muscleGroups: (ex.muscleGroups || []).join(", "),
            equipment: (ex.equipment || []).join(", "),
            difficulty: ex.difficulty || "Principiante",
            type: ex.type || "",
            categoryId: ex.categoryId?._id || ""
          });
        });
      } else {
        // Usa i dati già forniti
        setFormData({
          name: exerciseData.name || "",
          description: exerciseData.description || "",
          muscleGroups: (exerciseData.muscleGroups || []).join(", "),
          equipment: (exerciseData.equipment || []).join(", "),
          difficulty: exerciseData.difficulty || "Principiante",
          type: exerciseData.type || "",
          categoryId: exerciseData.categoryId?._id || ""
        });
      }
    }
  }, [isEdit, exerciseData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Rimuovi errore se l'utente inizia a correggere
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Il nome è obbligatorio";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descrizione è obbligatoria";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Seleziona una categoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        muscleGroups: formData.muscleGroups
          .split(",")
          .map((m) => m.trim())
          .filter(m => m.length > 0),
        equipment: formData.equipment
          .split(",")
          .map((e) => e.trim())
          .filter(e => e.length > 0)
      };

      let savedExercise;
      if (isEdit && exerciseData._id) {
        const response = await api.put(`/exercises/${exerciseData._id}`, dataToSend);
        savedExercise = response.data;
      } else {
        const response = await api.post("/exercises", dataToSend);
        savedExercise = response.data;
      }

      onSave(savedExercise);
    } catch (error) {
      console.error("Errore nel salvataggio:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="exercise-form">
      <div className="form-grid">
        {/* Nome */}
        <div className="form-group full-width">
          <label className="form-label">
            <span className="label-text">Nome Esercizio *</span>
            <span className="label-icon">💪</span>
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Es: Push-up, Squat, Deadlift..."
            className={`form-input ${errors.name ? 'error' : ''}`}
            disabled={loading}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        {/* Descrizione */}
        <div className="form-group full-width">
          <label className="form-label">
            <span className="label-text">Descrizione *</span>
            <span className="label-icon">📝</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descrivi come eseguire l'esercizio..."
            className={`form-textarea ${errors.description ? 'error' : ''}`}
            rows="4"
            disabled={loading}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        {/* Gruppi muscolari e Attrezzatura */}
        <div className="form-group">
          <label className="form-label">
            <span className="label-text">Gruppi Muscolari</span>
            <span className="label-icon">🎯</span>
          </label>
          <input
            name="muscleGroups"
            value={formData.muscleGroups}
            onChange={handleChange}
            placeholder="Petto, Spalle, Tricipiti..."
            className="form-input"
            disabled={loading}
          />
          <span className="form-hint">Separali con le virgole</span>
        </div>

        <div className="form-group">
          <label className="form-label">
            <span className="label-text">Attrezzatura</span>
            <span className="label-icon">🏋️</span>
          </label>
          <input
            name="equipment"
            value={formData.equipment}
            onChange={handleChange}
            placeholder="Bilanciere, Manubri, Corpo libero..."
            className="form-input"
            disabled={loading}
          />
          <span className="form-hint">Separali con le virgole</span>
        </div>

        {/* Difficoltà e Tipo */}
        <div className="form-group">
          <label className="form-label">
            <span className="label-text">Difficoltà</span>
            <span className="label-icon">⚡</span>
          </label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="form-select"
            disabled={loading}
          >
            <option value="Principiante">🟢 Principiante</option>
            <option value="Intermedio">🟡 Intermedio</option>
            <option value="Avanzato">🔴 Avanzato</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            <span className="label-text">Tipo</span>
            <span className="label-icon">🔄</span>
          </label>
          <input
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="Push, Pull, Legs, Cardio..."
            className="form-input"
            disabled={loading}
          />
        </div>

        {/* Categoria */}
        <div className="form-group full-width">
          <label className="form-label">
            <span className="label-text">Categoria *</span>
            <span className="label-icon">🏷️</span>
          </label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className={`form-select ${errors.categoryId ? 'error' : ''}`}
            disabled={loading}
          >
            <option value="">-- Seleziona una categoria --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <span className="error-message">{errors.categoryId}</span>}
        </div>
      </div>

      {/* Bottoni */}
      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={loading}
        >
          Annulla
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              {isEdit ? "Aggiornamento..." : "Salvataggio..."}
            </>
          ) : (
            <>
              <span>{isEdit ? "💾" : "✅"}</span>
              {isEdit ? "Aggiorna Esercizio" : "Crea Esercizio"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default ExerciseFormModal;