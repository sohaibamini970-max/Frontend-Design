import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('ahmed@uni.edu');
    const [password, setPassword] = useState('student123');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2a5f] to-[#1e40af] p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 rounded-xl bg-[#0f2a5f] flex items-center justify-center mb-3">
                        <GraduationCap className="text-white" size={28} />
                    </div>
                    <h1 className="text-2xl font-extrabold text-[#0f2a5f]">UniAgent Portal</h1>
                    <p className="text-sm text-gray-500">Sign in to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Email</label>
                        <div className="mt-1 flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#2563eb]/30">
                            <Mail size={16} className="text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="flex-1 outline-none text-sm"
                                placeholder="you@university.edu"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-700">Password</label>
                        <div className="mt-1 flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#2563eb]/30">
                            <Lock size={16} className="text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="flex-1 outline-none text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#0f2a5f] hover:bg-[#2563eb] text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
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
            </div>
        </div>
    );
};

export default LoginPage;