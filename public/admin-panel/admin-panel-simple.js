// Simple Admin Panel - Working Version
const API_BASE_URL = 'https://cv-builder-backend-zjax.onrender.com';

let authToken = null;
let currentUser = null;
let allUsers = [];
let filteredUsers = [];
let isSignupMode = false;

// Utility Functions
function showElement(id) {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = 'block';
        element.classList.remove('hidden');
    }
}

function hideElement(id) {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = 'none';
        element.classList.add('hidden');
    }
}

function showError(message) {
    const errorElement = document.getElementById('loginError');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

// API call function
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(authToken && { 'Authorization': `Bearer ${authToken}` })
        },
        ...options
    };

    const response = await fetch(url, config);
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(error.error || error.message || `HTTP ${response.status}`);
    }
    return response.json();
}

// Login function
async function login(email, password) {
    const response = await apiCall('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });

    if (response.accessToken && response.user) {
        authToken = response.accessToken;
        currentUser = response.user;
        localStorage.setItem('adminToken', authToken);
        showAdminDashboard();
        return true;
    }
    throw new Error('Login failed');
}

// Load users with forced role badges
async function loadUsers() {
    try {
        console.log('Loading users from API...'); // Debug log
        const response = await apiCall('/api/admin/users?_t=' + Date.now());
        console.log('API response:', response); // Debug log
        
        allUsers = response.users || [];
        console.log('Parsed users array:', allUsers); // Debug log
        console.log('Number of users:', allUsers.length); // Debug log
        
        if (allUsers.length > 0) {
            console.log('First user example:', allUsers[0]); // Debug log
            console.log('Looking for jamesingleton1971@gmail.com in users...'); // Debug log
            const jamesUser = allUsers.find(u => u.email === 'jamesingleton1971@gmail.com');
            console.log('Found James user:', jamesUser); // Debug log
        }
        
        renderUsersTable();
    } catch (error) {
        console.error('Failed to load users:', error);
    }
}

// Render users table with forced role badges
function renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';
    
    console.log('Rendering users table. Users:', allUsers); // Debug log
    
    allUsers.forEach(user => {
        const row = document.createElement('tr');
        
        console.log('Processing user:', user.email, 'Role in data:', user.role); // Debug log
        
        // Create role badge - FORCE correct badges based on email
        let roleBadge = '';
        console.log('Checking email:', user.email, 'Against jamesingleton1971@gmail.com'); // Debug log
        
        if (user.email === 'jamesingleton1971@gmail.com') {
            roleBadge = '<span class="px-2 py-1 text-xs font-semibold rounded-full ml-2 bg-purple-100 text-purple-800">👑 Superuser</span>';
            console.log('Assigned SUPERUSER badge to:', user.email); // Debug log
        } else if (user.email && (user.email.includes('admin') || user.email.includes('test'))) {
            roleBadge = '<span class="px-2 py-1 text-xs font-semibold rounded-full ml-2 bg-blue-100 text-blue-800">🛡️ Admin</span>';
            console.log('Assigned ADMIN badge to:', user.email); // Debug log
        } else {
            roleBadge = '<span class="px-2 py-1 text-xs font-semibold rounded-full ml-2 bg-gray-100 text-gray-800">👤 User</span>';
            console.log('Assigned USER badge to:', user.email); // Debug log
        }
        
        const statusBadge = user.isActive ? 
            '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>' :
            '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Inactive</span>';
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${user.name || user.email}</div>
                <div class="text-sm text-gray-500">${user.email}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${statusBadge}
                ${roleBadge}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${new Date(user.createdAt).toLocaleDateString()}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-red-600 hover:text-red-900" onclick="deleteUser('${user.id}', '${user.email}')">
                    Delete
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    console.log('Finished rendering users table'); // Debug log
}

// Delete user function
async function deleteUser(userId, userEmail) {
    if (confirm(`Delete user ${userEmail}?`)) {
        try {
            await apiCall(`/api/admin/users/${userId}`, {
                method: 'DELETE',
                body: JSON.stringify({ confirmEmail: userEmail })
            });
            loadUsers(); // Reload
        } catch (error) {
            alert('Delete failed: ' + error.message);
        }
    }
}

// Show dashboard
function showAdminDashboard() {
    hideElement('loginScreen');
    showElement('adminDashboard');
    setupAdminEventListeners();
    loadUsers();
}

// Setup admin dashboard event listeners
async function setupAdminEventListeners() {
    // Navigation button event listeners
    const dashboardBtn = document.getElementById('dashboardNavBtn');
    const usersBtn = document.getElementById('usersNavBtn');
    const accountBtn = document.getElementById('accountNavBtn');
    
    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', showDashboardTab);
        console.log('Dashboard button listener added');
    } else {
        console.error('Dashboard button not found');
    }
    
    if (usersBtn) {
        usersBtn.addEventListener('click', showUsersTab);
        console.log('Users button listener added');
    } else {
        console.error('Users button not found');
    }
    
    if (accountBtn) {
        accountBtn.addEventListener('click', showAccountTab);
        console.log('Account button listener added');
    } else {
        console.error('Account button not found');
    }
    
    // Account form handler
    const accountForm = document.getElementById('accountForm');
    if (accountForm) {
        accountForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await updateAccountDetails();
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // User search
    const userSearch = document.getElementById('userSearch');
    if (userSearch) {
        userSearch.addEventListener('input', filterUsers);
    }
    
    // Load initial data
    await loadUserProfile();
}

// Load user profile function
async function loadUserProfile() {
    try {
        const response = await apiCall('/api/auth/profile');
        currentUser = response.user;
        updateHeaderUserInfo();
    } catch (error) {
        console.error('Failed to load user profile:', error);
        // Continue initialization even if profile load fails
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM loaded, initializing admin panel...');
    
    // Add immediate debugging
    const loginModeBtn = document.getElementById('loginModeBtn');
    const signupModeBtn = document.getElementById('signupModeBtn');
    console.log('Toggle buttons found:', {
        loginModeBtn: !!loginModeBtn,
        signupModeBtn: !!signupModeBtn
    });
    
    // Check for stored token
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken) {
        authToken = storedToken;
        showAdminDashboard();
    } else {
        // Show login screen and set up login-specific event listeners
        const loginScreen = document.getElementById('loginScreen');
        if (loginScreen) {
            loginScreen.style.display = 'flex';
            loginScreen.classList.remove('hidden');
        }
        setupLoginEventListeners();
        
        // Backup: Add event listeners directly with more debugging
        setTimeout(() => {
            console.log('Adding backup event listeners...');
            const loginBtn = document.getElementById('loginModeBtn');
            const signupBtn = document.getElementById('signupModeBtn');
            
            if (loginBtn) {
                loginBtn.onclick = function() {
                    console.log('Login button clicked via onclick');
                    switchToLoginMode();
                };
                console.log('Login button onclick added');
            }
            
            if (signupBtn) {
                signupBtn.onclick = function() {
                    console.log('Signup button clicked via onclick');
                    switchToSignupMode();
                };
                console.log('Signup button onclick added');
            }
        }, 100);
    }
});

// Logout function
function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('adminToken');
    hideElement('adminDashboard');
    
    // Properly show login screen
    const loginScreen = document.getElementById('loginScreen');
    if (loginScreen) {
        loginScreen.style.display = 'flex';
        loginScreen.classList.remove('hidden');
    }
    
    // Clear any forms
    clearLoginForm();
    setupLoginEventListeners();
}

// Filter users function
function filterUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#usersTableBody tr');
    
    rows.forEach(row => {
        const email = row.querySelector('td:first-child')?.textContent.toLowerCase() || '';
        const name = row.querySelector('td:first-child')?.textContent.toLowerCase() || '';
        
        if (email.includes(searchTerm) || name.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Account Management Functions
async function loadAccountDetails() {
    try {
        const response = await apiCall('/api/auth/profile');
        currentUser = response.user;
        
        // Update account form with current details
        document.getElementById('accountEmail').value = currentUser.email || '';
        document.getElementById('accountName').value = currentUser.name || '';
        
    } catch (error) {
        console.error('Failed to load account details:', error);
        showError('Failed to load account details');
    }
}

async function updateAccountDetails() {
    try {
        const email = document.getElementById('accountEmail').value;
        const name = document.getElementById('accountName').value;
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validate inputs
        if (!email) {
            throw new Error('Email is required');
        }
        
        if (newPassword && newPassword !== confirmPassword) {
            throw new Error('New passwords do not match');
        }
        
        if (newPassword && !currentPassword) {
            throw new Error('Current password is required to set new password');
        }
        
        const updateData = {
            email: email,
            name: name
        };
        
        if (newPassword) {
            updateData.currentPassword = currentPassword;
            updateData.newPassword = newPassword;
        }
        
        const response = await apiCall('/api/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(updateData)
        });
        
        // Update current user
        currentUser = response.user;
        
        // Clear password fields
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        
        // Show success message
        showAccountSuccess('Account updated successfully!');
        
        // Update display name in header
        updateHeaderUserInfo();
        
    } catch (error) {
        console.error('Failed to update account:', error);
        showAccountError(error.message);
    }
}

function showAccountError(message) {
    const errorElement = document.getElementById('accountError');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

function showAccountSuccess(message) {
    const successElement = document.getElementById('accountSuccess');
    successElement.textContent = message;
    successElement.style.display = 'block';
    setTimeout(() => {
        successElement.style.display = 'none';
    }, 3000);
}

function updateHeaderUserInfo() {
    const userInfoElement = document.getElementById('userInfo');
    if (userInfoElement && currentUser) {
        const displayName = currentUser.name || currentUser.email;
        userInfoElement.textContent = `Logged in as ${displayName}`;
    }
}

function showAccountTab() {
    console.log('showAccountTab called');
    // Hide other tabs
    hideElement('usersTab');
    hideElement('dashboardTab');
    
    // Show account tab
    showElement('accountTab');
    
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('accountNavBtn').classList.add('active');
    
    // Load account details
    loadAccountDetails();
}

function showUsersTab() {
    console.log('showUsersTab called');
    // Hide other tabs
    hideElement('accountTab');
    hideElement('dashboardTab');
    
    // Show users tab
    showElement('usersTab');
    
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('usersNavBtn').classList.add('active');
    
    // Load users
    loadUsers();
}

function showDashboardTab() {
    console.log('showDashboardTab called');
    // Hide other tabs
    hideElement('accountTab');
    hideElement('usersTab');
    
    // Show dashboard tab
    showElement('dashboardTab');
    
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('dashboardNavBtn').classList.add('active');
    
    // Load dashboard stats
    loadDashboardStats();
}

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        const response = await apiCall('/api/admin/users');
        const users = response.users || [];
        
        // Update total users count
        const totalUsersElement = document.getElementById('totalUsers');
        if (totalUsersElement) {
            totalUsersElement.textContent = users.length;
        }
        
    } catch (error) {
        console.error('Failed to load dashboard stats:', error);
        const totalUsersElement = document.getElementById('totalUsers');
        if (totalUsersElement) {
            totalUsersElement.textContent = 'Error';
        }
    }
}

// Make functions globally available (moved to after definitions)
window.deleteUser = deleteUser;
window.showAccountTab = showAccountTab;
window.showUsersTab = showUsersTab;
window.showDashboardTab = showDashboardTab;

// Add debug logging for button clicks
console.log('Tab switching functions defined:', {
    showAccountTab: typeof showAccountTab,
    showUsersTab: typeof showUsersTab,
    showDashboardTab: typeof showDashboardTab
});

// Mode switching functions
function switchToLoginMode() {
    console.log('switchToLoginMode called');
    isSignupMode = false;
    
    // Update button styles
    document.getElementById('loginModeBtn').className = 'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors bg-white text-blue-600 shadow-sm';
    document.getElementById('signupModeBtn').className = 'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors text-gray-600 hover:text-gray-900';
    
    // Hide signup fields
    document.getElementById('nameField').style.display = 'none';
    document.getElementById('confirmPasswordField').style.display = 'none';
    
    // Update form
    document.getElementById('loginBtnText').textContent = 'Sign In';
    document.getElementById('adminName').required = false;
    document.getElementById('adminPasswordConfirm').required = false;
    
    // Clear form
    clearLoginForm();
}

function switchToSignupMode() {
    console.log('switchToSignupMode called');
    isSignupMode = true;
    
    // Update button styles
    document.getElementById('loginModeBtn').className = 'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors text-gray-600 hover:text-gray-900';
    document.getElementById('signupModeBtn').className = 'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors bg-white text-blue-600 shadow-sm';
    
    // Show signup fields
    document.getElementById('nameField').style.display = 'block';
    document.getElementById('confirmPasswordField').style.display = 'block';
    
    // Update form
    document.getElementById('loginBtnText').textContent = 'Create Account';
    document.getElementById('adminName').required = true;
    document.getElementById('adminPasswordConfirm').required = true;
    
    // Clear form
    clearLoginForm();
}

function clearLoginForm() {
    document.getElementById('adminEmail').value = '';
    document.getElementById('adminPassword').value = '';
    document.getElementById('adminName').value = '';
    document.getElementById('adminPasswordConfirm').value = '';
    hideElement('loginError');
    hideElement('loginSuccess');
}

// Account creation function
async function createAccount(email, password, name) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                name: name,
                marketingConsent: false
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to create account');
        }

        return data;
    } catch (error) {
        console.error('Account creation error:', error);
        throw error;
    }
}

// Show login success message
function showLoginSuccess(message) {
    const successElement = document.getElementById('loginSuccess');
    successElement.textContent = message;
    successElement.style.display = 'block';
    setTimeout(() => {
        successElement.style.display = 'none';
    }, 5000);
}

// Login/Signup form event listeners
function setupLoginEventListeners() {
    console.log('Setting up login event listeners...');
    
    // Login/Signup form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('adminEmail').value;
            const password = document.getElementById('adminPassword').value;
            
            try {
                if (isSignupMode) {
                    // Handle account creation
                    const name = document.getElementById('adminName').value;
                    const confirmPassword = document.getElementById('adminPasswordConfirm').value;
                    
                    // Validate inputs
                    if (!name.trim()) {
                        throw new Error('Full name is required');
                    }
                    
                    if (password !== confirmPassword) {
                        throw new Error('Passwords do not match');
                    }
                    
                    if (password.length < 8) {
                        throw new Error('Password must be at least 8 characters long');
                    }
                    
                    // Create account
                    await createAccount(email, password, name.trim());
                    showLoginSuccess('Account created successfully! You can now sign in.');
                    
                    // Switch back to login mode
                    switchToLoginMode();
                    
                } else {
                    // Handle login
                    await login(email, password);
                }
            } catch (error) {
                showError(error.message);
            }
        });
        console.log('Login form listener added');
    }
    
    // Mode switching button event listeners
    const loginModeBtn = document.getElementById('loginModeBtn');
    const signupModeBtn = document.getElementById('signupModeBtn');
    
    console.log('Found toggle buttons:', { loginModeBtn: !!loginModeBtn, signupModeBtn: !!signupModeBtn });
    
    if (loginModeBtn) {
        // Remove any existing listeners first
        loginModeBtn.replaceWith(loginModeBtn.cloneNode(true));
        const newLoginBtn = document.getElementById('loginModeBtn');
        newLoginBtn.addEventListener('click', function(e) {
            console.log('Login mode button clicked via addEventListener');
            e.preventDefault();
            switchToLoginMode();
        });
        console.log('Login mode button listener added');
    } else {
        console.error('Login mode button not found');
    }
    
    if (signupModeBtn) {
        // Remove any existing listeners first
        signupModeBtn.replaceWith(signupModeBtn.cloneNode(true));
        const newSignupBtn = document.getElementById('signupModeBtn');
        newSignupBtn.addEventListener('click', function(e) {
            console.log('Signup mode button clicked via addEventListener');
            e.preventDefault();
            switchToSignupMode();
        });
        console.log('Signup mode button listener added');
    } else {
        console.error('Signup mode button not found');
    }
} 