/*import { useEffect, useState } from "react";
import { api } from "../api";
import { useParams, useNavigate } from "react-router-dom";

function EditExercise() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    // Carica esercizio da modificare
    api.get(`/exercises/${id}`).then((res) => {
      const ex = res.data;
      setFormData({
        name: ex.name,
        description: ex.description,
        muscleGroups: ex.muscleGroups.join(", "),
        equipment: ex.equipment.join(", "),
        difficulty: ex.difficulty,
        type: ex.type,
        categoryId: ex.categoryId?._id || ""
      });
    });

    // Carica categorie
    api.get("/categories").then((res) => setCategories(res.data));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      muscleGroups: formData.muscleGroups.split(",").map((m) => m.trim()),
      equipment: formData.equipment.split(",").map((e) => e.trim())
    };

    await api.put(`/exercises/${id}`, dataToSend);
    navigate("/");
  };

  return (
    <div>
      <h2>Modifica Esercizio</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={formData.name} onChange={handleChange} required />
        <br />
        <textarea name="description" value={formData.description} onChange={handleChange} required />
        <br />
        <input name="muscleGroups" value={formData.muscleGroups} onChange={handleChange} />
        <br />
        <input name="equipment" value={formData.equipment} onChange={handleChange} />
        <br />
        <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
          <option value="Principiante">Principiante</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzato">Avanzato</option>
        </select>
        <br />
        <input name="type" value={formData.type} onChange={handleChange} />
        <br />
        <select name="categoryId" value={formData.categoryId} onChange={handleChange}>
          <option value="">-- Seleziona Categoria --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <br />
        <button type="submit">💾 Salva Modifiche</button>
      </form>
    </div>
  );
}

export default EditExercise;*/
