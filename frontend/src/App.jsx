import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';
import { ToastProvider } from './components/Toast';
import MeshBackground from './components/MeshBackground';

const NavbarWrapper = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  return !isAuthPage ? <Navbar /> : null;
};

const MainWrapper = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith('/login') || location.pathname.startsWith('/register');
  return (
    <main className={`flex-grow bg-transparent ${isAuthPage ? 'w-full' : 'max-w-7xl mx-auto px-4 py-6 w-full'}`}>
      {children}
    </main>
  );
};

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen w-full bg-slate-950 text-slate-200 relative overflow-hidden font-primary">
            <MeshBackground />
            <div className="relative z-10 min-h-screen flex flex-col bg-transparent">
              <NavbarWrapper />
              <MainWrapper>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/admin" element={
                    <ProtectedRoute adminOnly>
                      <Admin />
                    </ProtectedRoute>
                  } />
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </MainWrapper>
            </div>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
