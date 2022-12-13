import {
  BrowserRouter as Router,
  Routes, //replaces "Switch" used till v5
  Route,
} from "react-router-dom";
import Dashboard from "./screens/Dashboard";
import Tasks from "./screens/Tasks";
import Contribute from "./screens/Contribute";
import CollectedData from "./screens/CollectedData";
import LoginScreen from "./screens/Login";
import RegisterScreen from "./screens/Register";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/contribute" element={<Contribute />} />
        <Route path="/collected-data" element={<CollectedData />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
