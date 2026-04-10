import React, { useState, useEffect } from 'react';
import {
    CheckCircle2,
    Eye,
    EyeOff,
    Bell,
    Zap,
    Mail,
    Lock,
    User,
    ArrowRight
} from 'lucide-react';
import '../style/LandingPage.css';

const LandingPage = ({ onLogin }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const savedEmail = localStorage.getItem('rt_saved_email');
        const savedPass = localStorage.getItem('rt_saved_password');
        if (savedEmail && savedPass) {
            setEmail(savedEmail);
            setPassword(savedPass);
            setRememberMe(true);
        }
    }, []);

    const handleFormToggle = () => {
        setIsRegistering(!isRegistering);
        setMessage('');
        setMessageType('');
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setMessageType('');
        
        if (isRegistering && password !== confirmPassword) {
            setMessage('Passwords do not match');
            setMessageType('error');
            return;
        }

        setIsLoading(true);
        
        const endpoint = isRegistering ? 'register.php' : 'login.php';
        const url = `http://localhost/routine-tracker/${endpoint}`;
        
        const payload = isRegistering 
            ? { name, email, password } 
            : { email, password };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                setMessageType('success');
                if (isRegistering) {
                    setMessage(data.message || 'Registration successful!');
                    // Clear form
                    setName('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                    
                    // Switch to login page after a short delay
                    setTimeout(() => {
                        setIsRegistering(false);
                        setMessage('');
                    }, 1500);
                } else {
                    setMessage('Login successful!');
                    if (rememberMe) {
                        localStorage.setItem('rt_saved_email', email);
                        localStorage.setItem('rt_saved_password', password);
                    } else {
                        localStorage.removeItem('rt_saved_email');
                        localStorage.removeItem('rt_saved_password');
                    }
                    // Trigger login success callback
                    setTimeout(() => {
                        if (onLogin) onLogin();
                    }, 500);
                }
            } else if (data.status === 'error') {
                setMessageType('error');
                setMessage(data.message || 'An error occurred');
            } else if (data.status === 'wrong_password') {
                setMessageType('error');
                setMessage('Incorrect password');
            } else if (data.status === 'not_found') {
                setMessageType('error');
                setMessage('User not found');
            }
        } catch (error) {
            console.error("API Error:", error);
            setMessageType('error');
            setMessage('Network error. Is the backend running?');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="tr-wrapper relative">
            {/* Top Right Toast Notification */}
            {message && (
                <div style={{
                    position: 'fixed',
                    top: '24px',
                    right: '24px',
                    zIndex: 9999,
                    backgroundColor: '#ffffff',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px',
                    minWidth: '320px',
                    maxWidth: '400px',
                    animation: 'slideInRightToast 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                }}>
                    <div style={{
                        flexShrink: 0,
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: messageType === 'success' ? '#f0fdf4' : '#fef2f2',
                        color: messageType === 'success' ? '#16a34a' : '#dc2626'
                    }}>
                        {messageType === 'success' ? (
                            <CheckCircle2 size={24} strokeWidth={2.5} />
                        ) : (
                            <Zap size={24} strokeWidth={2.5} />
                        )}
                    </div>
                    <div style={{
                        marginLeft: '16px',
                        marginRight: '24px',
                        color: '#1e293b',
                        fontWeight: '500',
                        fontSize: '15px',
                        fontFamily: 'inherit'
                    }}>
                        {message}
                    </div>
                    <button 
                        type="button" 
                        onClick={() => { setMessage(''); setMessageType(''); }}
                        style={{
                            marginLeft: 'auto',
                            background: 'transparent',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    <style>{`
                        @keyframes slideInRightToast {
                            0% { transform: translateX(120%); opacity: 0; }
                            100% { transform: translateX(0); opacity: 1; }
                        }
                    `}</style>
                </div>
            )}

            {/* Main Split Screen Card */}
            <div className="tr-card border-slate-100">

                {/* Left Panel: Hero Section */}
                <div className="tr-left-panel">
                    {/* Aesthetic blur dots */}
                    <div className="tr-blur-dot dot-primary"></div>
                    <div className="tr-blur-dot dot-secondary"></div>

                    <div className="tr-z-10">
                        {/* Branding */}
                        <div className="tr-brand-group">
                            <div className="tr-brand-icon-box shadow-primary-200">
                                <Zap className="tr-zap-icon" />
                            </div>
                            <span className="tr-brand-text text-slate-900">Task Reminder</span>
                        </div>

                        {/* Hero Content */}
                        <div className="tr-hero-content">
                            <h1 className="tr-hero-heading text-slate-900">
                                Never forget your tasks again. <br />
                                <span className="tr-highlight-text text-primary-600">
                                    Automatically.
                                    <span className="tr-highlight-underline bg-primary-600-10"></span>
                                </span>
                            </h1>
                            <p className="tr-hero-subtext text-slate-600">
                                Stay organized without stress. Create tasks, set reminders, and let our system notify you at the perfect time.
                            </p>

                            {/* Feature Card */}
                            <div className="tr-feature-card group hover:bg-white border-white">
                                <div className="tr-feature-icon text-primary-600 bg-primary-50">
                                    <Bell size={26} strokeWidth={2.5} />
                                </div>
                                <div className="tr-feature-text-block">
                                    <h3 className="text-slate-900">Smart Reminders</h3>
                                    <p className="text-slate-500 hover:text-slate-600">
                                        Get automatic alerts based on time and priority level.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Logo/Asset loader */}
                    <div className="tr-footer-logo-row">
                        <img
                            src="/images/logo.png"
                            alt="Brand Logo"
                            className="tr-footer-img"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png";
                            }}
                        />
                        <span className="tr-footer-text">Secure Protocol</span>
                    </div>
                </div>

                {/* Right Panel: Auth Card (Login/Register Forms) */}
                <div className="tr-right-panel bg-white shadow-auth">
                    <div className="tr-auth-content mx-auto">

                        <div className="tr-fade-in transition-all">
                            <header className="tr-auth-header text-left">
                                <h2 className="text-slate-900">
                                    {isRegistering ? "Create Your Account" : "Welcome Back \uD83D\uDC4B"}
                                </h2>
                                <p className="text-slate-500">
                                    {isRegistering ? "Start tracking your tasks easily" : "Login to manage your tasks and reminders"}
                                </p>
                            </header>

                            <form className="tr-auth-form" onSubmit={handleSubmit} autoComplete="on" method="POST">
                                {/* Registration Specific Field */}
                                {isRegistering && (
                                    <div className="tr-input-group tr-slide-down">
                                        <label className="tr-label">Full Name</label>
                                        <div className="tr-input-wrapper group">
                                            <span className="tr-input-icon text-slate-400 group-focus-within:text-primary-500">
                                                <User size={18} />
                                            </span>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                placeholder="John Doe"
                                                className="tr-input bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary-500"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                autoComplete="name"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="tr-input-group">
                                    <label className="tr-label">Email Address</label>
                                    <div className="tr-input-wrapper group">
                                        <span className="tr-input-icon text-slate-400 group-focus-within:text-primary-500">
                                            <Mail size={18} />
                                        </span>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            placeholder="name@company.com"
                                            className="tr-input bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary-500"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            autoComplete="username"
                                        />
                                    </div>
                                </div>

                                <div className="tr-input-group">
                                    <div className="tr-label-row">
                                        <label className="tr-label">Password</label>
                                    </div>
                                    <div className="tr-input-wrapper group">
                                        <span className="tr-input-icon text-slate-400 group-focus-within:text-primary-500">
                                            <Lock size={18} />
                                        </span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            required
                                            placeholder="••••••••"
                                            className="tr-input tr-input-with-eye bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary-500"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            autoComplete={isRegistering ? "new-password" : "current-password"}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="tr-eye-btn text-slate-400 hover:text-primary-600"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Registration Specific: Confirm Password */}
                                {isRegistering && (
                                    <div className="tr-input-group tr-slide-down">
                                        <label className="tr-label">Confirm Password</label>
                                        <div className="tr-input-wrapper group">
                                            <span className="tr-input-icon text-slate-400 group-focus-within:text-primary-500">
                                                <Lock size={18} />
                                            </span>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                required
                                                placeholder="••••••••"
                                                className="tr-input bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary-500"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                autoComplete="new-password"
                                            />
                                        </div>
                                    </div>
                                )}

                                {!isRegistering && (
                                    <div className="tr-checkbox-group">
                                        <div className="tr-checkbox-wrapper">
                                            <input
                                                type="checkbox"
                                                id="remember"
                                                className="tr-checkbox border-slate-200 bg-white checked:bg-primary-600 checked:border-primary-600"
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                            />
                                            <CheckCircle2 className="tr-check-icon text-white" strokeWidth={4} />
                                            </div>
                                        <label htmlFor="remember" className="tr-checkbox-label text-slate-500">Remember me</label>
                                    </div>
                                )}

                                <button
                                    disabled={isLoading}
                                    type="submit"
                                    className="tr-btn-primary bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500-20 group"
                                >
                                    {isLoading ? (
                                        <div className="tr-spinner border-t-white"></div>
                                    ) : (
                                        <div className="tr-btn-content">
                                            {isRegistering ? "Register Now" : "Login to Dashboard"}
                                            <ArrowRight className="tr-arrow-icon group-hover:translate-x-1" />
                                        </div>
                                    )}
                                </button>
                            </form>

                            <p className="tr-auth-toggle-text text-slate-500">
                                {isRegistering ? (
                                    <>Already have an account? <button onClick={handleFormToggle} className="text-primary-600 hover:underline">Login here</button></>
                                ) : (
                                    <>Don't have an account? <button onClick={handleFormToggle} className="text-primary-600 hover:underline">Create Account</button></>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
