import { useState, useEffect } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

function ExerciseForm() {
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
  const navigate = useNavigate();

  // Carica le categorie disponibili
  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Conversione per MongoDB (array di stringhe)
    const dataToSend = {
      ...formData,
      muscleGroups: formData.muscleGroups.split(",").map((m) => m.trim()),
      equipment: formData.equipment.split(",").map((e) => e.trim())
    };
    await api.post("/exercises", dataToSend);
    navigate("/"); // ritorna alla lista
  };

  return (
    <div>
      <h2>Aggiungi Nuovo Esercizio</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Nome" onChange={handleChange} required />
        <br />
        <textarea name="description" placeholder="Descrizione" onChange={handleChange} required />
        <br />
        <input name="muscleGroups" placeholder="Gruppi muscolari (virgole)" onChange={handleChange} />
        <br />
        <input name="equipment" placeholder="Attrezzatura (virgole)" onChange={handleChange} />
        <br />
        <select name="difficulty" onChange={handleChange} value={formData.difficulty}>
          <option value="Principiante">Principiante</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzato">Avanzato</option>
        </select>
        <br />
        <input name="type" placeholder="Tipo (es: Push, Pull...)" onChange={handleChange} />
        <br />
        <select name="categoryId" onChange={handleChange} required>
          <option value="">-- Seleziona Categoria --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <br />
        <button type="submit">Salva</button>
      </form>
    </div>
  );
}

export default ExerciseForm;
