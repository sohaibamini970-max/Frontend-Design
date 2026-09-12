import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Loader2, ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    
    // Remember me & initial state
    const [email, setEmail] = useState(() => localStorage.getItem('saved_email') || 'ahmed@uni.edu');
    const [password, setPassword] = useState('student123');
    const [rememberMe, setRememberMe] = useState(() => localStorage.getItem('remember_me') === 'true');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Forgot Password modal state
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotSuccess, setForgotSuccess] = useState(false);
    const [forgotError, setForgotError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await login(email, password);
            
            if (rememberMe) {
                localStorage.setItem('saved_email', email);
                localStorage.setItem('remember_me', 'true');
            } else {
                localStorage.removeItem('saved_email');
                localStorage.removeItem('remember_me');
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

    const handleForgotPasswordSubmit = (e) => {
        e.preventDefault();
        setForgotError('');
        if (!forgotEmail) {
            setForgotError('Please enter your email address.');
            return;
        }
        setForgotLoading(true);
        // Simulate sending password reset instructions
        setTimeout(() => {
            setForgotLoading(false);
            setForgotSuccess(true);
        }, 800);
    };

    const resetForgotPasswordState = () => {
        setShowForgotPassword(false);
        setForgotSuccess(false);
        setForgotError('');
        setForgotEmail('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2a5f] to-[#1e40af] p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden">
                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 rounded-xl bg-[#0f2a5f] flex items-center justify-center mb-3 shadow-md">
                        <GraduationCap className="text-white" size={28} />
                    </div>
                    <h1 className="text-2xl font-extrabold text-[#0f2a5f]">UniAgent Portal</h1>
                    <p className="text-sm text-gray-500">Sign in to continue</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Email</label>
                        <div className="mt-1 flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#2563eb]/30 transition">
                            <Mail size={16} className="text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="flex-1 outline-none text-sm bg-transparent"
                                placeholder="you@university.edu"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-700">Password</label>
                        <div className="mt-1 flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#2563eb]/30 transition">
                            <Lock size={16} className="text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="flex-1 outline-none text-sm bg-transparent"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Remember Me & Forgot Password Row */}
                    <div className="flex items-center justify-between text-sm py-1">
                        <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-gray-900 select-none">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-[#0f2a5f] accent-[#0f2a5f] focus:ring-[#2563eb] cursor-pointer"
                            />
                            <span>Remember me</span>
                        </label>
                        <button
                            type="button"
                            onClick={() => {
                                setForgotEmail(email);
                                setShowForgotPassword(true);
                            }}
                            className="font-medium text-[#1e40af] hover:text-[#0f2a5f] hover:underline transition"
                        >
                            Forgot password?
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#0f2a5f] hover:bg-[#2563eb] text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-60 shadow hover:shadow-md"
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-xs text-gray-400 text-center leading-relaxed">
                    Demo accounts:<br />
                    admin@uni.edu / admin123<br />
                    smith@uni.edu / teacher123<br />
                    ahmed@uni.edu / student123
                </div>

                {/* Forgot Password Modal Overlay */}
                {showForgotPassword && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col justify-between p-8 animate-in fade-in duration-200">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <button
                                    type="button"
                                    onClick={resetForgotPasswordState}
                                    className="p-1 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <span className="font-semibold text-gray-700 text-sm">Back to Login</span>
                            </div>

                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1e40af] flex items-center justify-center mb-3">
                                    <KeyRound size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Reset Password</h2>
                                <p className="text-xs text-gray-500 mt-1 max-w-xs">
                                    Enter your university email and we will send you instructions to reset your password.
                                </p>
                            </div>

                            {forgotSuccess ? (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-2">
                                    <CheckCircle2 className="mx-auto text-emerald-600" size={32} />
                                    <h3 className="text-sm font-semibold text-emerald-900">Reset Link Sent</h3>
                                    <p className="text-xs text-emerald-700">
                                        Password reset instructions have been sent to <strong>{forgotEmail}</strong>.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            University Email
                                        </label>
                                        <div className="mt-1 flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#2563eb]/30 transition">
                                            <Mail size={16} className="text-gray-400" />
                                            <input
                                                type="email"
                                                value={forgotEmail}
                                                onChange={(e) => setForgotEmail(e.target.value)}
                                                required
                                                className="flex-1 outline-none text-sm bg-transparent"
                                                placeholder="you@university.edu"
                                            />
                                        </div>
                                    </div>

                                    {forgotError && (
                                        <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2">
                                            {forgotError}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={forgotLoading}
                                        className="w-full bg-[#0f2a5f] hover:bg-[#2563eb] text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-60 shadow"
                                    >
                                        {forgotLoading && <Loader2 size={16} className="animate-spin" />}
                                        {forgotLoading ? 'Sending link...' : 'Send Reset Link'}
                                    </button>
                                </form>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={resetForgotPasswordState}
                            className="w-full py-2 text-center text-xs font-medium text-gray-500 hover:text-gray-800 transition"
                        >
                            Return to Sign In
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;