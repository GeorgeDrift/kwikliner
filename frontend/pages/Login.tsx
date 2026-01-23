import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogIn, Loader2, Truck } from 'lucide-react';
import { api } from '../services/api';
import { User as UserType } from '../types';

interface LoginProps {
    onLogin: (user: UserType) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        phone: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.login(formData.phone, formData.password);
            if (response.user) {
                onLogin(response.user);
                navigate('/dashboard');
            } else {
                setError('Invalid credentials');
            }
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center h-20 w-20 bg-blue-600 rounded-[20px] shadow-xl shadow-blue-200 dark:shadow-blue-900/50 mb-6">
                        <Truck className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Welcome Back</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Sign in to your KwikLiner account</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-[32px] shadow-xl border border-slate-100 dark:border-slate-700 space-y-6">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-bold text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1 block mb-2">Phone Number</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={18} />
                                <input
                                    type="tel"
                                    placeholder="0999123456"
                                    className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-600"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1 block mb-2">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-600"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !formData.phone || !formData.password}
                        className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-100 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><LogIn size={18} /> Sign In</>}
                    </button>

                    <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-700">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                                Register Now
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
