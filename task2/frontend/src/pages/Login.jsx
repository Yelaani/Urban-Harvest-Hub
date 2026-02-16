import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, Bell } from 'lucide-react';
import { NotificationService } from '../services/NotificationService';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        NotificationService.triggerHaptic([50]); // Feedback on click
        setError('');

        // Request permission on interaction so we can send welcome notification
        await NotificationService.requestPermission();

        const result = await login(username, password);
        if (result.success) {
            NotificationService.triggerHaptic([100, 50, 100]); // Success pattern
            NotificationService.showNotification('Welcome back!', `Successfully logged in as ${username}`);

            if (result.user?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } else {
            NotificationService.triggerHaptic([300]); // Error pattern
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-neutral-100 dark:border-slate-700">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900 dark:text-white">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-neutral-600 dark:text-slate-400">
                        For demo, use: <b>admin / admin123</b>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="relative">
                            <User className="absolute top-3 left-3 h-5 w-5 text-neutral-400 dark:text-slate-500" />
                            <input
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-10 py-3 border border-neutral-300 dark:border-slate-600 bg-white dark:bg-slate-700 placeholder-neutral-500 dark:placeholder-slate-400 text-neutral-900 dark:text-white rounded-t-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute top-3 left-3 h-5 w-5 text-neutral-400 dark:text-slate-500" />
                            <input
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-10 py-3 border border-neutral-300 dark:border-slate-600 bg-white dark:bg-slate-700 placeholder-neutral-500 dark:placeholder-slate-400 text-neutral-900 dark:text-white rounded-b-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-slate-500 dark:text-slate-400">
                            <Bell className="w-3 h-3 mr-1" />
                            <span>Enable notifications for updates</span>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                        >
                            Sign in
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
