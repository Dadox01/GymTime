import { useEffect, useState } from "react";
import { api } from "../api";
import Modal from "./Modal";
import ExerciseFormModal from "./ExerciseFormModal";
import CategoryManager from "./CategoryManager";
import ConfirmModal from "./ConfirmModal"; // Aggiungi import
import "./ExerciseList.css";
import logo from "./logo.png";

function ExerciseList() {
  const [exercises, setExercises] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Stati per le modali
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  
  // Stati per la modale di conferma eliminazione
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState(null);

  useEffect(() => {
    loadExercises();
    loadCategories();
  }, []);

  const loadExercises = async () => {
    try {
      const res = await api.get("/exercises");
      setExercises(res.data);
    } catch (error) {
      console.error("Errore nel caricamento degli esercizi:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Errore nel caricamento delle categorie:", error);
    }
  };

  const handleDelete = (exercise) => {
    setExerciseToDelete(exercise);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (exerciseToDelete) {
      try {
        await api.delete(`/exercises/${exerciseToDelete._id}`);
        setExercises(exercises.filter((e) => e._id !== exerciseToDelete._id));
        setIsDeleteModalOpen(false);
        setExerciseToDelete(null);
      } catch (error) {
        console.error("Errore nell'eliminazione:", error);
        alert("Errore nell'eliminazione dell'esercizio");
      }
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setExerciseToDelete(null);
  };

  const handleEdit = (exercise) => {
    setSelectedExercise(exercise);
    setIsEditModalOpen(true);
  };

  const handleSaveExercise = (savedExercise) => {
    if (selectedExercise) {
      // Modifica esistente
      setExercises(exercises.map(ex => 
        ex._id === savedExercise._id ? savedExercise : ex
      ));
    } else {
      // Nuovo esercizio
      setExercises([...exercises, savedExercise]);
    }
    
    // Chiudi le modali
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedExercise(null);

    // Ricarica gli esercizi per assicurarti che le informazioni sulla categoria siano aggiornate
    loadExercises();
  };

  const handleCancelModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedExercise(null);
  };

  const handleCategoriesChange = (updatedCategories) => {
    setCategories(updatedCategories);
    // Ricarica gli esercizi per aggiornare le associazioni alle categorie
    loadExercises();
  };

  const filtered = exercises.filter((ex) =>
    (!filterCategory || ex.categoryId?._id === filterCategory) &&
    ex.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Principiante": return "#10B981";
      case "Intermedio": return "#F59E0B";
      case "Avanzato": return "#EF4444";
      default: return "#6B7280";
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case "Principiante": return "🟢";
      case "Intermedio": return "🟡";
      case "Avanzato": return "🔴";
      default: return "⚪";
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left logo-box">
            <img src={logo} alt="GymTime Logo" className="logo-img" />
          </div>
          <div className="header-actions">
            <button
              onClick={() => setIsCategoryManagerOpen(true)}
              className="manage-categories-button"
            >
              <span className="category-icon">🏷️</span>
              Gestisci Categorie
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="add-button"
            >
              <span className="add-icon">+</span>
              Aggiungi Esercizio
            </button>
          </div>
        </div>
      </header>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              placeholder="Cerca esercizi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        <div className="filter-container">
          <select
            className="category-filter"
            onChange={(e) => setFilterCategory(e.target.value)}
            value={filterCategory}
          >
            <option value="">Tutte le categorie</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-number">{exercises.length}</div>
          <div className="stat-label">Totale Esercizi</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{categories.length}</div>
          <div className="stat-label">Categorie</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{filtered.length}</div>
          <div className="stat-label">Risultati Filtrati</div>
        </div>
      </div>

      {/* Exercise Cards Grid */}
      <div className="exercises-grid">
        {filtered.map((ex) => (
          <div key={ex._id} className="exercise-card">
            <div className="card-header">
              <h3 className="exercise-name">{ex.name}</h3>
              <div className="difficulty-badge" style={{ backgroundColor: getDifficultyColor(ex.difficulty) }}>
                <span className="difficulty-icon">{getDifficultyIcon(ex.difficulty)}</span>
                <span className="difficulty-text">{ex.difficulty}</span>
              </div>
            </div>

            <div className="card-category">
              <span 
                className="category-icon"
                style={{ color: ex.categoryId?.color || '#6B7280' }}
              >
                ●
              </span>
              <span className="category-name">{ex.categoryId?.name || "Nessuna categoria"}</span>
            </div>

            <p className="exercise-description">{ex.description}</p>

            <div className="exercise-details">
              <div className="detail-item">
                <span className="detail-icon">💪</span>
                <span className="detail-label">Muscoli:</span>
                <span className="detail-value">{ex.muscleGroups.join(", ") || "N/A"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🏋️</span>
                <span className="detail-label">Attrezzi:</span>
                <span className="detail-value">{ex.equipment.join(", ") || "Nessuno"}</span>
              </div>
              {ex.type && (
                <div className="detail-item">
                  <span className="detail-icon">⚡</span>
                  <span className="detail-label">Tipo:</span>
                  <span className="detail-value">{ex.type}</span>
                </div>
              )}
            </div>

            <div className="card-actions">
              <button 
                onClick={() => handleEdit(ex)}
                className="action-button edit-button"
              >
                <svg className="action-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Modifica
              </button>
              <button 
                onClick={() => handleDelete(ex)} 
                className="action-button delete-button"
              >
                <svg className="action-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Elimina
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>Nessun esercizio trovato</h3>
          <p>Prova a modificare i filtri di ricerca o aggiungi un nuovo esercizio.</p>
        </div>
      )}

      {/* Modal per Aggiungere Esercizio */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCancelModal}
        title="Aggiungi Nuovo Esercizio"
        size="large"
      >
        <ExerciseFormModal
          isEdit={false}
          onSave={handleSaveExercise}
          onCancel={handleCancelModal}
        />
      </Modal>

      {/* Modal per Modificare Esercizio */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCancelModal}
        title="Modifica Esercizio"
        size="large"
      >
        <ExerciseFormModal
          isEdit={true}
          exerciseData={selectedExercise}
          onSave={handleSaveExercise}
          onCancel={handleCancelModal}
        />
      </Modal>

      {/* Category Manager */}
      <CategoryManager
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        onCategoriesChange={handleCategoriesChange}
      />

      {/* Modal di Conferma Eliminazione */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Conferma Eliminazione"
        message={`Sei sicuro di voler eliminare l'esercizio "${exerciseToDelete?.name}"? Questa azione non può essere annullata.`}
        confirmText="Elimina"
        cancelText="Annulla"
      />
    </div>
  );
}

export default ExerciseList;