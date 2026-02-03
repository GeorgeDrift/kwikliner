
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Loader2 } from 'lucide-react';
import { useToast } from '../components/ToastContext';
import { api } from '../services/api';

interface LoginProps {
    onRegister: (user: any) => void;
    onRegisterClick: () => void;
}

const Login: React.FC<LoginProps> = ({ onRegister, onRegisterClick }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { addToast } = useToast();
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please enter your email and password');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await api.loginWithEmail(email, password);
            if (response && response.token) {
                localStorage.setItem('token', response.token);
                onRegister(response.user);
                addToast(`Welcome back, ${response.user.name}!`, 'success');
                navigate('/dashboard');
            } else {
                setError(response.error || 'Invalid credentials');
            }
        } catch (err: any) {
            const errorMsg = err.message || 'Login failed. Please try again.';
            setError(errorMsg);
            addToast(errorMsg, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4 py-20">
            <div className="w-full max-w-xl bg-white dark:bg-slate-800 p-10 rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="text-center mb-10">
                    <div className="h-20 w-20 bg-blue-600 rounded-[28px] flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-100 dark:shadow-none">
                        <LogIn size={40} />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Welcome Back</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold mt-2 uppercase tracking-widest text-xs">Sign in to your account</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase ml-2 block mb-2 tracking-widest">Email Address</label>
                        <input
                            type="email"
                            placeholder="e.g. user@example.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError('');
                            }}
                            className="p-5 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-inner"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase ml-2 block mb-2 tracking-widest">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                            className="p-5 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-inner"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl text-red-500 text-xs font-black text-center border border-red-100 dark:border-red-900/20">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleLogin}
                        disabled={isLoading || !email || !password}
                        className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-100 dark:shadow-none hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100 dark:border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-4 bg-white dark:bg-slate-800 text-slate-400 font-bold uppercase tracking-widest">New to KwikLiner?</span>
                        </div>
                    </div>

                    <button
                        onClick={onRegisterClick}
                        className="w-full py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                    >
                        Create Your Account
                    </button>
                </div>
            </div>

            <p className="mt-12 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                Forgot password? <button className="text-blue-600 hover:underline">Click here to reset</button>
            </p>
        </div>
    );
};

export default Login;
