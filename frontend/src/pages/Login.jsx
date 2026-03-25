import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Mail, Lock, LogIn, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      addToast('Welcome back!', 'success');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to login. Please check your credentials.');
      addToast('Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-xl relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center justify-center gap-3 mb-6"
          >
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40">
              <TrendingUp size={26} className="text-white" />
            </div>
            <span className="text-3xl font-extrabold text-white tracking-tighter">PrimeTrade Assignment</span>
          </motion.div>
        </div>

        {/* Card */}
        <Card className="p-8 md:p-12 border-slate-800 shadow-2xl !bg-slate-900" hover={false}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 text-sm font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />

              <Input
                label="Password"
                type="password"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full py-4 text-base"
              icon={LogIn}
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800 text-center">
            <p className="text-slate-500 font-medium text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="ml-1 text-indigo-400 hover:text-indigo-300 font-bold underline underline-offset-4 transition-all">
                Sign up for free
              </Link>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <p className="mt-10 text-center text-slate-600 text-xs font-semibold tracking-wide">
          &copy; 2026 PrimeTrade Platform
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
