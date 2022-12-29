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
import {
  useLazyGetConfigurationsQuery,
} from './features/resources/resources-api-slice';
import { useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { setConfigurations } from './features/global/global-slice';


function App() {
  const [getConfigurations, { error }] = useLazyGetConfigurationsQuery()
  const toast = useToast();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const response = await getConfigurations().unwrap()
      if (response?.configurations) {
        dispatch(setConfigurations(response.configurations))
      }
    })()
  }, [])

  useEffect(() => {
    if (error) {
      toast({
        position: "top-center",
        title: `Error: ${error.originalStatus}`,
        description: "Could not fetch configurations.",
        status: "error",
        duration: 1000,
        isClosable: true,
      })
    }
  }, [error])

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

        <Route path="/setup" element={
          <ProtectedRoute permissions={[Permissions.MANAGE_SETUP]}>
            <Setup />
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
