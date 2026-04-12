import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageTitle from '../components/PageTitle.tsx';
import Login from '../components/Login.tsx';
import Register from '../components/Registration.tsx';

const LoginPage = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');
    const [searchParams] = useSearchParams();

    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotMessage, setForgotMessage] = useState('');
    const [forgotError, setForgotError] = useState(false);

    const [resetPassword, setResetPassword] = useState('');
    const [resetConfirm, setResetConfirm] = useState('');
    const [resetMessage, setResetMessage] = useState('');
    const [resetError, setResetError] = useState(false);

    useEffect(() => {
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        if (token && email) {
            setActiveTab('reset');
        }
    }, [searchParams]);

    const handleForgotSubmit = async (e: any) => {
        e.preventDefault();
        setForgotMessage('');
        setForgotError(false);

        try {
            const response = await fetch('/api/auth/password/reset/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail })
            });
            const data = await response.json();
            setForgotError(!response.ok);
            setForgotMessage(data.message);
        } catch {
            setForgotError(true);
            setForgotMessage('Network error — please try again.');
        }
    };

    const handleResetSubmit = async (e: any) => {
        e.preventDefault();
        setResetMessage('');
        setResetError(false);

        if (resetPassword !== resetConfirm) {
            setResetError(true);
            setResetMessage('Passwords do not match.');
            return;
        }

        const token = searchParams.get('token');
        const email = searchParams.get('email');

        try {
            const response = await fetch('/api/auth/password/reset/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, token, newPassword: resetPassword })
            });
            const data = await response.json();
            if (!response.ok) {
                setResetError(true);
                setResetMessage(data.message);
            } else {
                setResetError(false);
                setResetMessage('Password reset! Redirecting to login...');
                setTimeout(() => setActiveTab('login'), 2500);
            }
        } catch {
            setResetError(true);
            setResetMessage('Network error — please try again.');
        }
    };

    return (
        <div>
            <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                {<Link to="/">Use without an Account</Link>}
            </div>

            <PageTitle />
            <div id="tab-container">
                {activeTab !== 'forgot' && activeTab !== 'reset' && (
                    <div id="tab-buttons">
                        <button
                            className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
                            onClick={() => setActiveTab('login')}
                        >
                            Login
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
                            onClick={() => setActiveTab('register')}
                        >
                            Register
                        </button>
                    </div>
                )}
                <div id="tab-content">
                    {activeTab === 'login' && (
                        <Login
                            onSwitchToRegister={() => setActiveTab('register')}
                            onForgotPassword={() => setActiveTab('forgot')}
                        />
                    )}
                    {activeTab === 'register' && (
                        <Register onSwitchToLogin={() => setActiveTab('login')} />
                    )}
                    {activeTab === 'forgot' && (
                        <div id="loginDiv">
                            <span id="inner-title">RESET PASSWORD</span>
                            <br />
                            <form onSubmit={handleForgotSubmit}>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    required
                                />
                                <br />
                                <input
                                    type="submit"
                                    id="loginButton"
                                    className="buttons"
                                    value="Send Reset Link"
                                />
                            </form>
                            {forgotMessage && (
                                <p style={{ color: forgotError ? '#c0392b' : '#27ae60', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                    {forgotError ? '⚠ ' : '✓ '}{forgotMessage}
                                </p>
                            )}
                            <br />
                            <p style={{ display: 'inline' }}>Remembered it? </p>
                            <button className="link-button" onClick={() => setActiveTab('login')}>Back to login</button>
                        </div>
                    )}
                    {activeTab === 'reset' && (
                        <div id="loginDiv">
                            <span id="inner-title">SET NEW PASSWORD</span>
                            <br />
                            <form onSubmit={handleResetSubmit}>
                                <input
                                    type="password"
                                    placeholder="New password"
                                    value={resetPassword}
                                    onChange={(e) => setResetPassword(e.target.value)}
                                    required
                                />
                                <br />
                                <input
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={resetConfirm}
                                    onChange={(e) => setResetConfirm(e.target.value)}
                                    required
                                />
                                <br />
                                <input
                                    type="submit"
                                    id="loginButton"
                                    className="buttons"
                                    value="Reset Password"
                                />
                            </form>
                            {resetMessage && (
                                <p style={{ color: resetError ? '#c0392b' : '#27ae60', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                    {resetError ? '⚠ ' : '✓ '}{resetMessage}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default LoginPage;
