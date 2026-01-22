import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';

const VerifyEmail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setStatus('error');
            setMessage('Missing verification token.');
            return;
        }

        // Use a local variable to prevent double-verification in the same mount cycle
        let isSubscribed = true;

        const verifyToken = async () => {
            try {
                // We add a small delay to allow any other concurrent verify calls to finish or to avoid race conditions
                // especially in development with StrictMode
                await new Promise(resolve => setTimeout(resolve, 500));

                if (!isSubscribed) return;

                const response = await fetch(`http://localhost:5000/api/auth/verify-email?token=${token}`);
                const data = await response.json();

                if (!isSubscribed) return;

                if (response.ok) {
                    setStatus('success');
                    setMessage(data.message);
                } else {
                    // Check if it was already verified - though backend currently doesn't distinguish
                    // we can at least show the error more gracefully.
                    setStatus('error');
                    setMessage(data.error || 'Verification failed');
                }
            } catch (error) {
                if (isSubscribed) {
                    setStatus('error');
                    setMessage('Connection error. Please try again.');
                }
            }
        };

        verifyToken();

        return () => {
            isSubscribed = false;
        };
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl p-10 text-center space-y-8 animate-in zoom-in-95 duration-300">
                {status === 'loading' && (
                    <div className="space-y-6">
                        <Loader2 className="h-16 w-16 text-blue-600 animate-spin mx-auto" />
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Verifying Account...</h2>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-6">
                        <div className="bg-green-100 dark:bg-green-900/30 h-24 w-24 rounded-full flex items-center justify-center mx-auto shadow-inner">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Success!</h2>
                            <p className="text-slate-500 font-bold">{message}</p>
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black shadow-xl shadow-blue-100 flex items-center justify-center group"
                        >
                            Go to Login <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-6">
                        <div className="bg-red-100 dark:bg-red-900/30 h-24 w-24 rounded-full flex items-center justify-center mx-auto">
                            <XCircle className="h-12 w-12 text-red-600" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Oops!</h2>
                            <p className="text-red-500 font-bold">{message}</p>
                        </div>
                        <button
                            onClick={() => navigate('/register')}
                            className="w-full bg-slate-900 dark:bg-slate-800 text-white p-5 rounded-2xl font-black shadow-xl"
                        >
                            Back to Registration
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
