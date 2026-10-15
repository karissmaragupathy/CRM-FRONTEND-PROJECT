/* =====================================================
   NEXAFLOW CRM
   JavaScript
===================================================== */

/* ================= CRM DATA ================= */

let leads = [
    {
        id: 1,
        company: "TechNova",
        contact: "Priya Sharma",
        email: "priya@technova.com",
        phone: "+91 98765 43210",
        plan: "Professional",
        value: 80000,
        stage: "Qualified",
        task: "Schedule product discussion",
        notes: "Interested in endpoint security.",
        date: "Sep 14, 2026"
    },
    {
        id: 2,
        company: "CloudX",
        contact: "Rahul Mehta",
        email: "rahul@cloudx.com",
        phone: "+91 91234 56789",
        plan: "Starter",
        value: 40000,
        stage: "New Lead",
        task: "Initial discovery call",
        notes: "Requested pricing information.",
        date: "Sep 13, 2026"
    },
    {
        id: 3,
        company: "DataCorp",
        contact: "Ananya Rao",
        email: "ananya@datacorp.com",
        phone: "+91 99887 66554",
        plan: "Enterprise",
        value: 120000,
        stage: "Demo Scheduled",
        task: "Product demo on Friday",
        notes: "Large team. Interested in enterprise security.",
        date: "Sep 12, 2026"
    },
    {
        id: 4,
        company: "SecureWorks",
        contact: "Arjun Kumar",
        email: "arjun@secureworks.com",
        phone: "+91 90000 11122",
        plan: "Professional",
        value: 75000,
        stage: "Proposal Sent",
        task: "Follow up on proposal",
        notes: "Proposal sent after successful demo.",
        date: "Sep 10, 2026"
    },
    {
        id: 5,
        company: "FinEdge",
        contact: "Meera Shah",
        email: "meera@finedge.com",
        phone: "+91 98888 77766",
        plan: "Enterprise",
        value: 200000,
        stage: "Won",
        task: "Complete onboarding",
        notes: "Deal successfully closed.",
        date: "Sep 8, 2026"
    },
    {
        id: 6,
        company: "NextGen Systems",
        contact: "Vikram Singh",
        email: "vikram@nextgen.com",
        phone: "+91 97777 66655",
        plan: "Professional",
        value: 95000,
        stage: "Qualified",
        task: "Send technical documentation",
        notes: "Technical team reviewing features.",
        date: "Sep 7, 2026"
    }
];

/* ================= UTILITY HELPERS ================= */

function escapeHtml(str) {
    if (typeof str !== "string") return str ?? "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatCurrency(value) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(value || 0);
}

/* ================= PAGE NAVIGATION ================= */

function showPage(pageId, clickedButton) {
    const pages = document.querySelectorAll(".page");
    pages.forEach(page => page.classList.remove("active-page"));

    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }

    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => item.classList.remove("active"));

    if (clickedButton) {
        clickedButton.classList.add("active");
    }

    if (pageId === "dashboard") renderDashboard();
    if (pageId === "pipeline") renderPipeline();
    if (pageId === "leads") renderLeadsTable();
}

/* ================= DASHBOARD ================= */

function renderDashboard() {
    const totalLeads = leads.length;
    const demos = leads.filter(lead => lead.stage === "Demo Scheduled").length;
    const activeDeals = leads.filter(lead => lead.stage !== "Won").length;
    const expectedRevenue = leads.reduce((total, lead) => {
        return lead.stage !== "Won" ? total + Number(lead.value || 0) : total;
    }, 0);

    const elTotalLeads = document.getElementById("totalLeads");
    const elTotalDemos = document.getElementById("totalDemos");
    const elActiveDeals = document.getElementById("activeDeals");
    const elExpectedRevenue = document.getElementById("expectedRevenue");

    if (elTotalLeads) elTotalLeads.textContent = totalLeads;
    if (elTotalDemos) elTotalDemos.textContent = demos;
    if (elActiveDeals) elActiveDeals.textContent = activeDeals;
    if (elExpectedRevenue) elExpectedRevenue.textContent = formatCurrency(expectedRevenue);

    renderRecentLeads();
    renderPipelineOverview();
}

/* ================= RECENT LEADS ================= */

function renderRecentLeads() {
    const container = document.getElementById("recentLeads");
    if (!container) return;

    container.innerHTML = "";
    const recentLeads = leads.slice(-4).reverse();

    recentLeads.forEach(lead => {
        const firstLetter = escapeHtml(lead.company ? lead.company.charAt(0) : "?");
        const companyName = escapeHtml(lead.company);
        const contactName = escapeHtml(lead.contact);

        container.innerHTML += `
            <div class="recent-lead" onclick="openLeadDetails(${lead.id})">
                <div class="lead-company">
                    <div class="company-avatar">${firstLetter}</div>
                    <div>
                        <strong>${companyName}</strong>
                        <small>${contactName}</small>
                    </div>
                </div>
                <strong>${formatCurrency(lead.value)}</strong>
            </div>
        `;
    });
}

/* ================= PIPELINE OVERVIEW ================= */

function renderPipelineOverview() {
    const container = document.getElementById("pipelineOverview");
    if (!container) return;

    container.innerHTML = "";
    const stages = ["New Lead", "Qualified", "Demo Scheduled", "Proposal Sent", "Won"];

    stages.forEach(stage => {
        const count = leads.filter(lead => lead.stage === stage).length;
        const percentage = leads.length === 0 ? 0 : (count / leads.length) * 100;

        container.innerHTML += `
            <div class="pipeline-item">
                <div class="pipeline-label">
                    <span>${escapeHtml(stage)}</span>
                    <strong>${count}</strong>
                </div>
                <div class="pipeline-bar">
                    <div class="pipeline-fill" style="width: ${percentage.toFixed(1)}%"></div>
                </div>
            </div>
        `;
    });
}

/* ================= PIPELINE ================= */

function renderPipeline() {
    const stages = {
        "New Lead": "new",
        "Qualified": "qualified",
        "Demo Scheduled": "demo",
        "Proposal Sent": "proposal",
        "Won": "won"
    };

    Object.values(stages).forEach(containerId => {
        const col = document.getElementById(containerId);
        if (col) col.innerHTML = "";
    });

    leads.forEach(lead => {
        const containerId = stages[lead.stage];
        const container = document.getElementById(containerId);

        if (container) {
            container.innerHTML += `
                <div class="kanban-card" onclick="openLeadDetails(${lead.id})">
                    <h4>${escapeHtml(lead.company)}</h4>
                    <p>${escapeHtml(lead.contact)}</p>
                    <div class="card-bottom">
                        <span class="deal-value">${formatCurrency(lead.value)}</span>
                        <span class="plan-tag">${escapeHtml(lead.plan)}</span>
                    </div>
                </div>
            `;
        }
    });

    updatePipelineCounts();
}

/* ================= PIPELINE COUNTS ================= */

function updatePipelineCounts() {
    const counts = {
        "count-new": leads.filter(lead => lead.stage === "New Lead").length,
        "count-qualified": leads.filter(lead => lead.stage === "Qualified").length,
        "count-demo": leads.filter(lead => lead.stage === "Demo Scheduled").length,
        "count-proposal": leads.filter(lead => lead.stage === "Proposal Sent").length,
        "count-won": leads.filter(lead => lead.stage === "Won").length
    };

    Object.keys(counts).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = counts[id];
    });
}

/* ================= LEADS TABLE ================= */

function renderLeadsTable() {
    const tableBody = document.getElementById("leadsTableBody");
    if (!tableBody) return;

    const searchInput = document.getElementById("searchInput");
    const stageFilter = document.getElementById("stageFilter");

    const search = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const stage = stageFilter ? stageFilter.value : "all";

    const filteredLeads = leads.filter(lead => {
        const matchesSearch =
            (lead.company || "").toLowerCase().includes(search) ||
            (lead.contact || "").toLowerCase().includes(search);

        const matchesStage = stage === "all" || lead.stage === stage;
        return matchesSearch && matchesStage;
    });

    tableBody.innerHTML = "";

    if (filteredLeads.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; padding:40px; color:#9ca3af">
                    No leads found.
                </td>
            </tr>
        `;
        return;
    }

    filteredLeads.forEach(lead => {
        const firstLetter = escapeHtml(lead.company ? lead.company.charAt(0) : "?");

        tableBody.innerHTML += `
            <tr>
                <td>
                    <div class="company-cell">
                        <div class="company-avatar">${firstLetter}</div>
                        <div>
                            <strong>${escapeHtml(lead.company)}</strong>
                            <small>${escapeHtml(lead.email)}</small>
                        </div>
                    </div>
                </td>
                <td>${escapeHtml(lead.contact)}</td>
                <td>${escapeHtml(lead.plan)}</td>
                <td><strong>${formatCurrency(lead.value)}</strong></td>
                <td>${getStageBadge(lead.stage)}</td>
                <td>${escapeHtml(lead.task)}</td>
                <td>
                    <div class="action-buttons">
                        <button type="button" class="action-button" onclick="openLeadDetails(${lead.id})">View</button>
                        <button type="button" class="action-button" onclick="deleteLead(${lead.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    });
}

/* ================= STAGE BADGE ================= */

function getStageBadge(stage) {
    let className = "stage-new";

    if (stage === "Qualified") className = "stage-qualified";
    else if (stage === "Demo Scheduled") className = "stage-demo";
    else if (stage === "Proposal Sent") className = "stage-proposal";
    else if (stage === "Won") className = "stage-won";

    return `<span class="stage-badge ${className}">${escapeHtml(stage)}</span>`;
}

/* ================= LEAD DETAILS ================= */

function openLeadDetails(id) {
    const lead = leads.find(item => item.id === id);
    if (!lead) return;

    const container = document.getElementById("leadDetailsContent");
    if (!container) return;

    const firstLetter = escapeHtml(lead.company ? lead.company.charAt(0) : "?");

    container.innerHTML = `
        <div class="details-header">
            <div class="details-company">
                <div class="details-avatar">${firstLetter}</div>
                <div>
                    <h2>${escapeHtml(lead.company)}</h2>
                    <p>${escapeHtml(lead.contact)}</p>
                </div>
            </div>
            ${getStageBadge(lead.stage)}
        </div>

        <div class="details-grid">
            <div class="detail-panel">
                <h3>Contact Information</h3>
                <div class="detail-row">
                    <small>Contact Person</small>
                    <strong>${escapeHtml(lead.contact)}</strong>
                </div>
                <div class="detail-row">
                    <small>Email</small>
                    <strong>${escapeHtml(lead.email)}</strong>
                </div>
                <div class="detail-row">
                    <small>Phone</small>
                    <strong>${escapeHtml(lead.phone)}</strong>
                </div>
            </div>

            <div class="detail-panel">
                <h3>Deal Information</h3>
                <div class="detail-row">
                    <small>Plan</small>
                    <strong>${escapeHtml(lead.plan)}</strong>
                </div>
                <div class="detail-row">
                    <small>Deal Value</small>
                    <strong>${formatCurrency(lead.value)}</strong>
                </div>
                <div class="detail-row">
                    <small>Next Task</small>
                    <strong>${escapeHtml(lead.task)}</strong>
                </div>
            </div>

            <div class="detail-panel">
                <h3>Notes</h3>
                <p style="font-size:13px; color:#6b7280; line-height:1.6">
                    ${escapeHtml(lead.notes)}
                </p>
            </div>

            <div class="detail-panel">
                <h3>Activity History</h3>
                <div class="activity">
                    <strong>Lead created</strong>
                    <p>${escapeHtml(lead.date)}</p>
                </div>
                <div class="activity">
                    <strong>Stage: ${escapeHtml(lead.stage)}</strong>
                    <p>Current pipeline stage</p>
                </div>
                <div class="activity">
                    <strong>Next task</strong>
                    <p>${escapeHtml(lead.task)}</p>
                </div>
            </div>
        </div>
    `;

    showPage("lead-details", null);
}

/* ================= ADD LEAD MODAL ================= */

function openAddLeadModal() {
    const modal = document.getElementById("leadModal");
    if (modal) modal.classList.add("show");
}

function closeLeadModal() {
    const modal = document.getElementById("leadModal");
    if (modal) modal.classList.remove("show");

    const form = document.getElementById("leadForm");
    if (form) form.reset();
}

/* ================= DELETE LEAD ================= */

function deleteLead(id) {
    const confirmDelete = confirm("Are you sure you want to delete this lead?");
    if (!confirmDelete) return;

    leads = leads.filter(lead => lead.id !== id);

    renderDashboard();
    renderPipeline();
    renderLeadsTable();
}

/* ================= INITIALIZATION & EVENT BINDINGS ================= */

function initApp() {
    const leadForm = document.getElementById("leadForm");
    if (leadForm) {
        leadForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const companyInput = document.getElementById("companyInput");
            const contactInput = document.getElementById("contactInput");
            const emailInput = document.getElementById("emailInput");
            const phoneInput = document.getElementById("phoneInput");
            const planInput = document.getElementById("planInput");
            const valueInput = document.getElementById("valueInput");
            const stageInput = document.getElementById("stageInput");
            const taskInput = document.getElementById("taskInput");
            const notesInput = document.getElementById("notesInput");

            const newLead = {
                id: Date.now(),
                company: companyInput ? companyInput.value.trim() : "",
                contact: contactInput ? contactInput.value.trim() : "",
                email: emailInput ? emailInput.value.trim() : "",
                phone: phoneInput ? phoneInput.value.trim() : "",
                plan: planInput ? planInput.value : "Starter",
                value: valueInput ? Number(valueInput.value) || 0 : 0,
                stage: stageInput ? stageInput.value : "New Lead",
                task: taskInput ? taskInput.value.trim() : "",
                notes: notesInput ? notesInput.value.trim() : "",
                date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            };

            leads.push(newLead);
            closeLeadModal();

            renderDashboard();
            renderPipeline();
            renderLeadsTable();
        });
    }

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", renderLeadsTable);
    }

    const stageFilter = document.getElementById("stageFilter");
    if (stageFilter) {
        stageFilter.addEventListener("change", renderLeadsTable);
    }

    // Initial renders
    renderDashboard();
    renderPipeline();
    renderLeadsTable();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}