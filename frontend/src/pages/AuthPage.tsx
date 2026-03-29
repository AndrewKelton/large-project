import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle.tsx';
import Login from '../components/Login.tsx';
import Register from '../components/Registration.tsx';

const LoginPage = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

    return (
        <div>
            <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                {<Link to="/">Use without an Account</Link>}
            </div>

            <PageTitle />
            <div id="tab-container">
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
                <div id="tab-content">
                    {activeTab === 'login'
                        ? <Login onSwitchToRegister={() => setActiveTab('register')} />
                        : <Register onSwitchToLogin={() => setActiveTab('login')} />}
                </div>
            </div>
        </div>
    );
};
export default LoginPage;
