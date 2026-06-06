import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const { login, signup, error, setError } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                if (password !== confirmPassword) {
                    throw new Error('Passwords do not match');
                }
                await signup(email, password);
                // signup implicitly logins, but we might want to update fullName later
            }
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="bg-background font-body-lg text-on-background min-h-screen flex flex-col md:flex-row overflow-x-hidden">
            {/* Top AppBar (Mobile Only) */}
            <header className="bg-primary-container text-on-primary-container flex items-center justify-center w-full h-16 px-gutter docked full-width top-0 z-50 fixed md:hidden">
                <div className="flex items-center gap-2">
                    <img alt="SpendWise Logo" className="h-8 w-8 rounded-lg" src="https://lh3.googleusercontent.com/aida/AP1WRLsOS_TqHFHlhyXjTRl2XS4gTpDt_2dZet8gWivcFidkQ_JxTe0_1koMGUD_NKfqVUrDXyiXM4E21IjSxbiO3UlFejvEAazNgEEeuoJ4ygsAIZOYKLVPjwfo3rlOmkIUsIT4I-t3OUb_IH_PjedUc26OYpVGHgirPQLpxHFX7lcwisKiy-rFBUNyRkIn3DeIY5tXUjH5Mc33_JCLJYW9vUhv1y-JlOhcLKAu4W26n-MhnKQtms15wg6dwZYI" />
                    <span className="font-headline-md text-headline-md font-bold text-on-primary-container">SpendWise</span>
                </div>
            </header>

            <main className="flex-1 flex flex-col md:flex-row w-full min-h-screen">
                {/* Left Section: Visuals & Tagline */}
                <section className="w-full md:w-1/2 bg-[#E8F5E9] pt-24 pb-12 px-gutter flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="max-w-md w-full animate-fade-in">
                        <div className="hidden md:flex items-center justify-center gap-3 mb-12">
                            <img alt="SpendWise" className="h-12 w-12 rounded-xl shadow-sm" src="https://lh3.googleusercontent.com/aida/AP1WRLsOS_TqHFHlhyXjTRl2XS4gTpDt_2dZet8gWivcFidkQ_JxTe0_1koMGUD_NKfqVUrDXyiXM4E21IjSxbiO3UlFejvEAazNgEEeuoJ4ygsAIZOYKLVPjwfo3rlOmkIUsIT4I-t3OUb_IH_PjedUc26OYpVGHgirPQLpxHFX7lcwisKiy-rFBUNyRkIn3DeIY5tXUjH5Mc33_JCLJYW9vUhv1y-JlOhcLKAu4W26n-MhnKQtms15wg6dwZYI" />
                            <h1 className="font-headline-lg text-headline-lg text-primary">SpendWise</h1>
                        </div>
                        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-4">
                            Take control of your money.
                        </h2>
                        <p className="text-on-surface-variant font-body-lg mb-8 max-w-sm mx-auto">
                            Smart financial tracking for a better tomorrow. Join thousands of users managing their wealth with precision.
                        </p>
                        <div className="relative w-full aspect-square max-w-[320px] mx-auto">
                            <img alt="Financial Illustration" className="w-full h-full object-contain relative z-10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp_VARJQHbtEDC_icyBI2c-8s2DtyPyI7PZ2pTiDe86XIRKHDP4AXRdkuJwQJThKpu5ScHMpFRziF-hu9zdugctNRpAyaKURUSoCJENVZUgw78h6SKWXtBtO4n_CXkWEjxbTIZI7EY-yyjFBg0W8rOlm52xEeyi5hKSjxFmD9qmW8LkXH7w48ryhoCMz3U-OhKdfWCEEmIdcY8uSxtefk7WzqjluHZDtg5RH4yQtIwPK7jX4cSfYU8pbD8KqmCIrIIQ4qOIt2Z_rv3"/>
                            <div className="absolute inset-0 bg-primary/5 rounded-full scale-125 blur-3xl -z-0"></div>
                        </div>
                    </div>
                </section>

                {/* Right Section: Login/Signup Forms */}
                <section className="w-full md:w-1/2 flex flex-col bg-background md:bg-[#E8F5E9] items-center justify-center relative">
                    <div className="w-full max-w-lg bg-surface md:rounded-3xl md:shadow-xl md:border border-outline-variant overflow-hidden flex flex-col min-h-[600px] md:min-h-0 relative -mt-6 md:mt-0 rounded-t-[32px] z-20">
                        {/* Tab Switching */}
                        <div className="flex border-b border-outline-variant">
                            <button 
                                className={`flex-1 py-5 font-label-md text-label-md transition-all ${isLogin ? 'text-primary border-b-2 border-primary bg-surface' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                                onClick={() => { setIsLogin(true); setError(null); }}
                            >
                                Login
                            </button>
                            <button 
                                className={`flex-1 py-5 font-label-md text-label-md transition-all ${!isLogin ? 'text-primary border-b-2 border-primary bg-surface' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                                onClick={() => { setIsLogin(false); setError(null); }}
                            >
                                Sign Up
                            </button>
                        </div>

                        {/* Form Container */}
                        <div className="p-gutter md:p-12 flex-1">
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
                                            <span className="font-body-sm text-on-surface-variant group-hover:text-on-surface">Remember me</span>
                                        </label>
                                        <a className="font-label-md text-label-md text-primary hover:underline" href="#">Forgot password?</a>
                                    </div>
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
                        
                        <div className="px-gutter pb-8 text-center">
                            <p className="font-body-sm text-on-surface-variant">
                                Securely encrypted with SSL. Your data is protected.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Bottom Navigation (Mobile Only) */}
            <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center h-20 bg-surface px-margin-mobile border-t border-outline-variant md:hidden">
                <button 
                    className={`flex flex-col items-center justify-center rounded-full px-6 py-1 transition-all active:scale-90 ${isLogin ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant'}`}
                    onClick={() => setIsLogin(true)}
                >
                    <span className="material-symbols-outlined">login</span>
                    <span className="font-label-md text-label-md">Login</span>
                </button>
                <button 
                    className={`flex flex-col items-center justify-center rounded-full px-6 py-1 transition-all active:scale-90 ${!isLogin ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                    onClick={() => setIsLogin(false)}
                >
                    <span className="material-symbols-outlined">person_add</span>
                    <span className="font-label-md text-label-md">Sign Up</span>
                </button>
            </nav>
        </div>
    );
};

export default Login;
