/* ==========================================================================
   1. SESSION READ & ROLE DETERMINATION
   ========================================================================== */
const rawSession = localStorage.getItem("cp_current_session") || localStorage.getItem("cp_current_user");

if (!rawSession) {
    window.location.href = "index.html";
}

const currentUser = JSON.parse(rawSession);

// Explicit boolean check for Admin
const isAdmin = currentUser.accountType === "Admin" ||
    currentUser.role === "Administrator" ||
    currentUser.role === "Executive Director" ||
    currentUser.role === "Head of Operations" ||
    currentUser.role === "Lead Systems & Security";

/* ==========================================================================
   2. INITIALIZE VIEWPORT BY ROLE
   ========================================================================== */
function initApp() {
    const app = document.getElementById("dashboardApp");
    const userView = document.getElementById("userDashboardView");
    const adminView = document.getElementById("adminDashboardView");
    const roleBadgeText = document.getElementById("roleBadgeText");
    const brandConsoleTag = document.getElementById("brandConsoleTag");
    const displayFullName = document.getElementById("displayFullName");
    const displayRole = document.getElementById("displayRole");
    const avatarInitial = document.getElementById("avatarInitial");

    // Populate user profile info
    if (displayFullName) displayFullName.textContent = currentUser.name || "User";
    if (displayRole) displayRole.textContent = currentUser.role || (isAdmin ? "Executive Admin" : "Operations Specialist");
    if (avatarInitial) avatarInitial.textContent = (currentUser.name ? currentUser.name.charAt(0) : "U").toUpperCase();

    // Populate greeting names
    document.querySelectorAll(".greeting-user").forEach(el => {
        el.textContent = currentUser.name ? currentUser.name.split(" ")[0] : "Associate";
    });

    if (isAdmin) {
        // ADMIN ENVIRONMENT
        app.classList.add("theme-admin");
        app.classList.remove("theme-user");
        userView.style.display = "none";
        adminView.style.display = "block";

        if (roleBadgeText) roleBadgeText.textContent = "ADMIN ROOT CLEARANCE";
        if (brandConsoleTag) brandConsoleTag.textContent = "EXECUTIVE CONSOLE";

        buildAdminSubNav();
        renderAdminStaffTable();
    } else {
        // USER / STAFF ENVIRONMENT
        app.classList.add("theme-user");
        app.classList.remove("theme-admin");
        userView.style.display = "block";
        adminView.style.display = "none";

        if (roleBadgeText) roleBadgeText.textContent = "STAFF WORKBENCH";
        if (brandConsoleTag) brandConsoleTag.textContent = "STAFF CRM";

        buildUserSubNav();
    }
}

/* ==========================================================================
   3. DEDICATED SUB-NAVBARS
   ========================================================================== */
function buildUserSubNav() {
    const nav = document.getElementById("subNavLinks");
    nav.innerHTML = `
        <button class="sub-nav-item active" onclick="switchNav(this)">▦ My Workspace</button>
        <button class="sub-nav-item" onclick="showUserLeads()">♙ My Client Accounts</button>
        <button class="sub-nav-item" onclick="openNewDealModal()">◆ Active Pipeline</button>
        <button class="sub-nav-item" onclick="showUserSchedule()">◷ My Schedule</button>
    `;
}

function buildAdminSubNav() {
    const nav = document.getElementById("subNavLinks");
    nav.innerHTML = `
        <button class="sub-nav-item active" onclick="switchNav(this)">▦ Executive Overview</button>
        <button class="sub-nav-item" onclick="inspectPersonnel()">♟ Staff Master Control</button>
        <button class="sub-nav-item" onclick="showTelemetryLogs()">↗ Root Audit Telemetry</button>
        <button class="sub-nav-item" onclick="showDbHealth()">⚙ Database Infrastructure</button>
    `;
}

function switchNav(btn) {
    document.querySelectorAll(".sub-nav-item").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
}

/* ==========================================================================
   4. ADMIN SPECIFIC FUNCTIONS (STAFF MANAGEMENT & AUDIT)
   ========================================================================== */
function getStaffData() {
    const staff = localStorage.getItem("cp_staff_directory");
    return staff ? JSON.parse(staff) : [];
}

function renderAdminStaffTable() {
    const tbody = document.getElementById("adminStaffTableBody");
    const countLabel = document.getElementById("adminTotalStaffCount");
    const staff = getStaffData();

    if (countLabel) countLabel.textContent = `${staff.length} Active`;
    if (!tbody) return;

    if (staff.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#888;">No staff accounts registered.</td></tr>`;
        return;
    }

    tbody.innerHTML = staff.map((member, index) => `
        <tr>
            <td><b>${member.name}</b></td>
            <td>${member.email}</td>
            <td>${member.department || "Operations"}</td>
            <td><span class="tag tag-admin">${member.role || "Associate"}</span></td>
            <td>
                <button class="table-action-btn danger" onclick="terminateStaff(${index})">Revoke</button>
            </td>
        </tr>
    `).join("");
}

function terminateStaff(index) {
    const staff = getStaffData();
    const removed = staff.splice(index, 1)[0];
    localStorage.setItem("cp_staff_directory", JSON.stringify(staff));

    logTelemetry(`[CLEARANCE_REVOKED] Staff profile revoked: ${removed.email}`);
    renderAdminStaffTable();
    openModal("Access Revoked", `Successfully deactivated account and revoked domain access for ${removed.name} (${removed.email}).`);
}

function addNewEmployeeModal() {
    const name = prompt("Enter Staff Full Name:");
    if (!name || !name.trim()) return;

    const email = prompt("Enter Corporate Email (@clientpilot.com):");
    if (!email || !email.trim()) return;

    const role = prompt("Enter Assigned Role:", "Operations Specialist");
    const dept = prompt("Enter Department:", "Client Services");

    const staff = getStaffData();
    staff.push({
        name: name.trim(),
        email: email.trim(),
        pass: "user123",
        role: role.trim(),
        department: dept.trim()
    });

    localStorage.setItem("cp_staff_directory", JSON.stringify(staff));
    logTelemetry(`[PROVISION] New staff seat assigned to ${email.trim()}`);
    renderAdminStaffTable();
    openModal("Staff Provisioned", `Created authorized workspace seat for ${name.trim()} with default password: user123`);
}

function logTelemetry(msg) {
    const feed = document.getElementById("telemetryFeed");
    if (!feed) return;
    const time = new Date().toTimeString().split(" ")[0];
    const item = document.createElement("div");
    item.className = "log-item";
    item.innerHTML = `<span class="log-time">${time}</span><div>${msg}</div>`;
    feed.prepend(item);
}

function clearTelemetry() {
    const feed = document.getElementById("telemetryFeed");
    if (feed) feed.innerHTML = `<div style="padding:10px; font-size:11px; color:#888;">Telemetry cleared for current session.</div>`;
}

function downloadAuditReport() {
    openModal("Audit Telemetry Export", "Generated SHA-256 encrypted access logs for current fiscal quarter. Ready for compliance download.");
}

function triggerDbBackup() {
    logTelemetry("[DB_BACKUP] Manual sync completed across nodes in ap-south-1");
    openModal("Database Snapshot", "Synchronized LocalStorage state across redundant replica buckets. 0 errors detected.");
}

function purgeDemoData() {
    if (confirm("Reset local mock data back to defaults?")) {
        localStorage.clear();
        window.location.href = "index.html";
    }
}

function inspectPersonnel() {
    const staff = getStaffData();
    openModal("Staff Master Directory", `Active Personnel: ${staff.length} seats.\n\n` + staff.map(s => `• ${s.name} (${s.email}) — ${s.role}`).join("\n"));
}

function showTelemetryLogs() {
    openModal("Security Telemetry Logs", "All session authentications, write-back commits, and clearance changes are audited in real time.");
}

function showDbHealth() {
    openModal("Database Health", "Cluster Status: Healthy\nReplica Count: 3\nAverage Read Latency: 12ms\nStorage Node: localStorage active");
}

/* ==========================================================================
   5. USER SPECIFIC FUNCTIONS (LEADS, DEALS, CALL LOGS)
   ========================================================================== */
function logCallFor(client) {
    const note = prompt(`Enter call notes for ${client}:`);
    if (note && note.trim()) {
        openModal("Call Registered", `Logged call for ${client}:\n"${note.trim()}"\n\nDaily target updated.`);
    }
}

function recordOutreachNote() {
    const note = prompt("Enter reference meeting note:");
    if (note && note.trim()) {
        openModal("Meeting Note Saved", `Saved:\n"${note.trim()}"`);
    }
}

function openNewDealModal() {
    const client = prompt("Enter Client Enterprise Name:");
    if (!client || !client.trim()) return;
    const val = prompt("Enter Estimated Value (₹ Lakhs):", "5.0");
    if (!val || !val.trim()) return;

    const tbody = document.getElementById("userClientTableBody");
    if (tbody) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><b>${client.trim()}</b></td>
            <td>Primary Lead</td>
            <td><span class="tag tag-blue">Inbound</span></td>
            <td>₹${val.trim()}L</td>
            <td><button class="table-action-btn" onclick="logCallFor('${client.trim()}')">Call</button></td>
        `;
        tbody.prepend(tr);
    }
    openModal("Opportunity Logged", `Added ${client.trim()} to active pipeline valued at ₹${val.trim()}L.`);
}

function showUserLeads() {
    openModal("Assigned Accounts", "• Apex Core Systems — Tech Proposal Under Review\n• FinTech Dynamics — Commercial Negotiation\n• MediCore Health — Execution Pending\n• GlobalTech Infra — Discovery Call Scheduled");
}

function showUserSchedule() {
    openModal("Today's Schedule", "• 11:30 AM — TechNova RFP Discussion\n• 02:30 PM — FinTech Dynamics Demonstration\n• 04:45 PM — Commercial Follow-ups with Apex Core");
}

/* ==========================================================================
   6. COMMON UTILITIES
   ========================================================================== */
function executeSearch() {
    const q = document.getElementById("globalSearchInput").value.trim();
    if (q) openModal("Search Results", `Query: "${q}"\n\nFound matching database records in current workspace.`);
}

function showProfileInfo() {
    openModal("Current User Session", `User: ${currentUser.name}\nEmail: ${currentUser.email}\nClearance: ${currentUser.role}\nWorkspace Type: ${isAdmin ? "Executive Governance" : "Operations Seat"}`);
}

function openModal(title, text) {
    document.getElementById("dialogTitle").textContent = title;
    document.getElementById("dialogBody").textContent = text;
    document.getElementById("dialogModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("dialogModal").style.display = "none";
}

function logout() {
    localStorage.removeItem("cp_current_session");
    localStorage.removeItem("cp_current_user");
    window.location.href = "index.html";
}

// Run application
initApp();