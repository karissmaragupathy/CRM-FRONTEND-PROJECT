/* ==========================================================================
   1. CONSTANTS & SYSTEM CONFIGURATION
   ========================================================================== */
const DOMAIN_RESTRICTION = "@clientpilot.com";
const ADMIN_DEFAULT_PASS = "admin123";

// Authorized Indian Executive Administration
const AUTHORIZED_ADMINS = {
    "arjun.mehta@clientpilot.com": {
        name: "Arjun Mehta",
        title: "Executive Director"
    },
    "kavita.nair@clientpilot.com": {
        name: "Kavita Nair",
        title: "Head of Operations"
    },
    "rohit.verma@clientpilot.com": {
        name: "Rohit Verma",
        title: "Lead Systems & Security"
    }
};

/* ==========================================================================
   2. STORAGE INITIALIZATION
   ========================================================================== */
function initStorage() {
    const existingStaff = localStorage.getItem("cp_staff_directory");

    if (!existingStaff) {
        const seedStaff = [
            {
                name: "Priya Sharma",
                email: "priya.s@clientpilot.com",
                pass: "user123",
                role: "Senior Sales Manager",
                department: "Client Acquisition"
            },
            {
                name: "Aditya Rao",
                email: "aditya.r@clientpilot.com",
                pass: "user123",
                role: "Account Specialist",
                department: "Customer Success"
            }
        ];

        localStorage.setItem("cp_staff_directory", JSON.stringify(seedStaff));
    }
}

initStorage();

/* ==========================================================================
   3. MODULE TAB SWITCHER (ON-CLICK HANDLER)
   ========================================================================== */
function switchModule(moduleType) {
    const userTab = document.getElementById("tabUserBtn");
    const adminTab = document.getElementById("tabAdminBtn");
    const userContainer = document.getElementById("userModuleContainer");
    const adminContainer = document.getElementById("adminModuleContainer");

    if (moduleType === "admin") {
        if (userTab) userTab.classList.remove("active");
        if (adminTab) adminTab.classList.add("active");
        if (userContainer) userContainer.classList.remove("active");
        if (adminContainer) adminContainer.classList.add("active");
    } else {
        if (adminTab) adminTab.classList.remove("active");
        if (userTab) userTab.classList.add("active");
        if (adminContainer) adminContainer.classList.remove("active");
        if (userContainer) userContainer.classList.add("active");
    }
}

/* ==========================================================================
   4. VALIDATION UTILITY HELPERS
   ========================================================================== */
function isCorporateEmail(email) {
    return typeof email === "string" && email.toLowerCase().endsWith(DOMAIN_RESTRICTION);
}

function establishSession(userData) {
    localStorage.setItem("cp_current_session", JSON.stringify({
        ...userData,
        timestamp: new Date().toISOString()
    }));
    window.location.href = "dashboard.html";
}

/* ==========================================================================
   5. ADMIN HELPER
   ========================================================================== */
function quickFillAdmin(email) {
    const emailInput = document.getElementById("adminEmail");
    const passInput = document.getElementById("adminPass");
    const errorMsg = document.getElementById("adminError");

    if (emailInput) emailInput.value = email;
    if (passInput) passInput.value = ADMIN_DEFAULT_PASS;
    if (errorMsg) errorMsg.style.display = "none";
}

/* ==========================================================================
   6. USER LOGIN
   ========================================================================== */
function handleUserLogin(e) {
    e.preventDefault();

    const emailInput = document.getElementById("loginEmail");
    const passInput = document.getElementById("loginPass");
    const errorMsg = document.getElementById("loginError");

    const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
    const pass = passInput ? passInput.value : "";

    if (!isCorporateEmail(email)) {
        displayError(errorMsg, `Access restricted to ${DOMAIN_RESTRICTION} email addresses.`);
        return;
    }

    const staffDirectory = JSON.parse(localStorage.getItem("cp_staff_directory")) || [];
    const authenticatedStaff = staffDirectory.find(
        (worker) => worker.email === email && worker.pass === pass
    );

    if (authenticatedStaff) {
        clearError(errorMsg);
        establishSession({
            name: authenticatedStaff.name,
            role: authenticatedStaff.role || "Operations Executive",
            email: authenticatedStaff.email,
            accountType: "Worker"
        });
    } else {
        displayError(errorMsg, "Invalid staff credentials. Contact your team lead or register.");
    }
}

/* ==========================================================================
   7. USER SIGNUP
   ========================================================================== */
function handleUserSignup(e) {
    e.preventDefault();

    const nameInput = document.getElementById("signupName");
    const emailInput = document.getElementById("signupEmail");
    const passInput = document.getElementById("signupPass");

    const errorMsg = document.getElementById("signupError");
    const successMsg = document.getElementById("signupSuccess");

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
    const pass = passInput ? passInput.value : "";

    if (!name || !email || !pass) {
        displayError(errorMsg, "Please fill out all required fields.");
        return;
    }

    if (!isCorporateEmail(email)) {
        displayError(errorMsg, `Registration permitted only via company domain (${DOMAIN_RESTRICTION}).`);
        if (successMsg) successMsg.style.display = "none";
        return;
    }

    const staffDirectory = JSON.parse(localStorage.getItem("cp_staff_directory")) || [];
    const emailExists = staffDirectory.some((worker) => worker.email === email);

    if (emailExists) {
        displayError(errorMsg, "Employee profile already exists. Please log in.");
        if (successMsg) successMsg.style.display = "none";
        return;
    }

    const newStaffMember = {
        name: name,
        email: email,
        pass: pass,
        role: "Operations Associate",
        department: "Client Services"
    };

    staffDirectory.push(newStaffMember);
    localStorage.setItem("cp_staff_directory", JSON.stringify(staffDirectory));

    clearError(errorMsg);
    if (successMsg) {
        successMsg.textContent = "Profile registered successfully. You may now log in.";
        successMsg.style.display = "block";
    }

    if (nameInput) nameInput.value = "";
    if (emailInput) emailInput.value = "";
    if (passInput) passInput.value = "";
}

/* ==========================================================================
   8. ADMIN LOGIN
   ========================================================================== */
function handleAdminLogin(e) {
    e.preventDefault();

    const emailInput = document.getElementById("adminEmail");
    const passInput = document.getElementById("adminPass");
    const errorMsg = document.getElementById("adminError");

    const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
    const pass = passInput ? passInput.value : "";

    const adminAccount = AUTHORIZED_ADMINS[email];
    const hasValidPassword = pass === ADMIN_DEFAULT_PASS;

    if (adminAccount && hasValidPassword) {
        clearError(errorMsg);
        establishSession({
            name: adminAccount.name,
            role: adminAccount.title,
            email: email,
            accountType: "Admin"
        });
    } else {
        displayError(errorMsg, "Unauthorized admin access or invalid security key.");
    }
}

/* ==========================================================================
   9. FEEDBACK HELPERS
   ========================================================================== */
function displayError(element, message) {
    if (element) {
        element.textContent = message;
        element.style.display = "block";
    }
}

function clearError(element) {
    if (element) {
        element.textContent = "";
        element.style.display = "none";
    }
}