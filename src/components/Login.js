import React, { useState } from 'react';
import { LockClosedIcon, UserIcon, KeyIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

const Login = ({ onLogin, remainingRequests }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Demo credentials
    const DEMO_USERNAME = 'demo';
    const DEMO_PASSWORD = 'demo123';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
            onLogin();
        } else {
            setError('Invalid credentials. Please use the demo account.');
        }
        
        setIsLoading(false);
    };

    const fillDemoCredentials = () => {
        setUsername(DEMO_USERNAME);
        setPassword(DEMO_PASSWORD);
        setError('');
    };

    return (
        <div className="bg-slate-900 min-h-screen font-sans text-slate-200 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-700 via-slate-900 to-black flex items-center justify-center">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center mb-4">
                        <svg className="w-16 h-16 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9.5 2.5c1.4-1.2 3.6-1.2 5 0l4.5 4c1.4 1.2 1.4 3.3 0 4.5l-4.5 4c-1.4 1.2-3.6 1.2-5 0l-4.5-4c-1.4-1.2-1.4-3.3 0-4.5l4.5-4z"></path>
                            <path d="M5.5 6.5l4 4"></path>
                            <path d="M14.5 6.5l-4 4"></path>
                            <path d="M10 14.5v-4"></path>
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">GuardianNeuro</h1>
                    <p className="text-lg text-slate-400">AI-Powered Diagnostic Assistant</p>
                </div>

                {/* Login Form */}
                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/10">
                    <div className="flex items-center justify-center mb-6">
                        <LockClosedIcon className="w-8 h-8 text-cyan-400 mr-2" />
                        <h2 className="text-2xl font-semibold text-white">Demo Access</h2>
                    </div>

                    {/* Request Counter */}
                    <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-300">Remaining Requests:</span>
                            <span className={`font-bold text-lg ${remainingRequests <= 10 ? 'text-red-400' : 'text-cyan-400'}`}>
                                {remainingRequests}/50
                            </span>
                        </div>
                        {remainingRequests <= 10 && (
                            <div className="flex items-center mt-2 text-yellow-400 text-sm">
                                <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                                <span>Limited requests remaining</span>
                            </div>
                        )}
                    </div>

                    {/* Demo Credentials Info */}
                    <div className="mb-6 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                        <h3 className="text-blue-300 font-medium mb-2">Demo Credentials:</h3>
                        <div className="text-sm text-slate-300 space-y-1">
                            <p><strong>Username:</strong> demo</p>
                            <p><strong>Password:</strong> demo123</p>
                        </div>
                        <button
                            type="button"
                            onClick={fillDemoCredentials}
                            className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
                        >
                            Click to auto-fill
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="text-red-400 bg-red-500/10 border border-red-400/30 p-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-3 pl-10 pr-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-3 pl-10 pr-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
                                    placeholder="Enter password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || remainingRequests <= 0}
                            className="w-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                        >
                            {isLoading ? 'Signing In...' : remainingRequests <= 0 ? 'No Requests Remaining' : 'Sign In'}
                        </button>
                    </form>

                    {remainingRequests <= 0 && (
                        <div className="mt-4 p-4 bg-red-500/10 border border-red-400/30 rounded-lg">
                            <p className="text-red-400 text-sm text-center">
                                The demo has reached its request limit. Please contact the administrator for more access.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-sm text-slate-500">
                    <p><strong>Note:</strong> This is a demo version with limited requests to prevent API abuse.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
