import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {RegisterPage} from "./components/registerPage"; 
import {LoginPage} from "./components/loginPage";
import TodoPage from "./components/todoPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/todo" element={<TodoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
