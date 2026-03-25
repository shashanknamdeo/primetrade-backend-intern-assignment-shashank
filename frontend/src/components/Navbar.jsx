import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import { LogOut, User, Shield, LayoutDashboard, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'info');
    navigate('/login');
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group transition-all">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <TrendingUp size={22} className="text-white" />
          </div>
          <span className="text-2xl font-extrabold text-white tracking-tighter">
            PrimeTrade Assignment<span className="text-indigo-500">.</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-4 md:gap-8">
          {user ? (
            <>
              <div className="hidden lg:flex items-center gap-6">
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-sm font-bold text-slate-400 hover:text-indigo-400 flex items-center gap-2 transition-colors">
                    <Shield size={16} />
                    Admin Registry
                  </Link>
                )}
                <Link to="/" className="text-sm font-bold text-slate-400 hover:text-indigo-400 flex items-center gap-2 transition-colors">
                  <LayoutDashboard size={16} />
                  Tasks
                </Link>
              </div>

              <div className="h-8 w-px bg-slate-800 hidden md:block" />

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 font-bold text-sm">
                    {user.full_name?.charAt(0) || <User size={16} />}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-bold text-white leading-none mb-1">{user.full_name}</p>
                    <span className="text-[10px] uppercase tracking-widest font-extrabold text-indigo-500">{user.role}</span>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
                  icon={LogOut}
                >
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </div>
            </>
          ) : (
            !isAuthPage && (
              <div className="flex gap-4">
                <Link to="/login">
                  <Button variant="ghost" className="text-slate-400 hover:text-white">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button className="font-bold">Get Started</Button>
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
