import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Register from "./pages/Register";


// Guard Component to protect routes requiring authentication
const ProtectedRoute = ({ children } : { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // If no token exists, redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Guard Component to redirect authenticated users away from Login page
const PublicRoute = ({ children } : { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");

  if (token) {
    // If user is already logged in, redirect directly to chat
    return <Navigate to="/chat" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Route - Login */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login/>
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register/>
            </PublicRoute>
          }
          />

        {/* Protected Route - Chat Screen */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route for non-existing pages */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;