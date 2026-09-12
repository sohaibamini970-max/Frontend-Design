import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    GraduationCap,
    Mail,
    Lock,
    Loader2,
    Eye,
    EyeOff,
    X,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const REMEMBER_KEY = 'uniagent_remember_email';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Forgot password modal state
    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotStatus, setForgotStatus] = useState(null); // 'loading' | 'sent' | 'error'
    const [forgotError, setForgotError] = useState('');

    // Restore remembered email
    useEffect(() => {
        const saved = localStorage.getItem(REMEMBER_KEY);
        if (saved) {
            setEmail(saved);
            setRemember(true);
        } else {
            // sensible default for demo
            setEmail('ahmed@uni.edu');
            setPassword('student123');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await login(email, password);

            // Remember me: store or clear the email
            if (remember) {
                localStorage.setItem(REMEMBER_KEY, email);
            } else {
                localStorage.removeItem(REMEMBER_KEY);
            }

            if (user.role === 'admin') navigate('/admin/manage', { replace: true });
            else if (user.role === 'teacher') navigate('/teacher', { replace: true });
            else navigate('/', { replace: true });
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    // Open the forgot-password modal prefilled with whatever's typed
    const openForgot = () => {
        setForgotEmail(email);
        setForgotStatus(null);
        setForgotError('');
        setShowForgot(true);
    };

    const closeForgot = () => {
        setShowForgot(false);
        setForgotStatus(null);
        setForgotError('');
    };

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        setForgotStatus('loading');
        setForgotError('');
        try {
            const API_URL = 'https://backend-design.vercel.app';
            const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail }),
            });
            if (!res.ok) throw new Error('Failed to send reset link');
            setForgotStatus('sent');
        } catch (err) {
            setForgotStatus('error');
            setForgotError(err.message);
        }
    };;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2a5f] to-[#1e40af] p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
                {/* Logo & Title */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 rounded-xl bg-[#0f2a5f] flex items-center justify-center mb-3">
                        <GraduationCap className="text-white" size={28} />
                    </div>
                    <h1 className="text-2xl font-extrabold text-[#0f2a5f]">UniAgent Portal</h1>
                    <p className="text-sm text-gray-500">Sign in to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Email</label>
                        <div className="mt-1 flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#2563eb]/30">
                            <Mail size={16} className="text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                className="flex-1 outline-none text-sm"
                                placeholder="you@university.edu"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Password</label>
                        <div className="mt-1 flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#2563eb]/30">
                            <Lock size={16} className="text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                className="flex-1 outline-none text-sm"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="text-gray-400 hover:text-gray-600 transition"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Remember me + Forgot password */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer select-none text-gray-600">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="w-4 h-4 accent-[#0f2a5f] cursor-pointer"
                            />
                            Remember me
                        </label>
                        <button
                            type="button"
                            onClick={openForgot}
                            className="text-[#2563eb] hover:text-[#0f2a5f] font-medium transition"
                        >
                            Forgot password?
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#0f2a5f] hover:bg-[#2563eb] text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {/* Demo accounts */}
                <div className="mt-6 text-xs text-gray-400 text-center leading-relaxed">
                    Demo accounts:<br />
                    admin@uni.edu / admin123<br />
                    smith@uni.edu / teacher123<br />
                    ahmed@uni.edu / student123
                </div>
            </div>

            {/* ================================
          Forgot Password Modal
      ================================= */}
            {showForgot && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={closeForgot}
                >
                    <div
                        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h3 className="font-bold text-[#0f2a5f]">Reset Password</h3>
                            <button
                                onClick={closeForgot}
                                className="text-gray-400 hover:text-gray-700 transition"
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal body */}
                        <div className="px-6 py-6">
                            {forgotStatus === 'sent' ? (
                                // ---------- Success state ----------
                                <div className="text-center">
                                    <div className="w-14 h-14 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                                        <CheckCircle2 size={28} className="text-green-600" />
                                    </div>
                                    <h4 className="font-bold text-gray-800 mb-2">Check your inbox</h4>
                                    <p className="text-sm text-gray-500 mb-6">
                                        If an account exists for{' '}
                                        <span className="font-semibold text-gray-700">{forgotEmail}</span>
                                        , we've sent a password reset link.
                                    </p>
                                    <button
                                        onClick={closeForgot}
                                        className="w-full bg-[#0f2a5f] hover:bg-[#2563eb] text-white font-semibold py-2.5 rounded-lg transition"
                                    >
                                        Back to Sign In
                                    </button>
                                </div>
                            ) : (
                                // ---------- Form state ----------
                                <form onSubmit={handleForgotSubmit} className="space-y-4">
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        Enter the email associated with your account. We'll send you a link
                                        to reset your password.
                                    </p>

                                    <div>
                                        <label className="text-sm font-semibold text-gray-700">Email</label>
                                        <div className="mt-1 flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#2563eb]/30">
                                            <Mail size={16} className="text-gray-400" />
                                            <input
                                                type="email"
                                                value={forgotEmail}
                                                onChange={(e) => setForgotEmail(e.target.value)}
                                                required
                                                className="flex-1 outline-none text-sm"
                                                placeholder="you@university.edu"
                                            />
                                        </div>
                                    </div>

                                    {forgotStatus === 'error' && (
                                        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2">
                                            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                                            <span>{forgotError}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={closeForgot}
                                            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={forgotStatus === 'loading'}
                                            className="flex-1 flex items-center justify-center gap-2 bg-[#0f2a5f] hover:bg-[#2563eb] text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60"
                                        >
                                            {forgotStatus === 'loading' && (
                                                <Loader2 size={16} className="animate-spin" />
                                            )}
                                            {forgotStatus === 'loading' ? 'Sending...' : 'Send reset link'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;