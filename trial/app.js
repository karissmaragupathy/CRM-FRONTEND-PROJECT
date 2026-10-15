/* ============================================================
   Keystone CRM — shared app logic
   Everything persists in localStorage. There is no real backend:
   this is a frontend-only project, so "verification" and "auth"
   here are simulated for demo purposes, not production security.
   ============================================================ */

const ALLOWED_DOMAIN = "@keystonecrm.com"; // internal team domain -> auto-approved

const KEYS = {
    users: "kc_users",
    clients: "kc_clients",
    tickets: "kc_tickets",
    session: "kc_session",
};

function uid(prefix) {
    return prefix + "-" + Math.random().toString(36).slice(2, 8);
}

function todayMinus(days) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().slice(0, 10);
}

function formatDate(iso) {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function formatCurrency(n) {
    return "$" + Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 });
}

/* ---------------- seed data ---------------- */

function seed() {
    if (!localStorage.getItem(KEYS.users)) {
        const users = [
            { id: "u-admin", name: "Priya Nair", email: "admin@keystonecrm.com", password: "admin123", company: "Keystone CRM", role: "admin", status: "approved" },
            { id: "u-agent1", name: "Sam Okafor", email: "sam@keystonecrm.com", password: "password", company: "Keystone CRM", role: "agent", status: "approved" },
        ];
        localStorage.setItem(KEYS.users, JSON.stringify(users));
    }

    if (!localStorage.getItem(KEYS.clients)) {
        const clients = [
            {
                id: "c-1", name: "Marlowe Studio", contact: "Ana Marlowe", email: "ana@marlowestudio.com",
                plan: "Growth", mrr: 890, status: "healthy", owner: "Sam Okafor", since: todayMinus(210),
                activity: [
                    { id: uid("a"), date: todayMinus(2), type: "Call", note: "Walked through the new reporting module; positive reaction." },
                    { id: uid("a"), date: todayMinus(14), type: "Email", note: "Sent renewal quote for the annual plan." },
                    { id: uid("a"), date: todayMinus(40), type: "Note", note: "Flagged as a good case study candidate." },
                ],
            },
            {
                id: "c-2", name: "Northwind Logistics", contact: "Deo Fernandes", email: "deo@northwindlog.com",
                plan: "Enterprise", mrr: 2400, status: "at-risk", owner: "Priya Nair", since: todayMinus(430),
                activity: [
                    { id: uid("a"), date: todayMinus(1), type: "Call", note: "Reported slow load times on the dashboard; escalated to support." },
                    { id: uid("a"), date: todayMinus(20), type: "Meeting", note: "Quarterly business review — usage down 18% vs last quarter." },
                ],
            },
            {
                id: "c-3", name: "Hollow & Finch", contact: "Rae Finch", email: "rae@hollowfinch.co",
                plan: "Starter", mrr: 190, status: "healthy", owner: "Sam Okafor", since: todayMinus(60),
                activity: [
                    { id: uid("a"), date: todayMinus(5), type: "Email", note: "Onboarding checklist completed." },
                ],
            },
            {
                id: "c-4", name: "Vantage Retail Co", contact: "Ines Wu", email: "ines@vantageretail.com",
                plan: "Growth", mrr: 890, status: "watch", owner: "Priya Nair", since: todayMinus(300),
                activity: [
                    { id: uid("a"), date: todayMinus(9), type: "Note", note: "Champion left the company; new stakeholder not yet identified." },
                ],
            },
            {
                id: "c-5", name: "Birchgate Legal", contact: "Owen Birch", email: "owen@birchgate.law",
                plan: "Enterprise", mrr: 2400, status: "healthy", owner: "Sam Okafor", since: todayMinus(520),
                activity: [
                    { id: uid("a"), date: todayMinus(3), type: "Call", note: "Confirmed 2-year renewal, verbally agreed on price lock." },
                ],
            },
            {
                id: "c-6", name: "Ember & Oak", contact: "Talia Ember", email: "talia@emberoak.com",
                plan: "Starter", mrr: 190, status: "churned", owner: "Priya Nair", since: todayMinus(150),
                activity: [
                    { id: uid("a"), date: todayMinus(30), type: "Email", note: "Cancellation confirmed — cited budget cuts." },
                ],
            },
        ];
        localStorage.setItem(KEYS.clients, JSON.stringify(clients));
    }

    if (!localStorage.getItem(KEYS.tickets)) {
        const tickets = [
            { id: "t-1", clientId: "c-2", subject: "Dashboard loading slowly on Enterprise plan", status: "open", priority: "high", created: todayMinus(1) },
            { id: "t-2", clientId: "c-1", subject: "Question about API rate limits", status: "in-progress", priority: "medium", created: todayMinus(3) },
            { id: "t-3", clientId: "c-4", subject: "Request to add a new admin seat", status: "open", priority: "low", created: todayMinus(4) },
            { id: "t-4", clientId: "c-5", subject: "Export feature returning malformed CSV", status: "resolved", priority: "medium", created: todayMinus(12) },
            { id: "t-5", clientId: "c-3", subject: "Onboarding walkthrough request", status: "resolved", priority: "low", created: todayMinus(18) },
            { id: "t-6", clientId: "c-2", subject: "SSO login failing intermittently", status: "in-progress", priority: "high", created: todayMinus(6) },
        ];
        localStorage.setItem(KEYS.tickets, JSON.stringify(tickets));
    }
}
seed();

/* ---------------- data access ---------------- */

const getUsers = () => JSON.parse(localStorage.getItem(KEYS.users) || "[]");
const setUsers = (v) => localStorage.setItem(KEYS.users, JSON.stringify(v));
const getClients = () => JSON.parse(localStorage.getItem(KEYS.clients) || "[]");
const setClients = (v) => localStorage.setItem(KEYS.clients, JSON.stringify(v));
const getTickets = () => JSON.parse(localStorage.getItem(KEYS.tickets) || "[]");
const setTickets = (v) => localStorage.setItem(KEYS.tickets, JSON.stringify(v));

/* ---------------- auth ---------------- */

function getSession() {
    return JSON.parse(localStorage.getItem(KEYS.session) || "null");
}
function setSession(user) {
    localStorage.setItem(KEYS.session, JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role }));
}
function clearSession() {
    localStorage.removeItem(KEYS.session);
}

// Call at the top of every protected page. Redirects if not logged in,
// or if the page requires a role the current user doesn't have.
function requireAuth(requiredRole) {
    const session = getSession();
    if (!session) {
        window.location.href = "index.html";
        return null;
    }
    if (requiredRole && session.role !== requiredRole) {
        window.location.href = "dashboard.html";
        return null;
    }
    return session;
}

function signup({ name, email, password, company }) {
    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { ok: false, message: "An account with that email already exists." };
    }
    const autoApproved = email.toLowerCase().endsWith(ALLOWED_DOMAIN);
    const user = {
        id: uid("u"),
        name, email, password, company,
        role: "agent",
        status: autoApproved ? "approved" : "pending",
    };
    users.push(user);
    setUsers(users);
    return { ok: true, autoApproved };
}

function login(email, password) {
    const user = getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.password !== password) return { ok: false, message: "Incorrect email or password." };
    if (user.status === "pending") return { ok: false, message: "This account is still awaiting admin approval." };
    if (user.status === "denied") return { ok: false, message: "This signup request was denied. Contact an admin." };
    setSession(user);
    return { ok: true };
}

/* ---------------- sidebar ---------------- */

function renderShellStart(active, session) {
    const links = [
        ["dashboard.html", "Dashboard"],
        ["clients.html", "Clients"],
        ["tickets.html", "Tickets"],
        ["analytics.html", "Analytics"],
    ];
    if (session.role === "admin") links.push(["admin.html", "Approvals"]);

    const navHtml = links
        .map(([href, label]) => `<a href="${href}" class="${active === href ? "active" : ""}">${label}</a>`)
        .join("");

    return `
  <div class="shell">
    <aside class="sidebar">
      <div class="mark">Keystone CRM</div>
      <nav>${navHtml}</nav>
      <div>
        <div class="who">${session.name} · ${session.role}</div>
        <a href="#" class="signout" onclick="clearSession(); window.location.href='index.html'; return false;">Log out</a>
      </div>
    </aside>
    <main class="main">
  `;
}
const SHELL_END = `</main></div>`;