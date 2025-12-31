import React, { useState } from 'react';
import { User } from '../types';
import { loginUser, registerUser } from '../services/authService';

interface LoginViewProps {
    onLoginSuccess: (user: User) => void;
    onBackToCover?: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onBackToCover }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        console.log('提交表单:', { isLoginMode, username, password: '***' });

        try {
            if (isLoginMode) {
                // 登录
                console.log('开始登录...');
                const result = await loginUser(username, password);
                console.log('登录结果:', result);
                if (result.success && result.user) {
                    onLoginSuccess(result.user);
                } else {
                    setError(result.error || '登录失败');
                    setLoading(false);
                }
            } else {
                // 注册
                if (password !== confirmPassword) {
                    setError('两次输入的密码不一致');
                    setLoading(false);
                    return;
                }
                
                if (password.length < 6) {
                    setError('密码至少需要6个字符');
                    setLoading(false);
                    return;
                }
                
                if (username.trim().length < 3) {
                    setError('用户名至少需要3个字符');
                    setLoading(false);
                    return;
                }
                
                const result = await registerUser({ username, password, email });
                if (result.success && result.user) {
                    onLoginSuccess(result.user);
                } else {
                    setError(result.error || '注册失败');
                    setLoading(false);
                }
            }
        } catch (err: any) {
            setError(err.message || '操作失败，请重试');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex relative">
            {/* Back Button */}
            {onBackToCover && (
                <button
                    onClick={onBackToCover}
                    className="absolute top-4 left-4 z-20 p-2 text-white hover:text-gray-300 hover:bg-black/20 rounded-lg transition-colors"
                    title="返回封面"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
            )}

            {/* Left Panel - Login Form */}
            <div className="w-full md:w-1/3 bg-[#36343d] flex flex-col justify-center p-8 md:p-12 relative z-10">
                {/* Logo Icon */}
                <div className="mb-8">
                    <div className="w-12 h-12 bg-blue-600 rounded mb-6 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    {/* Hourglass Icon */}
                    <div className="w-16 h-16 border-2 border-white/30 rounded-lg mb-6 flex items-center justify-center">
                        <svg className="w-10 h-10 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>

                {/* App Title */}
                <div className="mb-2">
                    <h2 className="text-white text-lg">
                        <span className="underline decoration-orange-500">ProReport GenAI</span>
                        <span className="text-gray-400"> - 专业报告生成工具</span>
                    </h2>
                </div>

                {/* Conditional Title and Form */}
                {isLoginMode ? (
                    <>
                        {/* Sign in Title */}
                        <h1 className="text-3xl md:text-4xl font-bold text-orange-500 mb-8">Sign in</h1>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username */}
                            <div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#2a2830] border border-gray-600 rounded text-gray-300 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                                    placeholder="Username:"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#2a2830] border border-gray-600 rounded text-gray-300 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                                    placeholder="Password:"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gray-300 text-gray-800 py-3 rounded font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? '处理中...' : 'Login'}
                            </button>
                        </form>

                        {/* Register Link */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-400 text-sm mb-3">
                                还没有账号？
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLoginMode(false);
                                    setError('');
                                    setUsername('');
                                    setPassword('');
                                    setEmail('');
                                    setConfirmPassword('');
                                }}
                                className="w-full bg-orange-500 text-white py-2 px-4 rounded font-medium hover:bg-orange-600 transition-colors"
                            >
                                立即注册
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Sign up Title */}
                        <h1 className="text-3xl md:text-4xl font-bold text-orange-500 mb-8">Sign up</h1>

                        {/* Register Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username */}
                            <div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#2a2830] border border-gray-600 rounded text-gray-300 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                                    placeholder="Username:"
                                    required
                                    minLength={3}
                                    disabled={loading}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#2a2830] border border-gray-600 rounded text-gray-300 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                                    placeholder="Email (可选):"
                                    disabled={loading}
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#2a2830] border border-gray-600 rounded text-gray-300 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                                    placeholder="Password:"
                                    required
                                    minLength={6}
                                    disabled={loading}
                                />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#2a2830] border border-gray-600 rounded text-gray-300 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                                    placeholder="Confirm Password:"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Register Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gray-300 text-gray-800 py-3 rounded font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? '处理中...' : 'Register'}
                            </button>
                        </form>

                        {/* Back to Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-400 text-sm">
                                已有账号？{' '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLoginMode(true);
                                        setError('');
                                        setUsername('');
                                        setPassword('');
                                        setEmail('');
                                        setConfirmPassword('');
                                    }}
                                    className="text-orange-500 hover:text-orange-400 font-medium underline"
                                >
                                    立即登录
                                </button>
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Right Panel - Background Image */}
            <div className="hidden md:flex md:w-2/3 bg-cover bg-center bg-no-repeat relative overflow-hidden">
                {/* Blurred Background Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwMCIgaGVpZ2h0PSIxMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAwIiBoZWlnaHQ9IjEwMDAiIGZpbGw9IiNmNWY1ZjUiLz48L3N2Zz4=')`,
                        filter: 'blur(8px) brightness(0.3)',
                        transform: 'scale(1.1)'
                    }}
                />
                {/* Overlay for better contrast */}
                <div className="absolute inset-0 bg-black/40" />
                
                {/* Decorative elements */}
                <div className="absolute bottom-8 right-8 flex flex-col gap-4 z-10">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </div>
                    <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <span className="text-white text-xs font-bold">A中</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginView;

