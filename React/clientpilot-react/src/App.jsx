
import { useState } from 'react';
import './App.css';

import Login from './Components/Login.jsx';
import Signup from './Components/Signup.jsx';
import Navbar from './Components/Navbar.jsx';
import Dashboard from './Components/Dashboard.jsx';
import Clients from './Components/Clients.jsx';
import Deals from './Components/Deals.jsx';
import Activities from './Components/Activities.jsx';
import Reports from './Components/Reports.jsx';
import ChatBox from './Components/ChatBox.jsx';
import Admin from './Components/Admin.jsx';

export default function App() {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem('currentUser')) || null
  );

  const [authPage, setAuthPage] = useState('Login');
  const [page, setPage] = useState('Dashboard');

  const [users, setUsers] = useState(
    () => JSON.parse(localStorage.getItem('users')) || []
  );

  const [records, setRecords] = useState(
    () => JSON.parse(localStorage.getItem('records')) || []
  );

  const handleUpdateUsers = (updatedUsers) => {
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleLogin = (account) => {
    setUser(account);
    localStorage.setItem('currentUser', JSON.stringify(account));

    const newRecord = {
      name: account.name,
      email: account.email,
      role: account.role,
      login: new Date().toLocaleString(),
      logout: '',
      status: 'Online'
    };

    setRecords(previous => {
      const updated = [...previous, newRecord];
      localStorage.setItem('records', JSON.stringify(updated));
      return updated;
    });

    setPage(account.role === 'Admin' ? 'Admin' : 'Dashboard');
  };

  const handleLogout = () => {
    setRecords(previous => {
      const updated = [...previous];

      for (let i = updated.length - 1; i >= 0; i--) {
        if (
          updated[i].email === user.email &&
          updated[i].status === 'Online'
        ) {
          updated[i] = {
            ...updated[i],
            logout: new Date().toLocaleString(),
            status: 'Offline'
          };
          break;
        }
      }

      localStorage.setItem('records', JSON.stringify(updated));
      return updated;
    });

    localStorage.removeItem('currentUser');
    setUser(null);
    setAuthPage('Login');
    setPage('Dashboard');
  };

  if (!user) {
    if (authPage === 'Signup') {
      return (
        <Signup
          onBackToLogin={() => setAuthPage('Login')}
          onSignup={handleUpdateUsers}
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        onShowSignup={() => setAuthPage('Signup')}
      />
    );
  }

  return (
    <div>
      <Navbar
        page={page}
        setPage={setPage}
        role={user.role}
        name={user.name}
        onLogout={handleLogout}
      />

      {user.role === 'Admin' ? (
        <Admin
          users={users}
          records={records}
          onUpdateUsers={handleUpdateUsers}
        />
      ) : (
        <>
          {page === 'Dashboard' && <Dashboard />}
          {page === 'Clients' && <Clients />}
          {page === 'Deals' && <Deals />}
          {page === 'Activities' && <Activities />}
          {page === 'Reports' && <Reports />}
          {page === 'Chat' && <ChatBox />}
        </>
      )}
    </div>
  );
}
