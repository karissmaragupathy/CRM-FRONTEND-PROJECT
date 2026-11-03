import React, { useState, useEffect } from 'react';
import './App.css';

const COMPANY_DOMAIN = "@clientpilot.com";

// Authorized leadership directors
const LEADERSHIP_ACCOUNTS = {
  "arjun.mehta@clientpilot.com": { name: "Arjun Mehta", role: "Executive Director", pass: "Arjun@Corp2026" },
  "kavita.nair@clientpilot.com": { name: "Kavita Nair", role: "Head of Operations", pass: "Kavita@Corp2026" },
  "rohit.verma@clientpilot.com": { name: "Rohit Verma", role: "Lead Systems Architect", pass: "Rohit@Corp2026" }
};

export default function App() {
  // Session State
  const [currentUser, setCurrentUser] = useState(null);
  const [authView, setAuthView] = useState('login'); // 'login' | 'register' | 'admin'

  // Input states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginErr, setLoginErr] = useState('');

  const [regName, setRegName] = useState('');
  const [regHandle, setRegHandle] = useState(''); // e.g. "priya.sharma"
  const [regPass, setRegPass] = useState('');
  const [regDept, setRegDept] = useState('Software Engineering');
  const [regErr, setRegErr] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminErr, setAdminErr] = useState('');

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('projects');

  // Practical Company Data Sets
  const [projects, setProjects] = useState([]);
  const [staffDirectory, setStaffDirectory] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Project form states
  const [newClient, setNewClient] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [newLead, setNewLead] = useState('');
  const [newStatus, setNewStatus] = useState('In Progress');

  // 1. Load or Seed Real Company Data
  useEffect(() => {
    // Session restoration
    const savedSession = localStorage.getItem("cp_corp_session");
    if (savedSession) {
      try { setCurrentUser(JSON.parse(savedSession)); } catch (e) { localStorage.removeItem("cp_corp_session"); }
    }

    // Projects directory
    const savedProjects = localStorage.getItem("cp_projects_data");
    if (!savedProjects) {
      const initialProjects = [
        { id: 1, client: "Apex Financial", title: "Core Banking API Gateway", budget: "₹18.5L", progress: 75, lead: "Priya Sharma", status: "In Progress", deadline: "Dec 2026" },
        { id: 2, client: "MediCore Healthcare", title: "HL7 Data Pipeline Migration", budget: "₹14.2L", progress: 90, lead: "Aditya Rao", status: "Testing & QA", deadline: "Nov 2026" },
        { id: 3, client: "Logix Supply Chain", title: "Real-time Fleet Telemetry", budget: "₹22.0L", progress: 40, lead: "Sneha Patel", status: "Sprint 2", deadline: "Jan 2027" }
      ];
      localStorage.setItem("cp_projects_data", JSON.stringify(initialProjects));
      setProjects(initialProjects);
    } else {
      setProjects(JSON.parse(savedProjects));
    }

    // Staff directory
    const savedStaff = localStorage.getItem("cp_staff_directory");
    if (!savedStaff) {
      const initialStaff = [
        { name: "Priya Sharma", email: "priya.sharma@clientpilot.com", role: "Tech Lead", department: "Software Engineering", pass: "Priya#Secure2026" },
        { name: "Aditya Rao", email: "aditya.rao@clientpilot.com", role: "Systems Engineer", department: "Cloud Infrastructure", pass: "Aditya#Secure2026" },
        { name: "Sneha Patel", email: "sneha.patel@clientpilot.com", role: "Frontend Architect", department: "Product Design", pass: "Sneha#Secure2026" }
      ];
      localStorage.setItem("cp_staff_directory", JSON.stringify(initialStaff));
      setStaffDirectory(initialStaff);
    } else {
      setStaffDirectory(JSON.parse(savedStaff));
    }

    // Audit trail
    setAuditLogs([
      { time: "09:15:20", actor: "System Daemon", action: "Production DB replica sync completed (ap-south-1)" },
      { time: "09:42:10", actor: "Arjun Mehta", action: "Quarterly sprint targets approved for Apex Financial" },
      { time: "10:04:55", actor: "Priya Sharma", action: "Milestone v1.4 pushed for Core Banking API" }
    ]);
  }, []);

  const addLog = (actor, action) => {
    const time = new Date().toTimeString().split(' ')[0];
    setAuditLogs(prev => [{ time, actor, action }, ...prev]);
  };

  // Staff Login
  const handleStaffLogin = (e) => {
    e.preventDefault();
    setLoginErr('');
    const email = loginEmail.trim().toLowerCase();

    if (!email.endsWith(COMPANY_DOMAIN)) {
      setLoginErr(`Authentication restricted to verified ${COMPANY_DOMAIN} addresses.`);
      return;
    }

    const employee = staffDirectory.find(s => s.email === email && s.pass === loginPass);
    if (employee) {
      const session = { name: employee.name, email: employee.email, role: employee.role, department: employee.department, clearance: 'Staff' };
      localStorage.setItem("cp_corp_session", JSON.stringify(session));
      setCurrentUser(session);
      setActiveTab('projects');
      addLog(employee.name, "Authenticated to Staff Workspace");
    } else {
      setLoginErr("Incorrect corporate email or password. Verify credentials.");
    }
  };

  // Staff Registration (User supplies handle, auto-binds @clientpilot.com)
  const handleStaffRegister = (e) => {
    e.preventDefault();
    setRegErr('');
    setRegSuccess('');

    const cleanHandle = regHandle.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
    if (!cleanHandle) {
      setRegErr("Please enter a valid corporate username handle.");
      return;
    }

    const fullEmail = `${cleanHandle}${COMPANY_DOMAIN}`;
    if (staffDirectory.some(s => s.email === fullEmail)) {
      setRegErr(`Account ${fullEmail} is already active.`);
      return;
    }

    if (regPass.length < 6) {
      setRegErr("Password must be at least 6 characters long.");
      return;
    }

    const newEmployee = {
      name: regName.trim(),
      email: fullEmail,
      pass: regPass,
      role: "Associate Engineer",
      department: regDept
    };

    const updated = [...staffDirectory, newEmployee];
    setStaffDirectory(updated);
    localStorage.setItem("cp_staff_directory", JSON.stringify(updated));
    setRegSuccess(`Account provisioned! Log in using ${fullEmail}`);
    setRegName(''); setRegHandle(''); setRegPass('');
    addLog(newEmployee.name, `New corporate profile registered (${fullEmail})`);
  };

  // Leadership Admin Login
  const handleAdminLogin = (e) => {
    e.preventDefault();
    setAdminErr('');
    const email = adminEmail.trim().toLowerCase();

    const admin = LEADERSHIP_ACCOUNTS[email];
    if (admin && admin.pass === adminPass) {
      const session = { name: admin.name, email, role: admin.role, department: "Executive Leadership", clearance: 'Admin' };
      localStorage.setItem("cp_corp_session", JSON.stringify(session));
      setCurrentUser(session);
      setActiveTab('projects');
      addLog(admin.name, "Executive root clearance verified");
    } else {
      setAdminErr("Invalid security key or non-registered executive handle.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("cp_corp_session");
    setCurrentUser(null);
    setActiveTab('projects');
  };

  // Add Project Deliverable
  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newClient.trim() || !newProjectName.trim()) return;

    const newItem = {
      id: Date.now(),
      client: newClient.trim(),
      title: newProjectName.trim(),
      budget: `₹${newBudget.trim() || '10.0'}L`,
      progress: 10,
      lead: newLead.trim() || currentUser.name,
      status: newStatus,
      deadline: "Q1 2027"
    };

    const updated = [newItem, ...projects];
    setProjects(updated);
    localStorage.setItem("cp_projects_data", JSON.stringify(updated));
    addLog(currentUser.name, `Initiated new deliverable: ${newItem.title} for ${newItem.client}`);
    setNewClient(''); setNewProjectName(''); setNewBudget(''); setNewLead('');
  };

  const handleUpdateProgress = (id) => {
    const updated = projects.map(p => {
      if (p.id === id) {
        const next = p.progress >= 100 ? 100 : p.progress + 15;
        return { ...p, progress: next, status: next === 100 ? "Completed & Deployed" : p.status };
      }
      return p;
    });
    setProjects(updated);
    localStorage.setItem("cp_projects_data", JSON.stringify(updated));
    addLog(currentUser.name, `Pushed sprint progress on Project #${id}`);
  };

  const handleDeleteProject = (id) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem("cp_projects_data", JSON.stringify(updated));
    addLog(currentUser.name, `Archived deliverable #${id}`);
  };

  const isAdmin = currentUser && currentUser.clearance === 'Admin';

  // ========================================================
  // 1. AUTHENTICATION PORTAL
  // ========================================================
  if (!currentUser) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-sidebar">
            <div>
              <span className="auth-badge">CORPORATE SUITE</span>
              <h1>Client<br />Pilot</h1>
              <p>Secure client account deliveries, sprint tracking, and role-governed workforce operations.</p>
            </div>
            <div className="auth-domain-tag">
              Network Domain: <b>@clientpilot.com</b>
            </div>
          </div>

          <div className="auth-main">
            <div className="auth-tabs">
              <button
                type="button"
                className={`auth-tab-btn ${authView === 'login' ? 'active' : ''}`}
                onClick={() => setAuthView('login')}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${authView === 'register' ? 'active' : ''}`}
                onClick={() => setAuthView('register')}
              >
                New Employee Register
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${authView === 'admin' ? 'active' : ''}`}
                onClick={() => setAuthView('admin')}
              >
                Executive Access
              </button>
            </div>

            {/* View A: Staff Sign In */}
            {authView === 'login' && (
              <form onSubmit={handleStaffLogin} style={{ maxWidth: '380px', margin: '0 auto' }}>
                <h3 style={{ marginBottom: '4px' }}>Employee Login</h3>
                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>Sign in with your verified company email</p>

                <div className="form-group">
                  <label>Company Email</label>
                  <input
                    type="email"
                    placeholder="priya.sharma@clientpilot.com"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={loginPass}
                    onChange={e => setLoginPass(e.target.value)}
                    required
                  />
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Default staff test pass: <code>Priya#Secure2026</code></span>
                </div>
                <button type="submit" className="btn-primary">Authenticate Session</button>
                {loginErr && <div className="msg-error">{loginErr}</div>}
              </form>
            )}

            {/* View B: New Staff Onboarding */}
            {authView === 'register' && (
              <form onSubmit={handleStaffRegister} style={{ maxWidth: '380px', margin: '0 auto' }}>
                <h3 style={{ marginBottom: '4px' }}>Employee Provisioning</h3>
                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>Create your company credentials</p>

                <div className="form-group">
                  <label>Full Legal Name</label>
                  <input
                    type="text"
                    placeholder="Kavya Ragupathy"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Corporate Username</label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="kavya.r"
                      value={regHandle}
                      onChange={e => setRegHandle(e.target.value)}
                      required
                      style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                    />
                    <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderLeft: 0, padding: '9px 12px', fontSize: '12px', fontWeight: '700', color: '#475569', borderRadius: '0 6px 6px 0' }}>
                      @clientpilot.com
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <select value={regDept} onChange={e => setRegDept(e.target.value)}>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                    <option value="Product Architecture">Product Architecture</option>
                    <option value="Client Success">Client Success</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Set Secure Password</label>
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={regPass}
                    onChange={e => setRegPass(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary btn-dark">Register Employee Account</button>
                {regErr && <div className="msg-error">{regErr}</div>}
                {regSuccess && <div className="msg-success">{regSuccess}</div>}
              </form>
            )}

            {/* View C: Leadership Gateway */}
            {authView === 'admin' && (
              <div style={{ maxWidth: '380px', margin: '0 auto' }}>
                <div className="quick-admins">
                  <p>Authorized Corporate Directors:</p>
                  <div className="chips">
                    <button type="button" className="chip-btn" onClick={() => { setAdminEmail("arjun.mehta@clientpilot.com"); setAdminPass("Arjun@Corp2026"); }}>Arjun (Director)</button>
                    <button type="button" className="chip-btn" onClick={() => { setAdminEmail("kavita.nair@clientpilot.com"); setAdminPass("Kavita@Corp2026"); }}>Kavita (Ops)</button>
                    <button type="button" className="chip-btn" onClick={() => { setAdminEmail("rohit.verma@clientpilot.com"); setAdminPass("Rohit@Corp2026"); }}>Rohit (Architect)</button>
                  </div>
                </div>

                <form onSubmit={handleAdminLogin}>
                  <div className="form-group">
                    <label>Director Email</label>
                    <input
                      type="email"
                      placeholder="arjun.mehta@clientpilot.com"
                      value={adminEmail}
                      onChange={e => setAdminEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Security Key</label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={adminPass}
                      onChange={e => setAdminPass(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary btn-dark">Authenticate Executive Clearance</button>
                  {adminErr && <div className="msg-error">{adminErr}</div>}
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // 2. MAIN LOGGED-IN WORKSPACE
  // ========================================================
  return (
    <div>
      {/* Top Corporate Nav */}
      <header className="topbar">
        <div className="topbar-left">
          <div className="brand-badge">
            <div className="brand-icon">CP</div>
            <span className="brand-title">ClientPilot</span>
          </div>
          <span className={`mode-badge ${isAdmin ? 'admin-badge' : 'user-badge'}`}>
            {isAdmin ? 'EXECUTIVE CLEARANCE' : 'ENGINEERING WORKBENCH'}
          </span>
        </div>

        <div className="topbar-right">
          <span className="user-tag">{currentUser.name} • {currentUser.role}</span>
          <button className="btn-logout" onClick={handleLogout}>Sign Out</button>
        </div>
      </header>

      {/* Main Tab Navigation */}
      <nav className="tab-navbar">
        <button
          className={`menu-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          📂 Active Projects & Deliverables ({projects.length})
        </button>
        <button
          className={`menu-tab-btn ${activeTab === 'staff' ? 'active' : ''}`}
          onClick={() => setActiveTab('staff')}
        >
          👥 Engineering Roster ({staffDirectory.length})
        </button>
        <button
          className={`menu-tab-btn ${activeTab === 'telemetry' ? 'active' : ''}`}
          onClick={() => setActiveTab('telemetry')}
        >
          📜 Audit & Release Telemetry ({auditLogs.length})
        </button>
      </nav>

      {/* Workspace Content */}
      <main className="workspace-container">
        {/* ============================================================ */}
        {/* TAB 1: REAL COMPANY PROJECTS & DELIVERABLES                  */}
        {/* ============================================================ */}
        {activeTab === 'projects' && (
          <div>
            <div className={`welcome-banner ${isAdmin ? 'admin-border' : ''}`}>
              <div>
                <h2>{isAdmin ? "Corporate Deliverables & Portfolio Status" : `Welcome back, ${currentUser.name}`}</h2>
                <p>Tracking milestone deliveries, budgets, and engineering sprints across verified client contracts.</p>
              </div>
              <span className="tag-pill tag-green" style={{ fontSize: '13px', padding: '6px 12px' }}>● 100% On Schedule</span>
            </div>

            {/* KPI Cards */}
            <div className="kpi-row">
              <div className="kpi-box">
                <div className="kpi-title">Active Client Contracts</div>
                <div className="kpi-num">{projects.length}</div>
                <div className="kpi-detail">Committed across Q4</div>
              </div>
              <div className="kpi-box">
                <div className="kpi-title">Total Project Value</div>
                <div className="kpi-num">₹54.7L</div>
                <div className="kpi-detail">Tracked in local storage</div>
              </div>
              <div className="kpi-box">
                <div className="kpi-title">Milestone Success Rate</div>
                <div className="kpi-num">94.2%</div>
                <div className="kpi-detail">QA verification passed</div>
              </div>
              <div className="kpi-box">
                <div className="kpi-title">Deployment Region</div>
                <div className="kpi-num">ap-south-1</div>
                <div className="kpi-detail">Zero downtime</div>
              </div>
            </div>

            {/* Form to Add New Practical Project */}
            <div className="card-panel">
              <div className="panel-header">
                <div>
                  <h3>+ Initialize New Client Deliverable</h3>
                  <p className="panel-sub">Assign enterprise contracts to project leads</p>
                </div>
              </div>
              <form onSubmit={handleAddProject} className="inline-form">
                <input
                  type="text"
                  placeholder="Enterprise Client (e.g. HDFC Core)"
                  value={newClient}
                  onChange={e => setNewClient(e.target.value)}
                  required
                  style={{ flex: 1, minWidth: '180px' }}
                />
                <input
                  type="text"
                  placeholder="Project Title (e.g. Cloud Auth Module)"
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
                  required
                  style={{ flex: 1, minWidth: '200px' }}
                />
                <input
                  type="number"
                  step="0.5"
                  placeholder="Budget in Lakhs (₹)"
                  value={newBudget}
                  onChange={e => setNewBudget(e.target.value)}
                  style={{ width: '150px' }}
                />
                <input
                  type="text"
                  placeholder="Project Lead"
                  value={newLead}
                  onChange={e => setNewLead(e.target.value)}
                  style={{ width: '150px' }}
                />
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  <option value="In Progress">In Progress</option>
                  <option value="Testing & QA">Testing & QA</option>
                  <option value="Sprint 1">Sprint 1</option>
                  <option value="Completed">Completed</option>
                </select>
                <button type="submit" className="btn-primary" style={{ width: 'auto' }}>Create Contract</button>
              </form>
            </div>

            {/* Projects Table with Progress Trackers */}
            <div className="card-panel">
              <div className="panel-header">
                <h3>Live Contract Deliverables Roster</h3>
              </div>
              <table className="content-table">
                <thead>
                  <tr>
                    <th>Client Enterprise</th>
                    <th>Deliverable Title</th>
                    <th>Lead Architect</th>
                    <th>Budget</th>
                    <th>Sprint Progress</th>
                    <th>Stage Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(p => (
                    <tr key={p.id}>
                      <td><b>{p.client}</b></td>
                      <td>{p.title}</td>
                      <td>{p.lead}</td>
                      <td><b>{p.budget}</b></td>
                      <td style={{ width: '180px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ flex: 1, background: '#e2e8f0', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                            <div style={{ width: `${p.progress}%`, background: p.progress === 100 ? '#10b981' : '#2563eb', height: '100%' }}></div>
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: '700' }}>{p.progress}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`tag-pill ${p.progress === 100 ? 'tag-green' : p.status.includes('QA') ? 'tag-amber' : 'tag-blue'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn-small" onClick={() => handleUpdateProgress(p.id)}>+ Milestone</button>
                        <button className="btn-small danger" onClick={() => handleDeleteProject(p.id)}>Archive</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: STAFF & ENGINEERING DIRECTORY                         */}
        {/* ============================================================ */}
        {activeTab === 'staff' && (
          <div className="card-panel">
            <div className="panel-header">
              <div>
                <h3>Authorized Corporate Workforce</h3>
                <p className="panel-sub">Verified accounts permitted on `@clientpilot.com` perimeter</p>
              </div>
              <span className="tag-pill tag-blue">{staffDirectory.length} Active Accounts</span>
            </div>
            <table className="content-table">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Corporate Email</th>
                  <th>Department</th>
                  <th>Engineering Role</th>
                  <th>Perimeter Status</th>
                </tr>
              </thead>
              <tbody>
                {staffDirectory.map((member, i) => (
                  <tr key={i}>
                    <td><b>{member.name}</b></td>
                    <td><code>{member.email}</code></td>
                    <td>{member.department}</td>
                    <td><span className="tag-pill tag-amber">{member.role}</span></td>
                    <td><span className="tag-pill tag-green">Verified Active</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: AUDIT & RELEASE TELEMETRY                             */}
        {/* ============================================================ */}
        {activeTab === 'telemetry' && (
          <div className="card-panel">
            <div className="panel-header">
              <div>
                <h3>Internal Audit & Release Telemetry</h3>
                <p className="panel-sub">Live timestamped record of authentications, milestone advancements, and contracts</p>
              </div>
              <button className="btn-small" onClick={() => addLog(currentUser.name, "Manual diagnostics probe verified 100% OK")}>+ Run Diagnostic Ping</button>
            </div>
            <div className="terminal-box">
              {auditLogs.map((log, index) => (
                <div className="log-row" key={index}>
                  <span className="log-time">[{log.time}]</span>
                  <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{log.actor}:</span>
                  <span className="log-text">{log.action}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}