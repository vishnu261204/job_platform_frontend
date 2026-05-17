import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Briefcase, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../utils/toast.jsx';
import SEO from '../components/SEO';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const res = await register(form.name, form.email, form.password);
    setLoading(false);
    if (res.success) {
      addToast('Account created successfully!', 'success');
      navigate('/dashboard');
    } else {
      addToast(res.error || 'Registration failed', 'error');
    }
  };

  const requirements = [
    { label: 'At least 6 characters', met: form.password.length >= 6 },
    { label: 'Contains a number', met: /\d/.test(form.password) },
    { label: 'Passwords match', met: form.password && form.password === form.confirmPassword },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-[#08080f] dark:via-[#0c0c1a] dark:to-[#0f0a20] flex">
      <SEO title="Create Account" description="Sign up for Talentyra and start your job search journey." />
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 items-center justify-center p-12">
        <div className="text-center text-white">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          >
            <Briefcase className="w-24 h-24 mx-auto mb-6 opacity-80" />
          </motion.div>
          <h2 className="text-4xl font-bold mb-4">Start Your Journey</h2>
          <p className="text-lg opacity-80 max-w-md mx-auto">Create an account and discover opportunities tailored to you.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Talentyra</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create account</h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Start your journey to find the perfect role</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/20 p-8 border border-gray-100 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                <input
                  id="signup-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border outline-none transition-all input-focus text-sm ${
                    errors.name ? 'border-red-300' : 'border-gray-200 dark:border-gray-600'
                  }`}
                  placeholder="John Doe"
                  autoComplete="name"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                <input
                  id="signup-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border outline-none transition-all input-focus text-sm ${
                    errors.email ? 'border-red-300' : 'border-gray-200 dark:border-gray-600'
                  }`}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPw ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border outline-none transition-all input-focus pr-11 text-sm ${
                      errors.password ? 'border-red-300' : 'border-gray-200 dark:border-gray-600'
                    }`}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPw ? 'Hide password' : 'Show password'}>
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="signup-confirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
                <input
                  id="signup-confirm"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border outline-none transition-all input-focus text-sm ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-200 dark:border-gray-600'
                  }`}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>

              <div className="space-y-1.5 pb-2">
                {requirements.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${r.met ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400 dark:bg-gray-700'}`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className={r.met ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}>{r.label}</span>
                  </div>
                ))}
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
              </motion.button>
            </form>
          </div>

          <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
