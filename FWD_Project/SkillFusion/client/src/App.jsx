import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './components/Profile';
import Leaderboard from './components/Leaderboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import HomePage from './pages/HomePage';
import Terms from './pages/Terms';
import Contact from './pages/Contact';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';

function AppRoutes() {
  const location = useLocation();
  const hideNavbarPaths = ['/', '/login', '/signup', '/terms', '/contact', '/forgot-password', '/reset-password'];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className={showNavbar ? "app-light-mode" : "app-dark-mode"}>
      {showNavbar && <Navbar />}
      <div className={showNavbar ? "container" : ""}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
            <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
            <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            <Route
              path="/dashboard"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/profile"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
