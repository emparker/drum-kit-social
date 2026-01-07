import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Auth from './pages/Auth';
import Feed from './pages/Feed';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public route - redirect to feed if already logged in */}
      <Route
        path="/"
        element={user ? <Navigate to="/feed" replace /> : <Auth />}
      />

      {/* Protected routes */}
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
