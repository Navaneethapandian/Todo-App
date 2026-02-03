import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {RegisterPage} from "./components/registerPage"; 
import {LoginPage} from "./components/loginPage";
import TodoPage from "./components/todoPage";
import ProfilePage from "./components/profilePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/todo" element={<TodoPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
