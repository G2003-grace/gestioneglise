import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Accueil from "./pages/Accueil";
import Login from "./pages/Login";
import Membres from "./pages/Membres";
import MembreProfil from "./pages/MembreProfil";
import Administrateurs from "./pages/Administrateurs";
import Inscription from "./pages/Inscription";
import Inscriptions from "./pages/Inscriptions";
import Comite from "./pages/Comite";
import Galerie from "./pages/Galerie";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/inscription" element={<Inscription />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/membres" element={<Membres />} />
            <Route path="/membres/:id" element={<MembreProfil />} />
            <Route path="/inscriptions" element={<Inscriptions />} />
            <Route path="/comite" element={<Comite />} />
            <Route path="/galerie" element={<Galerie />} />
            <Route
              path="/administrateurs"
              element={
                <ProtectedRoute roles={["pasteur"]}>
                  <Administrateurs />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/" element={<Accueil />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
