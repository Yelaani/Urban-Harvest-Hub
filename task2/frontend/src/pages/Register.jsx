import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Mail, ArrowRight, ShieldCheck, UserCircle } from 'lucide-react';
import { NotificationService } from '../services/NotificationService';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user'
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        NotificationService.triggerHaptic([50]);
        setError('');

        const result = await register(formData);
        if (result.success) {
            NotificationService.triggerHaptic([100, 50, 100]);
            NotificationService.showNotification('Registration Successful', 'You can now log in with your credentials.');
            navigate('/login');
        } else {
            NotificationService.triggerHaptic([300]);
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-neutral-100 dark:border-slate-700">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900 dark:text-white">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-neutral-600 dark:text-slate-400">
                        Join the Urban Harvest Hub community
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="relative">
                            <User className="absolute top-3 left-3 h-5 w-5 text-neutral-400 dark:text-slate-500" />
                            <input
                                name="username"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-10 py-3 border border-neutral-300 dark:border-slate-600 bg-white dark:bg-slate-700 placeholder-neutral-500 dark:placeholder-slate-400 text-neutral-900 dark:text-white rounded-t-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                                placeholder="Full Name / Username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative">
                            <Mail className="absolute top-3 left-3 h-5 w-5 text-neutral-400 dark:text-slate-500" />
                            <input
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-10 py-3 border border-neutral-300 dark:border-slate-600 bg-white dark:bg-slate-700 placeholder-neutral-500 dark:placeholder-slate-400 text-neutral-900 dark:text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute top-3 left-3 h-5 w-5 text-neutral-400 dark:text-slate-500" />
                            <input
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-10 py-3 border border-neutral-300 dark:border-slate-600 bg-white dark:bg-slate-700 placeholder-neutral-500 dark:placeholder-slate-400 text-neutral-900 dark:text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative">
                            <ShieldCheck className="absolute top-3 left-3 h-5 w-5 text-neutral-400 dark:text-slate-500" />
                            <select
                                name="role"
                                className="appearance-none rounded-none relative block w-full px-10 py-3 border border-neutral-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-neutral-900 dark:text-white rounded-b-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="user">Customer</option>
                                <option value="admin">Administrator</option>
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors shadow-lg hover:shadow-emerald-500/20"
                        >
                            Register Account
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </button>
                    </div>

                    <div className="text-center">
                        <Link to="/login" className="text-sm font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">
                            Already have an account? Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
