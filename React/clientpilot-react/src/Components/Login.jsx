
import { useState } from 'react';

export const ADMINS = [
    { name: 'Aadhya Rao', email: 'aadhya@clientpilot.com' },
    { name: 'Arjun Reddy', email: 'arjun@clientpilot.com' },
    { name: 'Meera Nair', email: 'meera@clientpilot.com' }
];

const ADMIN_PASSWORD = 'Admin@123';

export default function Login({ onLogin, onShowSignup }) {
    const [portal, setPortal] = useState('User');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        const cleanEmail = email.trim().toLowerCase();

        if (!cleanEmail.endsWith('@clientpilot.com')) {
            setMessage('Only @clientpilot.com accounts are allowed.');
            return;
        }

        if (portal === 'Admin') {
            const admin = ADMINS.find(item => item.email === cleanEmail);

            if (!admin || password !== ADMIN_PASSWORD) {
                setMessage('Invalid Admin email or password.');
                return;
            }

            onLogin({
                ...admin,
                role: 'Admin',
                status: 'Approved'
            });
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];

        const user = users.find(
            item =>
                item.email === cleanEmail &&
                item.password === password &&
                item.role !== 'Admin'
        );

        if (!user) {
            setMessage('Invalid email or password.');
        } else if (user.status !== 'Approved') {
            setMessage(
                user.status === 'Rejected'
                    ? 'Your access request was rejected.'
                    : 'Your account is waiting for Admin approval.'
            );
        } else {
            onLogin(user);
        }
    };

    const selectAdmin = (admin) => {
        setEmail(admin.email);
        setPassword(ADMIN_PASSWORD);
        setMessage('');
    };

    return (
        <div className="auth-container">
            <form className="auth-card" onSubmit={handleLogin}>
                <h1>ClientPilot</h1>
                <p>SecureStack CRM Workspace</p>

                <div className="portal-buttons">
                    <button
                        type="button"
                        className={portal === 'User' ? 'active' : ''}
                        onClick={() => {
                            setPortal('User');
                            setMessage('');
                            setEmail('');
                            setPassword('');
                        }}
                    >
                        User Login
                    </button>

                    <button
                        type="button"
                        className={portal === 'Admin' ? 'active' : ''}
                        onClick={() => {
                            setPortal('Admin');
                            setMessage('');
                            setEmail('');
                            setPassword('');
                        }}
                    >
                        Admin Portal
                    </button>
                </div>

                <h2>{portal} Login</h2>
                <p className="domain-note">
                    Organization Perimeter: @clientpilot.com only
                </p>

                <input
                    type="email"
                    placeholder="Company Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />

                <button className="primary-btn" type="submit">
                    Login
                </button>

                {message && <p className="auth-message">{message}</p>}

                {portal === 'Admin' && (
                    <div className="admin-access">
                        <h3>Authorized Administrators</h3>
                        {ADMINS.map(admin => (
                            <button
                                type="button"
                                key={admin.email}
                                onClick={() => selectAdmin(admin)}
                            >
                                {admin.name}
                            </button>
                        ))}
                        <small>Admin password: {ADMIN_PASSWORD}</small>
                    </div>
                )}

                {portal === 'User' && (
                    <p className="signup-link">
                        New employee?{' '}
                        <button type="button" onClick={onShowSignup}>
                            Request Access
                        </button>
                    </p>
                )}
            </form>
        </div>
    );
}
