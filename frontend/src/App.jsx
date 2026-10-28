import { Routes, Route, Navigate } from "react-router";
import { useContext } from "react";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthContext } from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="flex h-screen items-center justify-center"><span className="loading loading-spinner text-primary loading-lg"></span></div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 -z-10 h-full items-center px-5 py-24" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreatePage /></ProtectedRoute>} />
        <Route path="/note/:id" element={<ProtectedRoute><NoteDetailPage /></ProtectedRoute>} />
      </Routes>
    </div>
  );
};

export default App;
