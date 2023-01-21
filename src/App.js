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
import Setup from "./screens/Setup";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import Permissions from "./utils/permissions";
import Error404Screen from "./screens/ErrorScreens/Error404";
import HomeScreen from "./screens/Home";
import Payment from "./screens/Payment";


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/home" element={<HomeScreen />} />
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

        <Route path="/setup" element={
          <ProtectedRoute permissions={[Permissions.MANAGE_SETUP]}>
            <Setup />
          </ProtectedRoute>
        } />

        <Route path="/payment" element={
          <ProtectedRoute permissions={[Permissions.MANAGE_SETUP]}>
            <Payment />
          </ProtectedRoute>
        } />

        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Error404Screen />} />

      </Routes>
    </Router>
  );
}

export default App;
