import { useState, useEffect } from 'react';
import { api } from '../api';
import './CategoryManager.css';

const PRESET_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];

function CategoryManager({ isOpen, onClose, onCategoriesChange }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: PRESET_COLORS[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Errore nel caricamento delle categorie:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      color: PRESET_COLORS[0]
    });
    setShowForm(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color || PRESET_COLORS[0]
    });
    setShowForm(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Sei sicuro di voler eliminare questa categoria? Tutti gli esercizi associati perderanno la categoria.')) {
      try {
        await api.delete(`/categories/${categoryId}`);
        const updatedCategories = categories.filter(cat => cat._id !== categoryId);
        setCategories(updatedCategories);
        onCategoriesChange?.(updatedCategories);
      } catch (error) {
        console.error('Errore nell\'eliminazione della categoria:', error);
        alert('Errore nell\'eliminazione della categoria');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      let savedCategory;
      if (editingCategory) {
        // Modifica categoria esistente
        const response = await api.put(`/categories/${editingCategory._id}`, formData);
        savedCategory = response.data;
        const updatedCategories = categories.map(cat => 
          cat._id === savedCategory._id ? savedCategory : cat
        );
        setCategories(updatedCategories);
      } else {
        // Crea nuova categoria
        const response = await api.post('/categories', formData);
        savedCategory = response.data;
        const updatedCategories = [...categories, savedCategory];
        setCategories(updatedCategories);
      }
      
      onCategoriesChange?.(categories);
      handleCancelForm();
    } catch (error) {
      console.error('Errore nel salvataggio della categoria:', error);
      alert('Errore nel salvataggio della categoria');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      color: PRESET_COLORS[0]
    });
  };

  const handleClose = () => {
    handleCancelForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="category-manager-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="category-manager-modal">
        {/* Header */}
        <div className="category-manager-header">
          <h2>Gestione Categorie</h2>
          <button onClick={handleClose} className="close-button">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="category-manager-content">
          {/* Categories List */}
          <div className="categories-list">
            <div className="categories-header">
              <h3>Categorie Esistenti</h3>
              <button 
                onClick={handleAddCategory}
                className="add-category-btn"
                disabled={showForm}
              >
                <span>+</span>
                Aggiungi Categoria
              </button>
            </div>

            {isLoading ? (
              <div className="loading-state">
                Caricamento categorie...
              </div>
            ) : categories.length === 0 ? (
              <div className="empty-categories">
                <p>Nessuna categoria presente. Crea la tua prima categoria!</p>
              </div>
            ) : (
              <div className="categories-grid">
                {categories.map((category) => (
                  <div key={category._id} className="category-item">
                    <div className="category-info">
                      <div 
                        className="category-color" 
                        style={{ backgroundColor: category.color || PRESET_COLORS[0] }}
                      ></div>
                      <div className="category-details">
                        <h4>{category.name}</h4>
                        {category.description && <p>{category.description}</p>}
                      </div>
                    </div>
                    <div className="category-actions">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="edit-btn"
                        disabled={showForm}
                        title="Modifica categoria"
                      >
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="delete-btn"
                        disabled={showForm}
                        title="Elimina categoria"
                      >
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Form */}
          {showForm && (
            <div className="category-form-container">
              <div className="form-header">
                <h3>{editingCategory ? 'Modifica Categoria' : 'Nuova Categoria'}</h3>
              </div>
              
              <form onSubmit={handleSubmit} className="category-form">
                <div className="form-group">
                  <label htmlFor="categoryName">Nome Categoria *</label>
                  <input
                    id="categoryName"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Es. Petto, Gambe, Cardio..."
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="categoryDescription">Descrizione</label>
                  <textarea
                    id="categoryDescription"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descrizione opzionale della categoria..."
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label>Colore</label>
                  <div className="color-picker">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`color-option ${formData.color === color ? 'selected' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setFormData({...formData, color})}
                        disabled={isSubmitting}
                        title={color}
                      />
                    ))}
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({...formData, color: e.target.value})}
                      className="color-input"
                      disabled={isSubmitting}
                      title="Colore personalizzato"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="cancel-btn"
                    disabled={isSubmitting}
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    className="save-btn"
                    disabled={isSubmitting || !formData.name.trim()}
                  >
                    {isSubmitting ? 'Salvataggio...' : (editingCategory ? 'Salva Modifiche' : 'Crea Categoria')}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryManager;