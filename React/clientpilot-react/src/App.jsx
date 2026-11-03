import React, { useState, useEffect } from 'react';
import './App.css';

const DOMAIN_RESTRICTION = "@clientpilot.com";
const ADMIN_DEFAULT_PASS = "admin123";

// 3 Default Authorized Admins from your auth.js
const AUTHORIZED_ADMINS = {
  "arjun.mehta@clientpilot.com": { name: "Arjun Mehta", title: "Executive Director" },
  "kavita.nair@clientpilot.com": { name: "Kavita Nair", title: "Head of Operations" },
  "rohit.verma@clientpilot.com": { name: "Rohit Verma", title: "Lead Systems & Security" }
};

export default function App() {
  // Session State
  const [currentUser, setCurrentUser] = useState(null);

  // Auth View State
  const [activeModuleTab, setActiveModuleTab] = useState('user'); // 'user' or 'admin'
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPass, setSignupPass] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');

  // Dashboard Data State
  const [staffDirectory, setStaffDirectory] = useState([]);
  const [clientAccounts, setClientAccounts] = useState([
    { id: 1, company: 'Apex Core Systems', contact: 'Ananya Rao', stage: 'Proposal', value: '₹7.8L' },
    { id: 2, company: 'FinTech Dynamics', contact: 'Rohan Mehta', stage: 'Negotiation', value: '₹12.4L' },
    { id: 3, company: 'MediCore Health', contact: 'Vikram Nair', stage: 'Contract Sent', value: '₹4.5L' }
  ]);
  const [telemetryLogs, setTelemetryLogs] = useState([
    { time: '11:15:02', text: '[AUTH] Staff login successful: priya.s@clientpilot.com' },
    { time: '10:48:19', text: '[DB_SYNC] Incremental backup completed across ap-south-1 nodes' },
    { time: '09:30:00', text: '[CLEARANCE] Admin session initiated by Arjun Mehta' }
  ]);
  const [activeSubNav, setActiveSubNav] = useState('Overview');
  const [modal, setModal] = useState({ isOpen: false, title: '', body: '' });

  // Initialize data on component load
  useEffect(() => {
    // 1. Check existing session
    const rawSession = localStorage.getItem("cp_current_session");
    if (rawSession) {
      try {
        setCurrentUser(JSON.parse(rawSession));
      } catch (e) {
        localStorage.removeItem("cp_current_session");
      }
    }

    // 2. Initialize staff directory (from your auth.js seed)
    const existingStaff = localStorage.getItem("cp_staff_directory");
    if (!existingStaff) {
      const seedStaff = [
        { name: "Priya Sharma", email: "priya.s@clientpilot.com", pass: "user123", role: "Senior Sales Manager", department: "Client Acquisition" },
        { name: "Aditya Rao", email: "aditya.r@clientpilot.com", pass: "user123", role: "Account Specialist", department: "Customer Success" }
      ];
      localStorage.setItem("cp_staff_directory", JSON.stringify(seedStaff));
      setStaffDirectory(seedStaff);
    } else {
      setStaffDirectory(JSON.parse(existingStaff));
    }
  }, []);

  // Modal Helpers
  const openModal = (title, body) => setModal({ isOpen: true, title, body });
  const closeModal = () => setModal({ isOpen: false, title: '', body: '' });

  // Telemetry helper
  const addTelemetry = (msg) => {
    const time = new Date().toTimeString().split(' ')[0];
    setTelemetryLogs(prev => [{ time, text: msg }, ...prev]);
  };

  // Auth: User Login
  const handleUserLogin = (e) => {
    e.preventDefault();
    const email = loginEmail.trim().toLowerCase();
    setLoginError('');

    if (!email.endsWith(DOMAIN_RESTRICTION)) {
      setLoginError(`Access restricted to ${DOMAIN_RESTRICTION} email addresses.`);
      return;
    }

    const matched = staffDirectory.find(w => w.email === email && w.pass === loginPass);
    if (matched) {
      const session = {
        name: matched.name,
        role: matched.role || "Operations Executive",
        email: matched.email,
        accountType: "Worker"
      };
      localStorage.setItem("cp_current_session", JSON.stringify(session));
      setCurrentUser(session);
      addTelemetry(`[AUTH] Staff login successful: ${email}`);
    } else {
      setLoginError("Invalid staff credentials. Contact your team lead or register.");
    }
  };

  // Auth: User Registration
  const handleUserSignup = (e) => {
    e.preventDefault();
    const email = signupEmail.trim().toLowerCase();
    const name = signupName.trim();
    setSignupError('');
    setSignupSuccess('');

    if (!email.endsWith(DOMAIN_RESTRICTION)) {
      setSignupError(`Registration permitted only via company domain (${DOMAIN_RESTRICTION}).`);
      return;
    }

    if (staffDirectory.some(w => w.email === email)) {
      setSignupError("Employee profile already exists. Please log in.");
      return;
    }

    const newStaff = {
      name: name,
      email: email,
      pass: signupPass,
      role: "Operations Associate",
      department: "Client Services"
    };

    const updated = [...staffDirectory, newStaff];
    localStorage.setItem("cp_staff_directory", JSON.stringify(updated));
    setStaffDirectory(updated);

    setSignupSuccess("Profile registered successfully. You may now log in.");
    setSignupName('');
    setSignupEmail('');
    setSignupPass('');
    addTelemetry(`[SIGNUP] New associate seat registered: ${email}`);
  };

  // Auth: Admin Login
  const handleAdminLogin = (e) => {
    e.preventDefault();
    const email = adminEmail.trim().toLowerCase();
    setAdminError('');

    const admin = AUTHORIZED_ADMINS[email];
    if (admin && adminPass === ADMIN_DEFAULT_PASS) {
      const session = {
        name: admin.name,
        role: admin.title,
        email: email,
        accountType: "Admin"
      };
      localStorage.setItem("cp_current_session", JSON.stringify(session));
      setCurrentUser(session);
      addTelemetry(`[CLEARANCE] Admin session initiated by ${admin.name}`);
    } else {
      setAdminError("Unauthorized admin access or invalid security key.");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("cp_current_session");
    setCurrentUser(null);
    setLoginEmail('');
    setLoginPass('');
    setAdminEmail('');
    setAdminPass('');
  };

  // Fast autofill for Admin
  const quickFillAdmin = (email) => {
    setAdminEmail(email);
    setAdminPass(ADMIN_DEFAULT_PASS);
    setAdminError('');
  };

  // Staff Termination (Admin Function)
  const terminateStaff = (index) => {
    const updated = [...staffDirectory];
    const removed = updated.splice(index, 1)[0];
    localStorage.setItem("cp_staff_directory", JSON.stringify(updated));
    setStaffDirectory(updated);
    addTelemetry(`[CLEARANCE_REVOKED] Staff profile revoked: ${removed.email}`);
    openModal("Access Revoked", `Successfully deactivated account and revoked domain access for ${removed.name} (${removed.email}).`);
  };

  // Add Staff (Admin Function)
  const addNewEmployeeModal = () => {
    const name = prompt("Enter Staff Full Name:");
    if (!name || !name.trim()) return;
    const email = prompt("Enter Corporate Email (@clientpilot.com):");
    if (!email || !email.trim()) return;
    const role = prompt("Enter Assigned Role:", "Operations Specialist");
    const dept = prompt("Enter Department:", "Client Services");

    const newStaff = {
      name: name.trim(),
      email: email.trim(),
      pass: "user123",
      role: role ? role.trim() : "Operations Specialist",
      department: dept ? dept.trim() : "Client Services"
    };

    const updated = [...staffDirectory, newStaff];
    localStorage.setItem("cp_staff_directory", JSON.stringify(updated));
    setStaffDirectory(updated);
    addTelemetry(`[PROVISION] New staff seat assigned to ${email.trim()}`);
    openModal("Staff Provisioned", `Created authorized workspace seat for ${name.trim()} with default password: user123`);
  };

  // Add Deal (User Function)
  const openNewDealModal = () => {
    const company = prompt("Enter Client Enterprise Name:");
    if (!company || !company.trim()) return;
    const val = prompt("Enter Estimated Value (e.g. 5.0):", "5.0");
    if (!val || !val.trim()) return;

    const newDeal = {
      id: Date.now(),
      company: company.trim(),
      contact: "Primary Lead",
      stage: "Inbound",
      value: `₹${val.trim()}L`
    };

    setClientAccounts([newDeal, ...clientAccounts]);
    openModal("Opportunity Logged", `Added ${company.trim()} to active pipeline valued at ₹${val.trim()}L.`);
  };

  // Helper actions
  const logCallFor = (client) => {
    const note = prompt(`Enter call notes for ${client}:`);
    if (note && note.trim()) {
      openModal("Call Registered", `Logged call for ${client}:\n"${note.trim()}"\n\nDaily target updated.`);
    }
  };

  // Check role
  const isAdmin = currentUser && (
    currentUser.accountType === "Admin" ||
    currentUser.role === "Administrator" ||
    currentUser.role === "Executive Director" ||
    currentUser.role === "Head of Operations" ||
    currentUser.role === "Lead Systems & Security"
  );

  // =========================================================================
  // VIEW 1: AUTHENTICATION (index.html)
  // =========================================================================
  if (!currentUser) {
    return (
      <div className="auth-page-wrapper">
        <main className="main-box">
          <section className="left-panel">
            <div>
              <span className="badge">CRM WORKSPACE</span>
              <h1 className="title">Client<br />Pilot</h1>
              <p className="subtitle">Enterprise operations CRM with role-based access control, pipeline tracking, and internal audit telemetry.</p>
            </div>
            <div className="footer-tag">Domain Perimeter: <b>@clientpilot.com</b></div>
          </section>

          <section className="right-panel">
            <div className="module-switcher">
              <button
                type="button"
                className={`module-tab-btn ${activeModuleTab === 'user' ? 'active' : ''}`}
                onClick={() => setActiveModuleTab('user')}
              >
                👤 User / Staff Module
              </button>
              <button
                type="button"
                className={`module-tab-btn ${activeModuleTab === 'admin' ? 'active' : ''}`}
                onClick={() => setActiveModuleTab('admin')}
              >
                🔒 Executive / Admin Module
              </button>
            </div>

            {/* MODULE 1: USER / WORKER */}
            {activeModuleTab === 'user' && (
              <div className="forms-split-layout">
                <div className="form-section">
                  <h3>Team Login</h3>
                  <p>Access your operational workspace</p>
                  <form onSubmit={handleUserLogin}>
                    <div className="input-group">
                      <label>Corporate Email</label>
                      <input
                        type="email"
                        placeholder="priya.s@clientpilot.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label>Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="submit-btn">Enter Workspace</button>
                    {loginError && <div className="error-msg" style={{ display: 'block' }}>{loginError}</div>}
                  </form>
                </div>

                <div className="divider">
                  <div className="divider-line"></div>
                  <span style={{ padding: '5px 0' }}>or</span>
                  <div className="divider-line"></div>
                </div>

                <div className="form-section">
                  <h3>Join the Team</h3>
                  <p>Register an authorized seat</p>
                  <form onSubmit={handleUserSignup}>
                    <div className="input-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        placeholder="Aditya Rao"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label>Corporate Email</label>
                      <input
                        type="email"
                        placeholder="aditya.r@clientpilot.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label>Set Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={signupPass}
                        onChange={(e) => setSignupPass(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="submit-btn dark">Create Account</button>
                    {signupError && <div className="error-msg" style={{ display: 'block' }}>{signupError}</div>}
                    {signupSuccess && <div className="success-msg" style={{ display: 'block' }}>{signupSuccess}</div>}
                  </form>
                </div>
              </div>
            )}

            {/* MODULE 2: ADMIN / EXECUTIVE */}
            {activeModuleTab === 'admin' && (
              <div className="admin-panel-content">
                <div className="form-section">
                  <h3>Administrator Gateway</h3>
                  <p>Executive management, audit logs, and directory controls</p>

                  <div className="quick-select-box">
                    <div className="quick-title">Quick Select Authorized Admin:</div>
                    <div className="fast-btn-group">
                      <button type="button" className="fast-chip" onClick={() => quickFillAdmin('arjun.mehta@clientpilot.com')}>Arjun (Dir)</button>
                      <button type="button" className="fast-chip" onClick={() => quickFillAdmin('kavita.nair@clientpilot.com')}>Kavita (Ops)</button>
                      <button type="button" className="fast-chip" onClick={() => quickFillAdmin('rohit.verma@clientpilot.com')}>Rohit (Sec)</button>
                    </div>
                  </div>

                  <form onSubmit={handleAdminLogin}>
                    <div className="input-group">
                      <label>Admin Corporate Email</label>
                      <input
                        type="email"
                        placeholder="arjun.mehta@clientpilot.com"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label>Security Passkey</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={adminPass}
                        onChange={(e) => setAdminPass(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="submit-btn dark">Authenticate Clearance</button>
                    {adminError && <div className="error-msg" style={{ display: 'block' }}>{adminError}</div>}
                  </form>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: HORIZONTAL CONSOLE DASHBOARD (dashboard_2.html)
  // =========================================================================
  return (
    <div className={`dashboard-app ${isAdmin ? 'theme-admin' : 'theme-user'}`}>
      {/* Top Header */}
      <header className="console-header">
        <div className="header-left">
          <div className="brand" onClick={() => openModal('ClientPilot Platform', 'Enterprise Client Operations Platform v2.4\nCluster: ap-south-1')}>
            <div className="brand-logo">CP</div>
            <div className="brand-text">
              <span className="brand-title">ClientPilot</span>
              <span className="brand-edition">{isAdmin ? 'EXECUTIVE CONSOLE' : 'STAFF CRM'}</span>
            </div>
          </div>

          <div className="role-badge">
            <span className="dot"></span>
            <span>{isAdmin ? 'ADMIN ROOT CLEARANCE' : 'STAFF WORKBENCH'}</span>
          </div>
        </div>

        <div className="header-center">
          <div className="console-search">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Search accounts, transactions, logs..." onKeyDown={(e) => {
              if (e.key === 'Enter') openModal('Search Results', `Query matched 4 accounts in ap-south-1.`);
            }} />
            <button type="button" className="search-btn" onClick={() => openModal('Search Results', `Found matching database records in current workspace.`)}>Search</button>
          </div>
        </div>

        <div className="header-right">
          <div className="region-pill">Region: <b>ap-south-1</b></div>
          <div className="user-pill" onClick={() => openModal('User Session', `User: ${currentUser.name}\nEmail: ${currentUser.email}\nRole: ${currentUser.role}`)}>
            <div className="user-avatar">{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}</div>
            <div className="user-meta">
              <div className="user-name">{currentUser.name || 'User'}</div>
              <div className="user-role">{currentUser.role || 'Authorized Session'}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
        </div>
      </header>

      {/* Horizontal Sub-Navbar */}
      <nav className="sub-navbar">
        <div className="sub-nav-links">
          {isAdmin ? (
            <>
              <button className={`sub-nav-item ${activeSubNav === 'Overview' ? 'active' : ''}`} onClick={() => setActiveSubNav('Overview')}>▦ Executive Overview</button>
              <button className={`sub-nav-item ${activeSubNav === 'Staff' ? 'active' : ''}`} onClick={() => openModal('Staff Master Directory', `Active Personnel: ${staffDirectory.length} seats.\n\n` + staffDirectory.map(s => `• ${s.name} (${s.email}) — ${s.role}`).join('\n'))}>♟ Staff Master Control</button>
              <button className={`sub-nav-item ${activeSubNav === 'Telemetry' ? 'active' : ''}`} onClick={() => openModal('Security Telemetry Logs', 'All session authentications, write-back commits, and clearance changes are audited in real time.')}>↗ Root Audit Telemetry</button>
              <button className={`sub-nav-item ${activeSubNav === 'DB' ? 'active' : ''}`} onClick={() => openModal('Database Infrastructure', 'Cluster: Healthy\nReplica Count: 3\nLatency: 14ms\nStorage Node: localStorage active')}>⚙ Database Infrastructure</button>
            </>
          ) : (
            <>
              <button className={`sub-nav-item ${activeSubNav === 'Overview' ? 'active' : ''}`} onClick={() => setActiveSubNav('Overview')}>▦ My Workspace</button>
              <button className={`sub-nav-item ${activeSubNav === 'Accounts' ? 'active' : ''}`} onClick={() => openModal('Assigned Accounts', '• Apex Core Systems — Tech Proposal Under Review\n• FinTech Dynamics — Commercial Negotiation\n• MediCore Health — Execution Pending\n• GlobalTech Infra — Discovery Call Scheduled')}>♙ My Client Accounts</button>
              <button className={`sub-nav-item ${activeSubNav === 'Pipeline' ? 'active' : ''}`} onClick={openNewDealModal}>◆ Active Pipeline</button>
              <button className={`sub-nav-item ${activeSubNav === 'Schedule' ? 'active' : ''}`} onClick={() => openModal("Today's Schedule", "• 11:30 AM — TechNova RFP Discussion\n• 02:30 PM — FinTech Dynamics Demonstration\n• 04:45 PM — Commercial Follow-ups with Apex Core")}>◷ My Schedule</button>
            </>
          )}
        </div>
        <div className="sub-nav-meta">● Systems Operational</div>
      </nav>

      {/* Main Viewport */}
      <main className="console-viewport">
        {/* ======================================= */}
        {/* VIEW A: USER / STAFF CONSOLE            */}
        {/* ======================================= */}
        {!isAdmin && (
          <div>
            <div className="banner user-banner">
              <div>
                <span className="banner-pill">STAFF SEAT</span>
                <h2>Good day, {currentUser.name ? currentUser.name.split(' ')[0] : 'Staff Member'}</h2>
                <p>Operational CRM: Manage your customer pipeline, record outreach, and log calls.</p>
              </div>
              <button className="primary-btn" onClick={openNewDealModal}>+ Log New Deal</button>
            </div>

            <section className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-label">My Active Deals</div>
                <div className="kpi-value">{clientAccounts.length}</div>
                <div className="kpi-sub">5 proposals pending signature</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Calls Completed Today</div>
                <div className="kpi-value">18 / 25</div>
                <div className="kpi-sub positive">72% of daily quota</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Personal Pipeline</div>
                <div className="kpi-value">₹24.6L</div>
                <div className="kpi-sub">₹9.2L expected this month</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Follow-up SLA</div>
                <div className="kpi-value">100%</div>
                <div className="kpi-sub positive">0 tickets overdue</div>
              </div>
            </section>

            <div className="dashboard-grid">
              <div className="grid-col">
                <div className="card">
                  <div className="card-header">
                    <h3>My Assigned Client Accounts</h3>
                    <button className="link-btn" onClick={() => openModal('Full Client Roster', 'All 4 enterprise accounts synchronized with ap-south-1 nodes.')}>View Full Roster →</button>
                  </div>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Client / Enterprise</th>
                        <th>Contact</th>
                        <th>Stage</th>
                        <th>Value</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientAccounts.map(account => (
                        <tr key={account.id}>
                          <td><b>{account.company}</b></td>
                          <td>{account.contact}</td>
                          <td>
                            <span className={`tag ${account.stage === 'Proposal' ? 'tag-blue' : account.stage === 'Negotiation' ? 'tag-orange' : 'tag-green'}`}>
                              {account.stage}
                            </span>
                          </td>
                          <td>{account.value}</td>
                          <td><button className="table-action-btn" onClick={() => logCallFor(account.company)}>Call</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3>Pipeline Progress Visualizer</h3>
                  </div>
                  <div className="chart-flex">
                    <div className="bar-unit"><div className="bar" style={{ height: '85%' }}></div><span>Leads (28)</span></div>
                    <div className="bar-unit"><div className="bar" style={{ height: '60%' }}></div><span>Contacted (19)</span></div>
                    <div className="bar-unit"><div className="bar" style={{ height: '45%' }}></div><span>Proposal (14)</span></div>
                    <div className="bar-unit"><div className="bar green-bar" style={{ height: '30%' }}></div><span>Closed (8)</span></div>
                  </div>
                </div>
              </div>

              <div className="grid-col side-col">
                <div className="card">
                  <div className="card-header">
                    <h3>Quick Actions</h3>
                  </div>
                  <div className="tool-buttons">
                    <button className="tool-btn" onClick={() => logCallFor('Direct Account')}>📞 Log Client Call</button>
                    <button className="tool-btn" onClick={() => {
                      const note = prompt('Enter meeting note:');
                      if (note) openModal('Meeting Note Saved', `Saved:\n"${note.trim()}"`);
                    }}>📝 Record Meeting Note</button>
                    <button className="tool-btn" onClick={openNewDealModal}>💼 Add Opportunity</button>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3>Today's Outreach Schedule</h3>
                  </div>
                  <ul className="task-list">
                    <li><span className="task-time">11:30 AM</span><div><b>TechNova Review</b> — Call procurement team</div></li>
                    <li><span className="task-time">02:30 PM</span><div><b>FinTech Demo</b> — Architecture walkthrough</div></li>
                    <li><span className="task-time">04:45 PM</span><div><b>Apex Follow-up</b> — Check draft sign-off</div></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* VIEW B: ADMIN / EXECUTIVE CONSOLE       */}
        {/* ======================================= */}
        {isAdmin && (
          <div>
            <div className="banner admin-banner">
              <div>
                <span className="banner-pill admin-pill">ROOT EXECUTIVE CLEARANCE</span>
                <h2>Admin Governance Console: {currentUser.name || 'Administrator'}</h2>
                <p>Organizational oversight: Employee master control, enterprise revenue metrics, and security audit telemetry.</p>
              </div>
              <button className="admin-primary-btn" onClick={addNewEmployeeModal}>+ Provision New Staff Account</button>
            </div>

            <section className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-label">Annual Run Rate (ARR)</div>
                <div className="kpi-value">₹1.84 Cr</div>
                <div className="kpi-sub positive">↑ 22.4% year-over-year</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Authorized Staff Seats</div>
                <div className="kpi-value">{staffDirectory.length} Active</div>
                <div className="kpi-sub">Across Sales & Support Depts</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">System Security Status</div>
                <div className="kpi-value text-green">Optimal</div>
                <div className="kpi-sub">0 unauthorized intrusion attempts</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Database Storage Nodes</div>
                <div className="kpi-value">4 / 4 Online</div>
                <div className="kpi-sub">Latency: 14ms (ap-south-1)</div>
              </div>
            </section>

            <div className="dashboard-grid">
              <div className="grid-col">
                <div className="card">
                  <div className="card-header">
                    <div>
                      <h3>Staff Directory Management</h3>
                      <p className="card-sub">Manage corporate clearance, departments, and credentials</p>
                    </div>
                    <button className="admin-primary-btn small" onClick={addNewEmployeeModal}>+ Add Staff</button>
                  </div>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Staff Member</th>
                        <th>Email Address</th>
                        <th>Department</th>
                        <th>Access Clearance</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staffDirectory.map((member, index) => (
                        <tr key={index}>
                          <td><b>{member.name}</b></td>
                          <td>{member.email}</td>
                          <td>{member.department || "Operations"}</td>
                          <td><span className="tag tag-admin">{member.role || "Associate"}</span></td>
                          <td><button className="table-action-btn danger" onClick={() => terminateStaff(index)}>Revoke</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3>Enterprise Department Allocations</h3>
                  </div>
                  <div className="dept-summary-row">
                    <div className="dept-box">
                      <span className="dept-name">Client Acquisition</span>
                      <span className="dept-stat">6 Members • ₹84L Pipeline</span>
                    </div>
                    <div className="dept-box">
                      <span className="dept-name">Customer Success</span>
                      <span className="dept-stat">4 Members • 98% Health</span>
                    </div>
                    <div className="dept-box">
                      <span className="dept-name">Security & Infra</span>
                      <span className="dept-stat">2 Members • Zero Downtime</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid-col side-col">
                <div className="card">
                  <div className="card-header">
                    <h3>Root Telemetry & Audit Stream</h3>
                    <button className="link-btn" onClick={() => setTelemetryLogs([])}>Clear</button>
                  </div>
                  <div className="telemetry-feed">
                    {telemetryLogs.map((log, i) => (
                      <div className="log-item" key={i}>
                        <span className="log-time">{log.time}</span>
                        <div>{log.text}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3>Executive Controls</h3>
                  </div>
                  <div className="tool-buttons">
                    <button className="tool-btn" onClick={() => openModal('Audit Telemetry Export', 'Generated SHA-256 encrypted access logs for current fiscal quarter. Ready for compliance download.')}>📑 Download Audit Report</button>
                    <button className="tool-btn" onClick={() => {
                      addTelemetry('[DB_BACKUP] Manual sync completed across nodes in ap-south-1');
                      openModal('Database Snapshot', 'Synchronized LocalStorage state across redundant replica buckets. 0 errors detected.');
                    }}>💾 Trigger Manual DB Backup</button>
                    <button className="tool-btn danger" onClick={() => {
                      if (window.confirm("Reset local mock data back to defaults?")) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}>⚠️ Reset Workspace Demo Data</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal Dialog */}
      {modal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h4>{modal.title}</h4>
              <button className="close-x" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">{modal.body}</div>
            <div className="modal-footer">
              <button className="primary-btn" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
