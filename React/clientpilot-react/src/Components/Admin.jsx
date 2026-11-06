
import { useState } from 'react';

export default function Admin({ users, onUpdateUsers, records }) {
    const [section, setSection] = useState('Overview');

    const pending = users.filter(
        user => user.role !== 'Admin' && user.status === 'Pending'
    );

    const employees = users.filter(user => user.role !== 'Admin');

    const approved = employees.filter(
        user => user.status === 'Approved'
    );

    const rejected = employees.filter(
        user => user.status === 'Rejected'
    );

    const updateStatus = (email, status) => {
        const updatedUsers = users.map(user =>
            user.email === email ? { ...user, status } : user
        );

        onUpdateUsers(updatedUsers);
    };

    const sections = [
        'Overview',
        'Access Requests',
        'Employees',
        'Employee Activity'
    ];

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <h2>ClientPilot</h2>
                <p>ADMINISTRATION</p>

                {sections.map(item => (
                    <button
                        key={item}
                        className={section === item ? 'admin-active' : ''}
                        onClick={() => setSection(item)}
                    >
                        {item}
                        {item === 'Access Requests' && pending.length > 0 && (
                            <span className="request-count">{pending.length}</span>
                        )}
                    </button>
                ))}

                <div className="admin-sidebar-footer">
                    Tier-1 Administration
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <div>
                        <h1>{section}</h1>
                        <p>SecureStack CRM Management Portal</p>
                    </div>
                    <span className="admin-tag">Administrator</span>
                </header>

                {section === 'Overview' && (
                    <>
                        <div className="admin-welcome">
                            <h2>Welcome to the Admin Dashboard</h2>
                            <p>Manage employee access and monitor workspace activity.</p>
                        </div>

                        <div className="admin-stats">
                            <div className="admin-stat">
                                <span>Total Employees</span>
                                <h2>{employees.length}</h2>
                            </div>

                            <div className="admin-stat">
                                <span>Pending Requests</span>
                                <h2>{pending.length}</h2>
                            </div>

                            <div className="admin-stat">
                                <span>Approved Employees</span>
                                <h2>{approved.length}</h2>
                            </div>

                            <div className="admin-stat">
                                <span>Rejected Requests</span>
                                <h2>{rejected.length}</h2>
                            </div>
                        </div>

                        <div className="admin-panel">
                            <h3>Recent Access Requests</h3>

                            {pending.length === 0 ? (
                                <p>No pending requests at the moment.</p>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Employee</th>
                                            <th>Email</th>
                                            <th>Requested At</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pending.slice(0, 5).map(user => (
                                            <tr key={user.email}>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.requestedAt || '-'}</td>
                                                <td>
                                                    <button
                                                        className="approve-btn"
                                                        onClick={() => updateStatus(user.email, 'Approved')}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        className="reject-btn"
                                                        onClick={() => updateStatus(user.email, 'Rejected')}
                                                    >
                                                        Reject
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </>
                )}

                {section === 'Access Requests' && (
                    <div className="admin-panel">
                        <h3>Employee Access Requests</h3>
                        <p>Review and manage new employee registrations.</p>

                        {pending.length === 0 ? (
                            <p className="empty-state">No pending access requests.</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Company Email</th>
                                        <th>Request Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pending.map(user => (
                                        <tr key={user.email}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.requestedAt || '-'}</td>
                                            <td>
                                                <button
                                                    className="approve-btn"
                                                    onClick={() => updateStatus(user.email, 'Approved')}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="reject-btn"
                                                    onClick={() => updateStatus(user.email, 'Rejected')}
                                                >
                                                    Reject
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {section === 'Employees' && (
                    <div className="admin-panel">
                        <h3>Employee Directory</h3>

                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Account Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map(user => (
                                    <tr key={user.email}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`status-${user.status.toLowerCase()}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td>
                                            {user.status !== 'Approved' && (
                                                <button
                                                    className="approve-btn"
                                                    onClick={() => updateStatus(user.email, 'Approved')}
                                                >
                                                    Approve
                                                </button>
                                            )}
                                            {user.status === 'Approved' && (
                                                <button
                                                    className="reject-btn"
                                                    onClick={() => updateStatus(user.email, 'Rejected')}
                                                >
                                                    Revoke Access
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {section === 'Employee Activity' && (
                    <div className="admin-panel">
                        <h3>Employee Login and Logout Records</h3>

                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Login</th>
                                    <th>Logout</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.filter(record => record.role !== 'Admin').map((record, index) => (
                                    <tr key={index}>
                                        <td>{record.name}</td>
                                        <td>{record.email}</td>
                                        <td>{record.login}</td>
                                        <td>{record.logout || '-'}</td>
                                        <td>{record.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
