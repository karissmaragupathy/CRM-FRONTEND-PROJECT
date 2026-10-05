/* ==========================================================================
   1. SESSION READ & ROLE DETERMINATION
   ========================================================================== */
const rawSession = localStorage.getItem("cp_current_session") || localStorage.getItem("cp_current_user");

// Guard: Redirect to index if not authenticated
if (!rawSession) {
    window.location.href = "index.html";
}

const currentUser = JSON.parse(rawSession);

// Explicit distinction between Admin and Staff
const isAdmin = currentUser.accountType === "Admin" ||
    currentUser.role === "Administrator" ||
    currentUser.role === "Executive Director" ||
    currentUser.role === "Head of Operations" ||
    currentUser.role === "Lead Systems & Security";

/* ==========================================================================
   2. DOM ELEMENT CACHE
   ========================================================================== */
const UI = {
    app: document.querySelector(".dashboard-app"),
    userFullName: document.getElementById("displayUserFullName"),
    userFirstName: document.getElementById("displayUserName"),
    userRole: document.getElementById("displayUserRole"),
    avatarInitial: document.getElementById("avatarInitial"),
    brandRoleSubtitle: document.getElementById("brandRoleSubtitle"),
    roleIndicatorText: document.getElementById("roleIndicatorText"),
    bannerBadge: document.getElementById("bannerBadge"),
    moduleBannerText: document.getElementById("moduleBannerText"),
    pillAccessLevel: document.getElementById("pillAccessLevel"),
    greetingSub: document.getElementById("greetingSub"),
    teamCardTitle: document.getElementById("teamCardTitle"),
    teamCardSubtitle: document.getElementById("teamCardSubtitle"),
    teamPanelTitle: document.getElementById("teamPanelTitle"),
    teamPanelSubtitle: document.getElementById("teamPanelSubtitle"),
    teamContainer: document.getElementById("teamMemberListContainer"),
    modal: document.getElementById("infoModal"),
    modalHeading: document.getElementById("modalHeading"),
    modalContent: document.getElementById("modalContent"),
    summaryDealCount: document.getElementById("summaryDealCount"),
    activeDealsStat: document.getElementById("activeDealsStat")
};

/* ==========================================================================
   3. ROLE BOOTSTRAP (AMAZON ENTERPRISE STYLING)
   ========================================================================== */
function initDashboard() {
    populateUserProfile();

    if (isAdmin) {
        setupAdminConsole();
    } else {
        setupStaffWorkspace();
    }
}

function populateUserProfile() {
    const firstName = currentUser.name ? currentUser.name.split(" ")[0] : "Associate";
    const initial = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U";

    if (UI.userFullName) UI.userFullName.textContent = currentUser.name;
    if (UI.userFirstName) UI.userFirstName.textContent = firstName;
    if (UI.userRole) UI.userRole.textContent = currentUser.role || (isAdmin ? "Executive Lead" : "Operations Specialist");
    if (UI.avatarInitial) UI.avatarInitial.textContent = initial;
}

/**
 * ADMIN CONSOLE MODE: Full governance, audit logs, employee directory management
 */
function setupAdminConsole() {
    if (UI.app) {
        UI.app.classList.remove("staff-mode");
        UI.app.classList.add("admin-mode");
    }

    if (UI.brandRoleSubtitle) UI.brandRoleSubtitle.textContent = "ADMIN CONSOLE";
    if (UI.roleIndicatorText) UI.roleIndicatorText.textContent = "ROOT CLEARANCE (ADMIN)";
    if (UI.bannerBadge) UI.bannerBadge.textContent = "EXECUTIVE CONSOLE";
    if (UI.moduleBannerText) UI.moduleBannerText.textContent = "Full administrative controls active: Personnel Master, Security Audit Trail, and Cross-Platform Telemetry.";
    if (UI.pillAccessLevel) UI.pillAccessLevel.textContent = "Level 5 — Executive Administrator";
    if (UI.greetingSub) UI.greetingSub.textContent = "Executive oversight view. Monitoring organizational throughput and audit streams.";

    if (UI.teamCardTitle) UI.teamCardTitle.textContent = "Staff Master Roster";
    if (UI.teamCardSubtitle) UI.teamCardSubtitle.textContent = "Click to inspect clearance credentials";
    if (UI.teamPanelTitle) UI.teamPanelTitle.textContent = "Personnel Governance Directory";
    if (UI.teamPanelSubtitle) UI.teamPanelSubtitle.textContent = "Click any staff member to view clearance info";

    // Reveal admin-exclusive links and audit entries
    document.querySelectorAll(".admin-only").forEach(el => el.style.display = "");

    renderAdminTeam();
}

/**
 * USER / STAFF WORKSPACE MODE: Operational focus on leads, calls, deals, and accounts
 */
function setupStaffWorkspace() {
    if (UI.app) {
        UI.app.classList.remove("admin-mode");
        UI.app.classList.add("staff-mode");
    }

    if (UI.brandRoleSubtitle) UI.brandRoleSubtitle.textContent = "STAFF WORKSPACE";
    if (UI.roleIndicatorText) UI.roleIndicatorText.textContent = "OPERATIONS SEAT (USER)";
    if (UI.bannerBadge) UI.bannerBadge.textContent = "OPERATIONS SEAT";
    if (UI.moduleBannerText) UI.moduleBannerText.textContent = "Standard Staff Seat: Managing enterprise customer deals, outreach records, and pipeline commitments.";
    if (UI.pillAccessLevel) UI.pillAccessLevel.textContent = "Level 2 — Operations Seat";
    if (UI.greetingSub) UI.greetingSub.textContent = "Operational dashboard active. Track active accounts and pipeline movements.";

    if (UI.teamCardTitle) UI.teamCardTitle.textContent = "Colleagues On Shift";
    if (UI.teamCardSubtitle) UI.teamCardSubtitle.textContent = "Internal operational seats online";
    if (UI.teamPanelTitle) UI.teamPanelTitle.textContent = "Operations Colleague Status";
    if (UI.teamPanelSubtitle) UI.teamPanelSubtitle.textContent = "Internal team members currently assigned";

    // Hide admin controls from standard users
    document.querySelectorAll(".admin-only").forEach(el => el.style.display = "none");

    renderWorkerTeamSummary();
}

/* ==========================================================================
   4. DATA RENDERING
   ========================================================================== */
function getStaffList() {
    const staff = localStorage.getItem("cp_staff_directory") || localStorage.getItem("cp_registered_users");
    return staff ? JSON.parse(staff) : [];
}

function renderAdminTeam() {
    if (!UI.teamContainer) return;
    const staff = getStaffList();

    if (staff.length === 0) {
        UI.teamContainer.innerHTML = `<div style="padding:10px; font-size:11px; color:#545b64;">No personnel registered in local database.</div>`;
        return;
    }

    UI.teamContainer.innerHTML = staff.map(member => {
        const initial = member.name ? member.name.charAt(0).toUpperCase() : "E";
        return `
            <div style="display:flex; align-items:center; justify-content:space-between; padding:8px 0; border-bottom:1px solid #eaeded; cursor:pointer;"
                 onclick="inspectStaffMember('${escapeQuotes(member.name)}', '${escapeQuotes(member.email)}', '${escapeQuotes(member.role || "Operations")}', '${escapeQuotes(member.department || "Client Services")}')">
                <div style="display:flex; align-items:center; gap:8px;">
                    <div style="width:26px; height:26px; background:#232f3e; color:#fff; border-radius:4px; font-size:10px; font-weight:800; display:flex; align-items:center; justify-content:center;">${initial}</div>
                    <div>
                        <div style="font-size:11px; font-weight:700; color:#0073bb;">${member.name}</div>
                        <div style="font-size:9px; color:#545b64;">${member.email}</div>
                    </div>
                </div>
                <div style="font-size:9px; color:#037f4c; font-weight:700;">● Active</div>
            </div>
        `;
    }).join("");
}

function renderWorkerTeamSummary() {
    if (!UI.teamContainer) return;
    const staff = getStaffList();

    UI.teamContainer.innerHTML = `
        <div style="padding:10px; background:#fafbfc; border:1px solid #eaeded; border-radius:6px;">
            <div style="font-size:11px; font-weight:700; color:#16191f; margin-bottom:4px;">Operations Duty Roster</div>
            <div style="font-size:11px; color:#545b64; line-height:1.5;">
                There are currently <strong>${staff.length} team members</strong> assigned to operational accounts. For confidential personnel clearances, contact an authorized executive administrator.
            </div>
        </div>
    `;
}

function inspectStaffMember(name, email, role, dept) {
    openModal(
        `Staff Identity Record: ${name}`,
        `Employee Name: ${name}\nCorporate Email: ${email}\nAssigned Designation: ${role}\nDepartment: ${dept}\nDomain Clearance: @clientpilot.com Verified`
    );
}

/* ==========================================================================
   5. NAVIGATION & MODALS
   ========================================================================== */
function setActiveNav(buttonId) {
    document.querySelectorAll(".sub-nav-item").forEach(item => item.classList.remove("active"));
    const activeBtn = document.getElementById(buttonId);
    if (activeBtn) activeBtn.classList.add("active");
}

function showOverviewNav() {
    setActiveNav("nav-overview");
    if (isAdmin) {
        openModal(
            "Executive Console Home",
            `Identity: ${currentUser.name}\nDesignation: ${currentUser.role}\nAccess Tier: Enterprise Root\nConsole Status: All microservices operational.`
        );
    } else {
        openModal(
            "Staff Workspace Home",
            `Specialist: ${currentUser.name}\nRole: ${currentUser.role || "Operations Specialist"}\nAccess: Operational CRM Records\nLocal Target: ₹42.8 Lakh.`
        );
    }
}

function showContactsNav() {
    setActiveNav("nav-contacts");
    openModal(
        "Client Accounts Master",
        "• Ananya Rao — Apex Core Systems (VP Technology)\n• Rohan Mehta — FinTech Dynamics (Lead Operations)\n• Vikram Nair — MediCore Health (Procurement Specialist)\n• Sunita Verma — GlobalTech Infrastructure (Enterprise Director)"
    );
}

function showDealsNav() {
    setActiveNav("nav-deals");
    const storedDeals = JSON.parse(localStorage.getItem("cp_custom_deals")) || [];
    let report = "Standard Commercial Pipeline:\n• Inbound Leads — ₹12.4L\n• Technical Review — ₹8.6L\n• Proposal Stage — ₹14.2L\n• Closed Won — ₹18.5L\n";
    if (storedDeals.length > 0) {
        report += "\nUser Submitted Deals:\n" + storedDeals.map(d => `• ${d.name} (${d.client}) — ₹${d.value}L`).join("\n");
    }
    openModal("Corporate Deals Pipeline", report);
}

function showScheduleNav() {
    setActiveNav("nav-schedule");
    const schedule = isAdmin
        ? "• 09:30 AM — Executive Council Strategy\n• 01:00 PM — Operations Security Audit\n• 04:30 PM — Enterprise Governance Review"
        : "• 10:30 AM — Client Demo (Room 3)\n• 02:00 PM — Scope Realignment Call\n• 05:00 PM — Daily CRM Entry Reconciliation";
    openModal("Scheduled Operational Tasks", schedule);
}

function showEmployeesNav() {
    if (!isAdmin) {
        openModal("Access Denied", "The Personnel Master Directory requires Executive Clearance.");
        return;
    }
    setActiveNav("nav-employees");
    const staff = getStaffList();
    const list = staff.map(s => `• ${s.name} (${s.email}) — ${s.role || "Operations"}`).join("\n");
    openModal("Executive Personnel Directory", `Registered Count: ${staff.length}\n\n${list}`);
}

function showActivityNav() {
    if (!isAdmin) {
        openModal("Access Denied", "System telemetry audit streams require Executive Clearance.");
        return;
    }
    setActiveNav("nav-activity");
    openModal(
        "System Audit Stream (Root Telemetry)",
        "• 10:15 IST — Staff updated deal stage for Apex Core Systems\n• 11:20 IST — Staff logged client interaction via phone\n• 12:05 IST — Rohit Verma verified database node sync\n• 01:30 IST — Automated session cache refreshed"
    );
}

function handleTeamCardClick() {
    if (isAdmin) {
        showEmployeesNav();
    } else {
        openModal("Colleague Overview", "Active Personnel Status: 8 of 12 internal team members logged into seat.");
    }
}

function handleSearch() {
    const query = document.getElementById("globalSearchInput").value.trim();
    if (!query) return;
    openModal("Console Search Query", `Dispatched search query: "${query}" across client indices and local logs.`);
}

/* ==========================================================================
   6. USER ACTIONS
   ========================================================================== */
function openNewDealModal() {
    const client = prompt("Enter Corporate Client Name:");
    if (!client || !client.trim()) return;
    const val = prompt("Enter Contract Value in Lakhs (₹):", "5.0");
    if (!val || !val.trim()) return;

    const storedDeals = JSON.parse(localStorage.getItem("cp_custom_deals")) || [];
    storedDeals.push({ name: `${client.trim()} Contract`, client: client.trim(), value: val.trim() });
    localStorage.setItem("cp_custom_deals", JSON.stringify(storedDeals));

    const total = 31 + storedDeals.length;
    if (UI.summaryDealCount) UI.summaryDealCount.textContent = total;
    if (UI.activeDealsStat) UI.activeDealsStat.textContent = total;

    openModal("Deal Registered", `Successfully logged ${client.trim()} contract at ₹${val}L.`);
}

function logCall() {
    const note = prompt("Enter client communication record:");
    if (note && note.trim()) openModal("Call Logged", `Interaction saved:\n"${note.trim()}"`);
}

function addNote() {
    const note = prompt("Enter workspace reference note:");
    if (note && note.trim()) openModal("Note Appended", `Saved reference note:\n"${note.trim()}"`);
}

function scheduleFollowUp() {
    openModal("Escalation Dispatched", "Escalation ticket queued and reminder synchronized.");
}

function showClient(name, company, role, health, status) {
    openModal("Account Dossier", `Contact: ${name}\nClient Enterprise: ${company}\nDesignation: ${role}\nRelationship Health: ${health}\nCurrent Status: ${status}`);
}

function showCurrentUser() {
    openModal("Active Session Clearance", `User: ${currentUser.name}\nEmail: ${currentUser.email}\nAssigned Role: ${currentUser.role || "Staff"}\nModule Tier: ${isAdmin ? "Executive Admin Console (Root)" : "Staff Operations Workspace"}`);
}

function openModal(title, text) {
    if (UI.modalHeading) UI.modalHeading.textContent = title;
    if (UI.modalContent) UI.modalContent.textContent = text;
    if (UI.modal) UI.modal.style.display = "flex";
}

function closeModal() {
    if (UI.modal) UI.modal.style.display = "none";
}

function logout() {
    localStorage.removeItem("cp_current_session");
    localStorage.removeItem("cp_current_user");
    window.location.href = "index.html";
}

function escapeQuotes(str) {
    return str ? str.replace(/'/g, "\\'") : "";
}

initDashboard();