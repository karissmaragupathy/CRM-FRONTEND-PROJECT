/* ==========================================================================
   1. SESSION VALIDATION & DATA SYNCHRONIZATION
   Reads session data established during authentication (auth.js).
   Supports backward compatibility with older session key names.
   ========================================================================== */
const rawSession = localStorage.getItem("cp_current_session") || localStorage.getItem("cp_current_user");

// Guard: Redirect immediately if unauthenticated
if (!rawSession) {
    window.location.href = "index.html";
}

const currentUser = JSON.parse(rawSession);

// An account is an Admin if accountType === 'Admin' or has executive roles
const isAdmin = currentUser.accountType === "Admin" ||
    currentUser.role === "Administrator" ||
    currentUser.role === "Executive Director" ||
    currentUser.role === "Head of Operations" ||
    currentUser.role === "Lead Systems & Security";


/* ==========================================================================
   2. DOM ELEMENT CACHE
   Centralizes element lookups to prevent repeated queries and handle null safety.
   ========================================================================== */
const UI = {
    userFullName: document.getElementById("displayUserFullName"),
    userFirstName: document.getElementById("displayUserName"),
    userRole: document.getElementById("displayUserRole"),
    avatarInitial: document.getElementById("avatarInitial"),
    moduleBanner: document.getElementById("moduleTypeBanner"),
    greetingSub: document.getElementById("greetingSub"),
    brandRoleSubtitle: document.getElementById("brandRoleSubtitle"),
    currentModuleLabel: document.getElementById("currentModuleLabel"),
    teamContainer: document.getElementById("teamMemberListContainer"),
    modal: document.getElementById("infoModal"),
    modalHeading: document.getElementById("modalHeading"),
    modalContent: document.getElementById("modalContent"),
    summaryDealCount: document.getElementById("summaryDealCount"),
    activeDealsStat: document.getElementById("activeDealsStat")
};


/* ==========================================================================
   3. ROLE-BASED MODULE BOOTSTRAP
   Renders distinct workspaces for Admin vs. Worker (Sales/Operations).
   ========================================================================== */
function initDashboard() {
    populateUserProfile();

    if (isAdmin) {
        configureAdminModule();
    } else {
        configureWorkerModule();
    }
}

function populateUserProfile() {
    const firstName = currentUser.name ? currentUser.name.split(" ")[0] : "User";
    const initial = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U";

    if (UI.userFullName) UI.userFullName.textContent = currentUser.name;
    if (UI.userFirstName) UI.userFirstName.textContent = firstName;
    if (UI.userRole) UI.userRole.textContent = currentUser.role || (isAdmin ? "Administrator" : "Staff Specialist");
    if (UI.avatarInitial) UI.avatarInitial.textContent = initial;
}

/**
 * ADMIN MODULE
 * Full governance: viewing employee directory, security logs, and team audits.
 */
function configureAdminModule() {
    if (UI.moduleBanner) UI.moduleBanner.textContent = "Executive Management Console (Admin Module)";
    if (UI.greetingSub) UI.greetingSub.textContent = "Full administrative controls: Employee directory, audit logs, and organizational telemetry.";
    if (UI.brandRoleSubtitle) UI.brandRoleSubtitle.textContent = "ADMIN PORTAL";
    if (UI.currentModuleLabel) UI.currentModuleLabel.textContent = "ADMIN CLEARANCE";

    // Display admin-exclusive controls
    document.querySelectorAll(".admin-only").forEach(el => el.style.display = "");
    // Hide worker-only workflows (e.g., individual cold call buttons)
    document.querySelectorAll(".worker-only").forEach(el => el.style.display = "none");

    renderAdminTeam();
}

/**
 * WORKER / EMPLOYEE MODULE
 * Operational workspace: deals, client lists, calls, and daily tasks.
 */
function configureWorkerModule() {
    if (UI.moduleBanner) UI.moduleBanner.textContent = "Operations & Sales Workspace (Staff Module)";
    if (UI.greetingSub) UI.greetingSub.textContent = "Manage assigned enterprise accounts, update deal pipelines, and log outreach.";
    if (UI.brandRoleSubtitle) UI.brandRoleSubtitle.textContent = "STAFF PORTAL";
    if (UI.currentModuleLabel) UI.currentModuleLabel.textContent = "STAFF CLEARANCE";

    // Hide administrative tools from workers
    document.querySelectorAll(".admin-only").forEach(el => el.style.display = "none");
    // Ensure operational controls are visible
    document.querySelectorAll(".worker-only").forEach(el => el.style.display = "");

    renderWorkerTeamSummary();
}


/* ==========================================================================
   4. DATA RENDERING: STAFF & WORKERS DIRECTORY
   ========================================================================== */
function getStaffList() {
    // Checks both current storage keys for employees
    const staff = localStorage.getItem("cp_staff_directory") || localStorage.getItem("cp_registered_users");
    return staff ? JSON.parse(staff) : [];
}

/**
 * Admin view: Detailed list with click-to-inspect security profiles
 */
function renderAdminTeam() {
    if (!UI.teamContainer) return;

    const staff = getStaffList();
    if (staff.length === 0) {
        UI.teamContainer.innerHTML = `<div style="padding:15px; font-size:11px; color:#64748b;">No registered staff accounts found.</div>`;
        return;
    }

    UI.teamContainer.innerHTML = staff.map(member => {
        const firstLetter = member.name ? member.name.charAt(0).toUpperCase() : "E";
        const role = member.role || "Operations Associate";
        const dept = member.department || "Operations";

        return `
      <div class="employee-row" onclick="inspectStaffMember('${escapeQuotes(member.name)}', '${escapeQuotes(member.email)}', '${escapeQuotes(role)}', '${escapeQuotes(dept)}')">
        <div class="employee-avatar">${firstLetter}</div>
        <div class="employee-info">
          <div class="employee-name">${member.name}</div>
          <div class="employee-role">${role} • ${dept}</div>
        </div>
        <div class="employee-login">
          <div class="status"><span class="status-dot"></span> Active</div>
        </div>
      </div>
    `;
    }).join("");
}

/**
 * Worker view: Lightweight status indicator without confidential records
 */
function renderWorkerTeamSummary() {
    if (!UI.teamContainer) return;

    const staff = getStaffList();
    UI.teamContainer.innerHTML = `
    <div style="padding: 12px 6px;">
      <div style="font-size: 11px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">Department Colleagues</div>
      <div style="font-size: 10px; color: #64748b; line-height: 1.5;">
        ${staff.length} team members currently assigned to client operations.
      </div>
    </div>
  `;
}

function inspectStaffMember(name, email, role, dept) {
    openModal(
        `Staff Credential: ${name}`,
        `Full Name: ${name}\nCorporate Email: ${email}\nAssigned Role: ${role}\nDepartment: ${dept}\nSecurity Perimeter: ClientPilot Internal Seat`
    );
}


/* ==========================================================================
   5. NAVIGATION DISPATCHERS (DIFFERENTIATED BY ROLE)
   ========================================================================== */
function setActiveNav(buttonId) {
    document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
    const activeBtn = document.getElementById(buttonId);
    if (activeBtn) activeBtn.classList.add("active");
}

function showOverviewNav() {
    setActiveNav("nav-overview");

    if (isAdmin) {
        openModal(
            "Executive Dashboard Overview",
            `Session Identity: ${currentUser.name}\nDesignation: ${currentUser.role}\nAccess Tier: Enterprise Root\nPlatform Status: All enterprise microservices operational.`
        );
    } else {
        openModal(
            "Worker Desk Overview",
            `Staff Specialist: ${currentUser.name}\nAssigned Department: Operations / Client Relations\nTarget Pipeline: ₹42.8 Lakh\nDatabase: LocalStorage Active Session.`
        );
    }
}

function showContactsNav() {
    setActiveNav("nav-contacts");

    const directoryContent =
        "• Ananya Rao — Apex Core Systems (VP Tech)\n" +
        "• Rohan Mehta — FinTech Dynamics (Operations Lead)\n" +
        "• Vikram Nair — MediCore Health (Procurement Specialist)\n" +
        "• Sunita Verma — GlobalTech Infrastructure (Enterprise Director)\n\n" +
        "Status: Verified enterprise contacts in active pipeline.";

    openModal("Client Directory (External Customers)", directoryContent);
}

function showDealsNav() {
    setActiveNav("nav-deals");

    const storedDeals = JSON.parse(localStorage.getItem("cp_custom_deals")) || [];
    let dealReport =
        "Standard Pipeline Overview:\n" +
        "• Inbound Lead Evaluation — ₹12.4 Lakh\n" +
        "• Technical Architecture Review — ₹8.6 Lakh\n" +
        "• Commercial Proposal Under Review — ₹14.2 Lakh\n" +
        "• Closed Won (Executed) — ₹18.5 Lakh\n";

    if (storedDeals.length > 0) {
        dealReport += "\nRecent Team Submissions:\n" +
            storedDeals.map(d => `• ${d.name} (${d.client}) — ₹${d.value} Lakh`).join("\n");
    }

    openModal("Corporate Deals Pipeline", dealReport);
}

function showScheduleNav() {
    setActiveNav("nav-schedule");

    const schedule = isAdmin
        ? "• 09:30 AM — Executive Council Quarterly Strategy\n• 01:00 PM — Operations Security Audit Review\n• 04:30 PM — Cross-Functional Lead Sync"
        : "• 10:30 AM — MediCore Demo (Room 3)\n• 02:00 PM — TechNova Scope Alignment\n• 05:00 PM — Lead Activity Catchup";

    openModal("Today's Schedule & Commitments", schedule);
}

function showEmployeesNav() {
    if (!isAdmin) {
        openModal("Access Restricted", "The Employee Master Directory is reserved for System Administrators.");
        return;
    }

    setActiveNav("nav-employees");
    const staff = getStaffList();
    const summary = staff.map(s => `• ${s.name} (${s.email}) — ${s.role || "Operations"}`).join("\n");

    openModal("Authorized Personnel Directory (Admin Module)", `Active Headcount: ${staff.length}\n\n${summary}`);
}

function showActivityNav() {
    if (!isAdmin) {
        openModal("Access Restricted", "Detailed telemetry audit logging is reserved for the Admin Module.");
        return;
    }

    setActiveNav("nav-activity");
    openModal(
        "System Activity & Audit Log (Admin Only)",
        "• 10:15 AM — Staff updated Deal Stage (Apex Core Systems)\n" +
        "• 11:20 AM — Staff logged Client Interaction via Phone\n" +
        "• 01:30 PM — Automated LocalStorage database sync completed\n" +
        "• 03:45 PM — Administrative credential verified (Elena Rostova)"
    );
}

function handleTeamCardClick() {
    if (isAdmin) {
        showEmployeesNav();
    } else {
        openModal("Team Overview", "Colleague status: 8 of 12 personnel currently logged in.");
    }
}


/* ==========================================================================
   6. OPERATIONAL PIPELINE ACTIONS (WORKERS & ADMINS)
   ========================================================================== */
function openNewDealModal() {
    const clientName = prompt("Enter Corporate Client Name:");
    if (!clientName || !clientName.trim()) return;

    const dealValue = prompt("Enter Contract Value in Lakhs (₹):", "5.0");
    if (!dealValue || !dealValue.trim()) return;

    const storedDeals = JSON.parse(localStorage.getItem("cp_custom_deals")) || [];
    storedDeals.push({
        name: `${clientName.trim()} Agreement`,
        client: clientName.trim(),
        value: dealValue.trim()
    });

    localStorage.setItem("cp_custom_deals", JSON.stringify(storedDeals));

    const totalCount = 31 + storedDeals.length;
    if (UI.summaryDealCount) UI.summaryDealCount.textContent = totalCount;
    if (UI.activeDealsStat) UI.activeDealsStat.textContent = totalCount;

    openModal("Deal Logged", `Successfully registered ${clientName.trim()} deal valued at ₹${dealValue}L.`);
}

function logCall() {
    const notes = prompt("Enter client communication notes:");
    if (notes && notes.trim()) {
        openModal("Outreach Synchronized", `Logged interaction:\n"${notes.trim()}"\n\nAppended to client history.`);
    }
}

function addNote() {
    const note = prompt("Enter workspace reference note:");
    if (note && note.trim()) {
        openModal("Note Saved", `Note recorded:\n"${note.trim()}"`);
    }
}

function scheduleFollowUp() {
    openModal("Follow-Up Queued", "Follow-up task dispatched. Reminder synced to calendar.");
}

function showClient(name, company, role, health, status) {
    openModal(
        "Client Account Profile",
        `Contact Representative: ${name}\nClient Enterprise: ${company}\nDesignation: ${role}\nRelationship Health Score: ${health}\nCurrent Status: ${status}`
    );
}

function showCurrentUser() {
    openModal(
        "Current Session Details",
        `Name: ${currentUser.name}\nEmail: ${currentUser.email}\nAssigned Role: ${currentUser.role || "Staff"}\nSystem Module: ${isAdmin ? "Executive Console" : "Operations Workspace"}`
    );
}


/* ==========================================================================
   7. MODAL UTILITIES & TERMINATION
   ========================================================================== */
function openModal(title, content) {
    if (UI.modalHeading) UI.modalHeading.textContent = title;
    if (UI.modalContent) UI.modalContent.textContent = content;
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

// Start dashboard logic once the script loads
initDashboard();