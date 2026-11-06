
import { useState } from 'react';

export default function Signup({ onBackToLogin, onSignup }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSignup = (e) => {
        e.preventDefault();

        const cleanEmail = email.trim().toLowerCase();

        if (!cleanEmail.endsWith('@clientpilot.com')) {
            setMessage('Please use your @clientpilot.com email.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];

        if (users.some(user => user.email === cleanEmail)) {
            setMessage('This email has already been registered.');
            return;
        }

        const newUser = {
            name: name.trim(),
            email: cleanEmail,
            password,
            role: 'User',
            status: 'Pending',
            requestedAt: new Date().toLocaleString()
        };

        const updatedUsers = [...users, newUser];

        localStorage.setItem('users', JSON.stringify(updatedUsers));
        onSignup(updatedUsers);

        setMessage('Access request submitted successfully. Please wait for Admin approval.');
        setName('');
        setEmail('');
        setPassword('');
    };

    return (
        <div className="auth-container">
            <form className="auth-card" onSubmit={handleSignup}>
                <h1>ClientPilot</h1>
                <h2>Employee Registration</h2>
                <p>Request access to the SecureStack CRM workspace.</p>

                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />

                <input
                    type="email"
                    placeholder="Company Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Create Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />

                <button className="primary-btn" type="submit">
                    Submit Access Request
                </button>

                {message && <p className="auth-message">{message}</p>}

                <button
                    type="button"
                    className="back-btn"
                    onClick={onBackToLogin}
                >
                    Back to Login
                </button>
            </form>
        </div>
    );
}
