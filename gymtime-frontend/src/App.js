import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExerciseList from "./components/ExerciseList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ExerciseList />} />
      </Routes>
    </Router>
  );
}

export default App;
