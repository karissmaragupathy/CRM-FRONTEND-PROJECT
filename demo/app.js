/* ============================================================
   NexaFlow — shared app logic
   This is a frontend-only prototype. There is no real backend,
   so "authentication" and "domain verification" here are
   simulated in JavaScript for demo purposes only. In a real
   production CRM: auth would run on a backend/identity provider,
   passwords would never be stored as plain text, domain checks
   would happen server-side, and sessions/permissions would be
   enforced server-side too. (config.js must be loaded before
   this file — it defines COMPANY_DOMAIN.)
   ============================================================ */

const KEYS = {
    users: "nf_users",
    leads: "nf_leads",
    accounts: "nf_accounts",
    contacts: "nf_contacts",
    deals: "nf_deals",
    activities: "nf_activities",
    session: "nf_session",
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
    return new Date(iso + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function formatCurrency(n) {
    return "$" + Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 });
}

/* ---------------- toast notifications (no alert()) ---------------- */

function toast(message, type) {
    type = type || "info";
    const el = document.createElement("div");
    el.className = "toast " + type;
    el.textContent = message;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => {
        el.classList.remove("show");
        setTimeout(() => el.remove(), 300);
    }, 3800);
}

/* ---------------- email / domain validation ---------------- */

function isValidEmailFormat(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// Proper domain extraction rather than a fragile includes() check.
function getEmailDomain(email) {
    return email.trim().toLowerCase().split("@")[1] || "";
}

function isCompanyEmail(email) {
    return getEmailDomain(email) === COMPANY_DOMAIN;
}

/* ---------------- seed data ---------------- */

function seed() {
    if (!localStorage.getItem(KEYS.users)) {
        setUsers([
            { id: "u-1", name: "Alex Johnson", email: "alex@securestack.com", password: "demo123", department: "Sales", role: "Administrator", status: "approved" },
            { id: "u-2", name: "Priya Shah", email: "priya@securestack.com", password: "demo123", department: "Marketing", role: "Sales Representative", status: "pending" },
            { id: "u-3", name: "Rahul Mehta", email: "rahul@securestack.com", password: "demo123", department: "Sales", role: "Sales Representative", status: "pending" },
        ]);
    }

    if (!localStorage.getItem(KEYS.accounts)) {
        setAccounts([
            { id: "acc-1", name: "Griffin Manufacturing", industry: "Manufacturing", owner: "Alex Johnson", since: todayMinus(300) },
            { id: "acc-2", name: "Palmetto Health Group", industry: "Healthcare", owner: "Rahul Mehta", since: todayMinus(180) },
            { id: "acc-3", name: "Ironclad Freight", industry: "Logistics", owner: "Alex Johnson", since: todayMinus(90) },
        ]);
    }

    if (!localStorage.getItem(KEYS.leads)) {
        setLeads([
            { id: "lead-1", name: "Meredith Cole", company: "Cole & Vance LLP", email: "meredith@colevance.com", status: "new", owner: "Rahul Mehta", created: todayMinus(2) },
            { id: "lead-2", name: "Tom Adeyemi", company: "Bright Path Retail", email: "tom@brightpath.com", status: "contacted", owner: "Alex Johnson", created: todayMinus(6) },
            { id: "lead-3", name: "Sana Iqbal", company: "Iqbal Consulting", email: "sana@iqbalco.com", status: "qualified", owner: "Rahul Mehta", created: todayMinus(11) },
        ]);
    }

    if (!localStorage.getItem(KEYS.contacts)) {
        setContacts([
            { id: "ct-1", name: "Diane Marsh", accountId: "acc-1", title: "IT Director", email: "diane@griffinmfg.com", phone: "555-0110" },
            { id: "ct-2", name: "Wesley Park", accountId: "acc-2", title: "Procurement Lead", email: "wesley@palmettohealth.com", phone: "555-0142" },
            { id: "ct-3", name: "Alicia Nguyen", accountId: "acc-3", title: "Operations Manager", email: "alicia@ironcladfreight.com", phone: "555-0198" },
        ]);
    }

    if (!localStorage.getItem(KEYS.deals)) {
        setDeals([
            { id: "d-1", name: "Griffin — security platform renewal", accountId: "acc-1", stage: "negotiation", value: 42000, owner: "Alex Johnson", closeDate: todayMinus(-14) },
            { id: "d-2", name: "Palmetto — endpoint protection rollout", accountId: "acc-2", stage: "proposal", value: 68000, owner: "Rahul Mehta", closeDate: todayMinus(-30) },
            { id: "d-3", name: "Ironclad — starter package", accountId: "acc-3", stage: "prospecting", value: 15000, owner: "Alex Johnson", closeDate: todayMinus(-45) },
            { id: "d-4", name: "Griffin — add-on seats (closed)", accountId: "acc-1", stage: "won", value: 9000, owner: "Alex Johnson", closeDate: todayMinus(20) },
        ]);
    }

    if (!localStorage.getItem(KEYS.activities)) {
        setActivities([
            { id: "act-1", type: "Call", relatedTo: "Griffin Manufacturing", date: todayMinus(1), notes: "Discussed renewal terms with Diane Marsh.", owner: "Alex Johnson" },
            { id: "act-2", type: "Email", relatedTo: "Palmetto Health Group", date: todayMinus(3), notes: "Sent proposal for endpoint protection rollout.", owner: "Rahul Mehta" },
            { id: "act-3", type: "Meeting", relatedTo: "Ironclad Freight", date: todayMinus(5), notes: "Intro call, walked through the platform overview.", owner: "Alex Johnson" },
        ]);
    }
}

/* ---------------- data access (one pair of functions per store) ---------------- */

const getUsers = () => JSON.parse(localStorage.getItem(KEYS.users) || "[]");
const setUsers = (v) => localStorage.setItem(KEYS.users, JSON.stringify(v));
const getLeads = () => JSON.parse(localStorage.getItem(KEYS.leads) || "[]");
const setLeads = (v) => localStorage.setItem(KEYS.leads, JSON.stringify(v));
const getAccounts = () => JSON.parse(localStorage.getItem(KEYS.accounts) || "[]");
const setAccounts = (v) => localStorage.setItem(KEYS.accounts, JSON.stringify(v));
const getContacts = () => JSON.parse(localStorage.getItem(KEYS.contacts) || "[]");
const setContacts = (v) => localStorage.setItem(KEYS.contacts, JSON.stringify(v));
const getDeals = () => JSON.parse(localStorage.getItem(KEYS.deals) || "[]");
const setDeals = (v) => localStorage.setItem(KEYS.deals, JSON.stringify(v));
const getActivities = () => JSON.parse(localStorage.getItem(KEYS.activities) || "[]");
const setActivities = (v) => localStorage.setItem(KEYS.activities, JSON.stringify(v));

seed();

/* ---------------- session / auth ---------------- */

function getSession() {
    return JSON.parse(localStorage.getItem(KEYS.session) || "null");
}
function setSession(user) {
    localStorage.setItem(KEYS.session, JSON.stringify({
        id: user.id, name: user.name, email: user.email, department: user.department, role: user.role,
    }));
}
function clearSession() {
    localStorage.removeItem(KEYS.session);
}

// Put this at the top of every protected page. No session -> back to login.
function requireAuth() {
    const session = getSession();
    if (!session) {
        window.location.href = "index.html";
        return null;
    }
    return session;
}

// STEP 1-5 login flow, exactly as specified.
function login(email, password) {
    // STEP 1: validate email format
    if (!isValidEmailFormat(email)) {
        return { ok: false, message: "Please enter a valid email address." };
    }
    // STEP 2: validate company domain
    if (!isCompanyEmail(email)) {
        return { ok: false, message: "Invalid SecureStack credentials." };
    }
    // STEP 3: find the user
    const user = getUsers().find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
        return { ok: false, message: "Invalid SecureStack credentials." };
    }
    // STEP 4: check password
    if (user.password !== password) {
        return { ok: false, message: "Invalid SecureStack credentials." };
    }
    // STEP 5: check account status
    if (user.status === "pending") {
        return { ok: false, message: "Your account is awaiting administrator approval." };
    }
    if (user.status === "rejected") {
        return { ok: false, message: "Your access request has been rejected. Please contact your administrator." };
    }
    setSession(user);
    return { ok: true };
}

function requestAccess({ name, email, password, confirmPassword, department, jobRole }) {
    if (!name.trim()) return { ok: false, message: "Full name is required." };
    if (!isValidEmailFormat(email)) return { ok: false, message: "Please enter a valid email address." };
    if (!isCompanyEmail(email)) return { ok: false, message: "Please use your SecureStack company email address." };
    if (getUsers().some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
        return { ok: false, message: "An account with that email already exists." };
    }
    if (password.length < 8 || !/\d/.test(password)) {
        return { ok: false, message: "Password must be at least 8 characters and include a number." };
    }
    if (password !== confirmPassword) return { ok: false, message: "Passwords do not match." };
    if (!department) return { ok: false, message: "Please select a department." };
    if (!jobRole) return { ok: false, message: "Please select a job role." };

    const users = getUsers();
    users.push({
        id: uid("u"),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        department,
        role: jobRole,
        status: "pending", // no backend/email verification -> always goes to admin review
    });
    setUsers(users);
    return { ok: true };
}

/* ---------------- role-based navigation ---------------- */

function renderShellStart(active, session) {
    const links = [
        ["dashboard.html", "Dashboard"],
        ["leads.html", "Leads"],
        ["accounts.html", "Accounts"],
        ["contacts.html", "Contacts"],
        ["deals.html", "Deals"],
        ["activities.html", "Activities"],
        ["reports.html", "Reports"],
    ];
    if (session.role === "Administrator") links.push(["user-access.html", "User Access"]);

    const navHtml = links
        .map(([href, label]) => `<a href="${href}" class="${active === href ? "active" : ""}">${label}</a>`)
        .join("");

    return `
  <div class="shell">
    <aside class="sidebar">
      <div class="mark">NexaFlow</div>
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