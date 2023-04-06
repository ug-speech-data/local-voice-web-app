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
import ProfileScreen from "./screens/Profile";
import UsersCard from "./screens/Setup/UsersCard";
import SystemConfigurationCard from "./screens/Setup/SystemConfigurationCard";
import CategoryCard from "./screens/Setup/CategoriesCard";
import GroupsCard from "./screens/Setup/GroupsCard";


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomeScreen />} />
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
        }>
          <Route path="" element={<UsersCard />} />
          <Route path="users" element={<UsersCard />} />
          <Route path="system-configuration" element={<SystemConfigurationCard />} />
          <Route path="categories" element={<CategoryCard />} />
          <Route path="groups" element={<GroupsCard />} />
        </Route>

        <Route path="/payment" element={
          <ProtectedRoute permissions={[Permissions.MANAGE_PAYMENT]}>
            <Payment />
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute permissions={[Permissions.VIEW_DASHBOARD]}>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfileScreen />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Error404Screen />} />

      </Routes>
    </Router>
  );
}

export default App;
