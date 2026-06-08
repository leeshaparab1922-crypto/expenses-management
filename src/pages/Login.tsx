import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LOGO_BASE64 } from '../assets/logo';
import heroIllustration from '../assets/hero-illustration.png';

const Login: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
<<<<<<< HEAD
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const { login, signup, error, setError } = useAuth();
=======
    
    // Login form fields
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showLoginPassword, setShowLoginPassword] = useState(false);

    // Signup form fields
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupConfirm, setSignupConfirm] = useState('');
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const [showSignupConfirm, setShowSignupConfirm] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { login, signup, currentUser } = useAuth();
>>>>>>> feature/stack-upgrade
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (currentUser) {
            navigate('/dashboard');
        }
    }, [currentUser, navigate]);

    const handleTabChange = (tab: 'login' | 'signup') => {
        setIsLogin(tab === 'login');
        setError(null);
        setSuccess(null);
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);
        try {
<<<<<<< HEAD
            if (isLogin) {
                await login(email, password);
            } else {
                if (password !== confirmPassword) {
                    throw new Error('Passwords do not match');
                }
                await signup(email, password);
                // signup implicitly logins, but we might want to update fullName later
=======
            const normalizedEmail = loginEmail.trim().toLowerCase();
            if (!normalizedEmail || !loginPassword) {
                throw new Error('Please enter both email and password.');
>>>>>>> feature/stack-upgrade
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
                throw new Error('Please enter a valid email address (e.g. user@example.com).');
            }
            login(normalizedEmail, loginPassword);
            setSuccess('Login successful! Redirecting to your dashboard...');
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err: any) {
            setError(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);
        try {
            const normalizedEmail = signupEmail.trim().toLowerCase();
            if (!signupName.trim()) {
                throw new Error('Please enter your full name.');
            }
            if (!normalizedEmail) {
                throw new Error('Please enter your email.');
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
                throw new Error('Please enter a valid email address (e.g. user@example.com).');
            }
            if (signupPassword.length < 8) {
                throw new Error('Password must be at least 8 characters long.');
            }
            if (!/[A-Z]/.test(signupPassword)) {
                throw new Error('Password must contain at least one uppercase letter (A-Z).');
            }
            if (!/[a-z]/.test(signupPassword)) {
                throw new Error('Password must contain at least one lowercase letter (a-z).');
            }
            if (!/[0-9]/.test(signupPassword)) {
                throw new Error('Password must contain at least one number (0-9).');
            }
            if (!/[!@#$%^&*]/.test(signupPassword)) {
                throw new Error('Password must contain at least one special character (!@#$%^&*).');
            }
            if (signupPassword !== signupConfirm) {
                throw new Error('Passwords do not match.');
            }
            signup(normalizedEmail, signupPassword);
            setSuccess('Account created successfully! Welcome to SpendWise!');
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err: any) {
            if (err.message === 'User already exists') {
                setError('An account with this email already exists. Please login instead.');
            } else {
                setError(err.message || 'Sign up failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
<<<<<<< HEAD
        <div className="bg-background font-body-lg text-on-background min-h-screen flex flex-col md:flex-row overflow-x-hidden">
            {/* Top AppBar (Mobile Only) */}
            <header className="bg-primary-container text-on-primary-container flex items-center justify-center w-full h-16 px-gutter docked full-width top-0 z-50 fixed md:hidden">
                <div className="flex items-center gap-2">
                    <img alt="SpendWise Logo" className="h-8 w-8 rounded-lg" src="https://lh3.googleusercontent.com/aida/AP1WRLsOS_TqHFHlhyXjTRl2XS4gTpDt_2dZet8gWivcFidkQ_JxTe0_1koMGUD_NKfqVUrDXyiXM4E21IjSxbiO3UlFejvEAazNgEEeuoJ4ygsAIZOYKLVPjwfo3rlOmkIUsIT4I-t3OUb_IH_PjedUc26OYpVGHgirPQLpxHFX7lcwisKiy-rFBUNyRkIn3DeIY5tXUjH5Mc33_JCLJYW9vUhv1y-JlOhcLKAu4W26n-MhnKQtms15wg6dwZYI" />
=======
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-background font-body-lg text-on-background overflow-x-hidden">
            {/* Top AppBar (Mobile Only Brand Header) */}
            <header className="bg-primary-container text-on-primary-container flex items-center justify-center w-full h-16 px-gutter top-0 z-50 fixed md:hidden">
                <div className="flex items-center gap-2">
                    <img alt="SpendWise Logo" className="h-8 w-8 rounded-lg" src={LOGO_BASE64} />
>>>>>>> feature/stack-upgrade
                    <span className="font-headline-md text-headline-md font-bold text-on-primary-container">SpendWise</span>
                </div>
            </header>

<<<<<<< HEAD
            <main className="flex-1 flex flex-col md:flex-row w-full min-h-screen">
                {/* Left Section: Visuals & Tagline */}
                <section className="w-full md:w-1/2 bg-[#E8F5E9] pt-24 pb-12 px-gutter flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="max-w-md w-full animate-fade-in">
                        <div className="hidden md:flex items-center justify-center gap-3 mb-12">
                            <img alt="SpendWise" className="h-12 w-12 rounded-xl shadow-sm" src="https://lh3.googleusercontent.com/aida/AP1WRLsOS_TqHFHlhyXjTRl2XS4gTpDt_2dZet8gWivcFidkQ_JxTe0_1koMGUD_NKfqVUrDXyiXM4E21IjSxbiO3UlFejvEAazNgEEeuoJ4ygsAIZOYKLVPjwfo3rlOmkIUsIT4I-t3OUb_IH_PjedUc26OYpVGHgirPQLpxHFX7lcwisKiy-rFBUNyRkIn3DeIY5tXUjH5Mc33_JCLJYW9vUhv1y-JlOhcLKAu4W26n-MhnKQtms15wg6dwZYI" />
=======
            {/* Main Content Area */}
            <main className="flex-1 flex flex-col md:flex-row w-full min-h-screen">
                {/* Left Section: Visuals & Tagline (Hero) */}
                <section className="w-full md:w-1/2 bg-[#E8F5E9] pt-24 pb-12 px-gutter flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="max-w-md w-full animate-fade-in">
                        {/* Branding (Hidden on mobile as it's in header, visible on Desktop) */}
                        <div className="hidden md:flex items-center justify-center gap-3 mb-12">
                            <img alt="SpendWise" className="h-12 w-12 rounded-xl shadow-sm" src={LOGO_BASE64} />
>>>>>>> feature/stack-upgrade
                            <h1 className="font-headline-lg text-headline-lg text-primary">SpendWise</h1>
                        </div>
                        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-4">
                            Take control of your money.
                        </h2>
                        <p className="text-on-surface-variant font-body-lg mb-8 max-w-sm mx-auto">
                            Smart financial tracking for a better tomorrow. Join thousands of users managing their wealth with precision.
                        </p>
<<<<<<< HEAD
                        <div className="relative w-full aspect-square max-w-[320px] mx-auto">
                            <img alt="Financial Illustration" className="w-full h-full object-contain relative z-10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp_VARJQHbtEDC_icyBI2c-8s2DtyPyI7PZ2pTiDe86XIRKHDP4AXRdkuJwQJThKpu5ScHMpFRziF-hu9zdugctNRpAyaKURUSoCJENVZUgw78h6SKWXtBtO4n_CXkWEjxbTIZI7EY-yyjFBg0W8rOlm52xEeyi5hKSjxFmD9qmW8LkXH7w48ryhoCMz3U-OhKdfWCEEmIdcY8uSxtefk7WzqjluHZDtg5RH4yQtIwPK7jX4cSfYU8pbD8KqmCIrIIQ4qOIt2Z_rv3"/>
=======
                        {/* Hero Illustration */}
                        <div className="relative w-full aspect-square max-w-[320px] mx-auto">
                            <img
                                alt="Financial Illustration"
                                className="w-full h-full object-contain relative z-10"
                                src={heroIllustration}
                            />
                            {/* Subtle background decoration */}
>>>>>>> feature/stack-upgrade
                            <div className="absolute inset-0 bg-primary/5 rounded-full scale-125 blur-3xl -z-0"></div>
                        </div>
                    </div>
                </section>

                {/* Right Section: Login/Signup Forms */}
<<<<<<< HEAD
                <section className="w-full md:w-1/2 flex flex-col bg-background md:bg-[#E8F5E9] items-center justify-center relative">
                    <div className="w-full max-w-lg bg-surface md:rounded-3xl md:shadow-xl md:border border-outline-variant overflow-hidden flex flex-col min-h-[600px] md:min-h-0 relative -mt-6 md:mt-0 rounded-t-[32px] z-20">
                        {/* Tab Switching */}
                        <div className="flex border-b border-outline-variant">
                            <button 
                                className={`flex-1 py-5 font-label-md text-label-md transition-all ${isLogin ? 'text-primary border-b-2 border-primary bg-surface' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                                onClick={() => { setIsLogin(true); setError(null); }}
=======
                <section className="w-full md:w-1/2 flex flex-col bg-background md:bg-[#E8F5E9] items-center justify-center relative pb-24 md:pb-0">
                    <div className="w-full max-w-lg bg-surface md:rounded-3xl md:shadow-xl md:border border-outline-variant overflow-hidden flex flex-col min-h-[580px] md:min-h-0 relative -mt-6 md:mt-0 rounded-t-[32px] z-20">
                        {/* Tab Switching */}
                        <div className="flex border-b border-outline-variant">
                            <button 
                                id="tab-login"
                                onClick={() => handleTabChange('login')}
                                className={`flex-1 py-5 font-label-md text-label-md transition-all cursor-pointer ${
                                    isLogin 
                                        ? 'text-primary border-b-2 border-primary bg-surface font-bold' 
                                        : 'text-on-surface-variant hover:bg-surface-container-low'
                                }`}
>>>>>>> feature/stack-upgrade
                            >
                                Login
                            </button>
                            <button 
<<<<<<< HEAD
                                className={`flex-1 py-5 font-label-md text-label-md transition-all ${!isLogin ? 'text-primary border-b-2 border-primary bg-surface' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                                onClick={() => { setIsLogin(false); setError(null); }}
=======
                                id="tab-signup"
                                onClick={() => handleTabChange('signup')}
                                className={`flex-1 py-5 font-label-md text-label-md transition-all cursor-pointer ${
                                    !isLogin 
                                        ? 'text-primary border-b-2 border-primary bg-surface font-bold' 
                                        : 'text-on-surface-variant hover:bg-surface-container-low'
                                }`}
>>>>>>> feature/stack-upgrade
                            >
                                Sign Up
                            </button>
                        </div>

                        {/* Form Container */}
                        <div className="p-gutter md:p-12 flex-1">
<<<<<<< HEAD
                            <form className="space-y-6 block form-transition" onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    {!isLogin && (
                                        <div>
                                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2" htmlFor="signup-name">Full Name</label>
                                            <input 
                                                className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary font-body-sm transition-all outline-none" 
                                                id="signup-name" 
                                                placeholder="John Doe" 
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                required={!isLogin}
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <label className="block font-label-md text-label-md text-on-surface-variant mb-2" htmlFor="email">Email Address</label>
                                        <input 
                                            className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary font-body-sm transition-all outline-none" 
                                            id="email" 
                                            placeholder="name@company.com" 
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className={isLogin ? "relative" : "grid grid-cols-1 gap-4 sm:grid-cols-2"}>
                                        <div className="relative">
                                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2" htmlFor="password">Password</label>
                                            <div className="relative">
                                                <input 
                                                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary font-body-sm transition-all outline-none" 
                                                    id="password" 
                                                    placeholder="••••••••" 
                                                    type={showPassword ? "text" : "password"}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                                {isLogin && (
                                                    <button 
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors" 
                                                        onClick={() => setShowPassword(!showPassword)} 
                                                        type="button"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {!isLogin && (
                                            <div>
                                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2" htmlFor="confirm-password">Confirm</label>
                                                <input 
                                                    className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary font-body-sm transition-all outline-none" 
                                                    id="confirm-password" 
                                                    placeholder="••••••••" 
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required={!isLogin}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {isLogin && (
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all" type="checkbox"/>
=======
                            {/* Success Banner */}
                            {success && (
                                <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg border border-green-300 text-body-sm flex items-start gap-2 animate-fade-in">
                                    <span className="material-symbols-outlined text-[20px] text-green-600">check_circle</span>
                                    <span>{success}</span>
                                </div>
                            )}

                            {/* Error Alert Panel */}
                            {error && (
                                <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg border border-error/20 text-body-sm flex items-start gap-2 animate-fade-in">
                                    <span className="material-symbols-outlined text-[20px] text-error">error</span>
                                    <div className="flex flex-col gap-1">
                                        <span>{error}</span>
                                        {error.includes('already exists') && (
                                            <button
                                                type="button"
                                                onClick={() => handleTabChange('login')}
                                                className="text-primary underline text-left font-semibold hover:opacity-80"
                                            >
                                                Go to Login →
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {isLogin ? (
                                /* Login Form */
                                <form id="form-login" className="space-y-6 block form-transition" onSubmit={handleLoginSubmit}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2" htmlFor="login-email">Email Address</label>
                                            <input 
                                                id="login-email"
                                                type="email"
                                                required
                                                value={loginEmail}
                                                onChange={(e) => setLoginEmail(e.target.value)}
                                                placeholder="name@company.com"
                                                className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary font-body-sm transition-all outline-none text-on-surface"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2" htmlFor="login-password">Password</label>
                                            <div className="relative">
                                                <input 
                                                    id="login-password"
                                                    type={showLoginPassword ? 'text' : 'password'}
                                                    required
                                                    value={loginPassword}
                                                    onChange={(e) => setLoginPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="w-full h-12 pl-4 pr-12 bg-surface border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary font-body-sm transition-all outline-none text-on-surface"
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">
                                                        {showLoginPassword ? 'visibility_off' : 'visibility'}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input 
                                                type="checkbox"
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                                className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer"
                                            />
>>>>>>> feature/stack-upgrade
                                            <span className="font-body-sm text-on-surface-variant group-hover:text-on-surface">Remember me</span>
                                        </label>
                                        <a className="font-label-md text-label-md text-primary hover:underline" href="#">Forgot password?</a>
                                    </div>
<<<<<<< HEAD
                                )}

                                {!isLogin && (
                                    <p className="text-label-md font-body-sm text-on-surface-variant text-center">
                                        By creating an account, you agree to our 
                                        <a className="text-primary hover:underline ml-1" href="#">Terms of Service</a>.
                                    </p>
                                )}

                                <button className="w-full h-12 bg-primary-container text-on-primary hover:bg-primary transition-all rounded-lg font-label-md text-label-md shadow-md active:scale-[0.98]" type="submit">
                                    {isLogin ? 'Login' : 'Create Account'}
                                </button>
                                
                                {isLogin && (
                                    <>
                                        <div className="relative py-4">
                                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant"></div></div>
                                            <div className="relative flex justify-center text-label-md"><span className="bg-surface px-4 text-on-surface-variant">or continue with</span></div>
                                        </div>
                                        <button className="w-full h-12 flex items-center justify-center gap-3 bg-surface border border-outline-variant hover:bg-surface-container-low transition-all rounded-lg font-label-md text-label-md text-on-surface active:scale-[0.98]" type="button">
                                            <img alt="Google" className="h-5 w-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkme9BQWiU7Z7jscPqHZy8Lw1INBfxYTNEAl_6dCwt-oRULBTY8xiQ96Gguh9xHzOJsHeS7iPMcx8FrzmSHkLhs2RiMtNnpmxdX6cFiZ-zN5AgAxHiZExV2rwAW9XpOOd5DvhtmFlzsYvrUWKVIRMTYLRbggqXHGbBb49EfLI4SnkNm9pOHeII1zFbBPj86Mwg-ys02eK9BiNCyLgvcxAqRkcSgcP7QvvnWqtPB3XD2MuZKkgeuELDkc9xRjhNxmuWCRBTST9pmpUQ"/>
                                            Sign in with Google
                                        </button>
                                    </>
                                )}
                            </form>
                            {error && <div className="text-red-500 text-center text-sm mt-4">{error}</div>}
                        </div>
                        
=======

                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-12 bg-primary-container text-on-primary-container hover:bg-primary hover:text-white transition-all rounded-lg font-label-md text-label-md shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer font-bold"
                                    >
                                        {loading ? 'Logging in...' : 'Login'}
                                    </button>

                                    <div className="relative py-4">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-outline-variant"></div>
                                        </div>
                                        <div className="relative flex justify-center text-label-md">
                                            <span className="bg-surface px-4 text-on-surface-variant">or continue with</span>
                                        </div>
                                    </div>

                                    <button 
                                        type="button"
                                        className="w-full h-12 flex items-center justify-center gap-3 bg-surface border border-outline-variant hover:bg-surface-container-low transition-all rounded-lg font-label-md text-label-md text-on-surface active:scale-[0.98] cursor-pointer"
                                    >
                                        <img 
                                            alt="Google" 
                                            className="h-5 w-5" 
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkme9BQWiU7Z7jscPqHZy8Lw1INBfxYTNEAl_6dCwt-oRULBTY8xiQ96Gguh9xHzOJsHeS7iPMcx8FrzmSHkLhs2RiMtNnpmxdX6cFiZ-zN5AgAxHiZExV2rwAW9XpOOd5DvhtmFlzsYvrUWKVIRMTYLRbggqXHGbBb49EfLI4SnkNm9pOHeII1zFbBPj86Mwg-ys02eK9BiNCyLgvcxAqRkcSgcP7QvvnWqtPB3XD2MuZKkgeuELDkc9xRjhNxmuWCRBTST9pmpUQ" 
                                        />
                                        Sign in with Google
                                    </button>
                                </form>
                            ) : (
                                /* Sign Up Form */
                                <form id="form-signup" className="space-y-6 block form-transition" onSubmit={handleSignupSubmit}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2" htmlFor="signup-name">Full Name</label>
                                            <input 
                                                id="signup-name"
                                                type="text"
                                                required
                                                value={signupName}
                                                onChange={(e) => setSignupName(e.target.value)}
                                                placeholder="John Doe"
                                                className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary font-body-sm transition-all outline-none text-on-surface"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2" htmlFor="signup-email">Email Address</label>
                                            <input 
                                                id="signup-email"
                                                type="email"
                                                required
                                                value={signupEmail}
                                                onChange={(e) => setSignupEmail(e.target.value)}
                                                placeholder="name@company.com"
                                                className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary font-body-sm transition-all outline-none text-on-surface"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2" htmlFor="signup-password">Password</label>
                                                <div className="relative">
                                                    <input 
                                                        id="signup-password"
                                                        type={showSignupPassword ? 'text' : 'password'}
                                                        required
                                                        value={signupPassword}
                                                        onChange={(e) => setSignupPassword(e.target.value)}
                                                        placeholder="••••••••"
                                                        className="w-full h-12 pl-4 pr-12 bg-surface border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary font-body-sm transition-all outline-none text-on-surface"
                                                    />
                                                    <button 
                                                        type="button"
                                                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">
                                                            {showSignupPassword ? 'visibility_off' : 'visibility'}
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2" htmlFor="signup-confirm">Confirm Password</label>
                                                <div className="relative">
                                                    <input 
                                                        id="signup-confirm"
                                                        type={showSignupConfirm ? 'text' : 'password'}
                                                        required
                                                        value={signupConfirm}
                                                        onChange={(e) => setSignupConfirm(e.target.value)}
                                                        placeholder="••••••••"
                                                        className="w-full h-12 pl-4 pr-12 bg-surface border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary font-body-sm transition-all outline-none text-on-surface"
                                                    />
                                                    <button 
                                                        type="button"
                                                        onClick={() => setShowSignupConfirm(!showSignupConfirm)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">
                                                            {showSignupConfirm ? 'visibility_off' : 'visibility'}
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-label-md font-body-sm text-on-surface-variant text-center leading-normal">
                                        By creating an account, you agree to our{' '}
                                        <a className="text-primary hover:underline font-semibold" href="#">Terms of Service</a>.
                                    </p>

                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-12 bg-primary-container text-on-primary-container hover:bg-primary hover:text-white transition-all rounded-lg font-label-md text-label-md shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer font-bold"
                                    >
                                        {loading ? 'Creating Account...' : 'Create Account'}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Shared Footer in Card */}
>>>>>>> feature/stack-upgrade
                        <div className="px-gutter pb-8 text-center">
                            <p className="font-body-sm text-on-surface-variant">
                                Securely encrypted with SSL. Your data is protected.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

<<<<<<< HEAD
            {/* Bottom Navigation (Mobile Only) */}
            <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center h-20 bg-surface px-margin-mobile border-t border-outline-variant md:hidden">
                <button 
                    className={`flex flex-col items-center justify-center rounded-full px-6 py-1 transition-all active:scale-90 ${isLogin ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant'}`}
                    onClick={() => setIsLogin(true)}
=======
            {/* Bottom Navigation (Mobile Only Shell) */}
            <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center h-20 bg-surface px-margin-mobile border-t border-outline-variant md:hidden">
                <button 
                    id="nav-login"
                    onClick={() => handleTabChange('login')}
                    className={`flex flex-col items-center justify-center rounded-full px-6 py-1 transition-all active:scale-90 cursor-pointer ${
                        isLogin 
                            ? 'bg-secondary-container text-on-secondary-container font-semibold' 
                            : 'text-on-surface-variant'
                    }`}
>>>>>>> feature/stack-upgrade
                >
                    <span className="material-symbols-outlined">login</span>
                    <span className="font-label-md text-label-md">Login</span>
                </button>
                <button 
<<<<<<< HEAD
                    className={`flex flex-col items-center justify-center rounded-full px-6 py-1 transition-all active:scale-90 ${!isLogin ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                    onClick={() => setIsLogin(false)}
=======
                    id="nav-signup"
                    onClick={() => handleTabChange('signup')}
                    className={`flex flex-col items-center justify-center rounded-full px-6 py-1 transition-all active:scale-90 cursor-pointer ${
                        !isLogin 
                            ? 'bg-secondary-container text-on-secondary-container font-semibold' 
                            : 'text-on-surface-variant'
                    }`}
>>>>>>> feature/stack-upgrade
                >
                    <span className="material-symbols-outlined">person_add</span>
                    <span className="font-label-md text-label-md">Sign Up</span>
                </button>
            </nav>
        </div>
    );
};

export default Login;
