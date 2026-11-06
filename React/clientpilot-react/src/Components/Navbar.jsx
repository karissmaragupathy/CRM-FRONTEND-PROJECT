
export default function Navbar({ page, setPage, role, onLogout, name }) {
    const userPages = [
        'Dashboard',
        'Clients',
        'Deals',
        'Activities',
        'Reports',
        'Chat'
    ];

    const pages = role === 'Admin' ? ['Admin'] : userPages;

    return (
        <nav className="navbar">
            <h2>ClientPilot</h2>

            <div className="nav-links">
                {pages.map(item => (
                    <button
                        key={item}
                        className={page === item ? 'selected' : ''}
                        onClick={() => setPage(item)}
                    >
                        {item}
                    </button>
                ))}
            </div>

            <div className="nav-user">
                <span>{name} · {role}</span>
                <button className="logout-btn" onClick={onLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}
