import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Dashboard from "./screens/Dashboard";
import Tasks from "./screens/Tasks";
import Contribute from "./screens/Contribute";
import CollectedData from "./screens/CollectedData";
import LoginScreen from "./screens/Login";
import RegisterScreen from "./screens/Register";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import Permissions from "./utils/permissions";


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/login" element={<LoginScreen />} />
        <Route exact path="/register" element={<RegisterScreen />} />


        <Route path="/tasks" element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        } />

        <Route path="/contribute" element={
          <ProtectedRoute>
            <Contribute />
          </ProtectedRoute>
        } />

        <Route path="/collected-data" element={
          <ProtectedRoute permissions={[Permissions.MANAGE_COLLECTED_DATA]}>
            <CollectedData />
          </ProtectedRoute>
        } />

        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
