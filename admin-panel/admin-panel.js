// Admin Panel Configuration
const API_BASE_URL = 'https://cv-builder-backend-zjax.onrender.com';

// Global state
let currentPage = 1;
let usersPerPage = 10;
let totalUsers = 0;
let allUsers = [];
let filteredUsers = [];
let authToken = null;
let currentUser = null;

// Utility Functions
function showElement(id) {
    document.getElementById(id).style.display = 'block';
}

function hideElement(id) {
    document.getElementById(id).style.display = 'none';
}

function showError(message, elementId = 'loginError') {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

function showSuccess(message) {
    // Create a temporary success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function formatDate(dateString) {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDateShort(dateString) {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// API Functions
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(authToken && { 'Authorization': `Bearer ${authToken}` })
        },
        ...options
    };

    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Network error' }));
            throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Authentication Functions
async function login(email, password) {
    try {
        const response = await apiCall('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (response.token && response.user && response.user.isAdmin) {
            authToken = response.token;
            currentUser = response.user;
            localStorage.setItem('adminToken', authToken);
            localStorage.setItem('adminUser', JSON.stringify(currentUser));
            return true;
        } else {
            throw new Error('Access denied. Admin privileges required.');
        }
    } catch (error) {
        throw error;
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    hideElement('adminDashboard');
    showElement('loginScreen');
    document.getElementById('loginForm').reset();
}

function checkStoredAuth() {
    const storedToken = localStorage.getItem('adminToken');
    const storedUser = localStorage.getItem('adminUser');
    
    if (storedToken && storedUser) {
        authToken = storedToken;
        currentUser = JSON.parse(storedUser);
        
        // Verify token is still valid
        verifyToken().then(valid => {
            if (valid) {
                showAdminDashboard();
            } else {
                logout();
            }
        });
    }
}

async function verifyToken() {
    try {
        await apiCall('/api/admin/dashboard');
        return true;
    } catch (error) {
        return false;
    }
}

// Dashboard Functions
async function loadDashboardStats() {
    try {
        const stats = await apiCall('/api/admin/dashboard');
        
        document.getElementById('totalUsers').textContent = stats.totalUsers || 0;
        document.getElementById('activeUsers').textContent = stats.activeUsers || 0;
        document.getElementById('totalCVs').textContent = stats.totalCVs || 0;
        document.getElementById('activeSubscriptions').textContent = stats.activeSubscriptions || 0;
        
    } catch (error) {
        console.error('Failed to load dashboard stats:', error);
        showError('Failed to load dashboard statistics');
    }
}

async function loadUsers(page = 1, search = '') {
    try {
        showElement('loadingOverlay');
        
        const params = new URLSearchParams({
            page: page.toString(),
            limit: usersPerPage.toString(),
            ...(search && { search })
        });
        
        const response = await apiCall(`/api/admin/users?${params}`);
        
        allUsers = response.users || [];
        filteredUsers = allUsers;
        totalUsers = response.total || 0;
        currentPage = page;
        
        renderUsersTable();
        renderPagination();
        updatePaginationInfo();
        
    } catch (error) {
        console.error('Failed to load users:', error);
        showError('Failed to load users');
    } finally {
        hideElement('loadingOverlay');
    }
}

function renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';
    
    filteredUsers.forEach(user => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        
        const statusBadge = user.isActive 
            ? '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>'
            : '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Inactive</span>';
            
        const adminBadge = user.isAdmin 
            ? '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 ml-2">Admin</span>'
            : '';
            
        const marketingConsent = user.marketingConsent 
            ? '<i class="fas fa-check text-green-500"></i>'
            : '<i class="fas fa-times text-red-500"></i>';
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <i class="fas fa-user text-gray-600"></i>
                        </div>
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${user.firstName} ${user.lastName}</div>
                        <div class="text-sm text-gray-500">${user.email}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${statusBadge}${adminBadge}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${formatDateShort(user.createdAt)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${formatDateShort(user.lastLoginAt)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${user.cvCount || 0}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                ${marketingConsent}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex space-x-2">
                    <button onclick="viewUser(${user.id})" 
                            class="text-blue-600 hover:text-blue-900 px-2 py-1 rounded">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="exportUser(${user.id})" 
                            class="text-green-600 hover:text-green-900 px-2 py-1 rounded" 
                            title="Export Data">
                        <i class="fas fa-download"></i>
                    </button>
                    ${!user.isAdmin ? `
                        <button onclick="toggleUserStatus(${user.id}, ${!user.isActive})" 
                                class="text-yellow-600 hover:text-yellow-900 px-2 py-1 rounded"
                                title="${user.isActive ? 'Deactivate' : 'Activate'} User">
                            <i class="fas fa-${user.isActive ? 'pause' : 'play'}"></i>
                        </button>
                        <button onclick="deleteUser(${user.id}, '${user.email}')" 
                                class="text-red-600 hover:text-red-900 px-2 py-1 rounded" 
                                title="Delete User">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

function renderPagination() {
    const totalPages = Math.ceil(totalUsers / usersPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    
    // Previous button
    const prevButton = document.createElement('button');
    prevButton.className = `relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? 'cursor-not-allowed' : 'hover:text-gray-700'}`;
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => {
        if (currentPage > 1) {
            loadUsers(currentPage - 1, document.getElementById('userSearch').value);
        }
    };
    pagination.appendChild(prevButton);
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
            i === currentPage 
                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' 
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
        }`;
        pageButton.textContent = i;
        pageButton.onclick = () => {
            if (i !== currentPage) {
                loadUsers(i, document.getElementById('userSearch').value);
            }
        };
        pagination.appendChild(pageButton);
    }
    
    // Next button
    const nextButton = document.createElement('button');
    nextButton.className = `relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === totalPages ? 'cursor-not-allowed' : 'hover:text-gray-700'}`;
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => {
        if (currentPage < totalPages) {
            loadUsers(currentPage + 1, document.getElementById('userSearch').value);
        }
    };
    pagination.appendChild(nextButton);
}

function updatePaginationInfo() {
    const startItem = (currentPage - 1) * usersPerPage + 1;
    const endItem = Math.min(currentPage * usersPerPage, totalUsers);
    
    document.getElementById('showingFrom').textContent = totalUsers > 0 ? startItem : 0;
    document.getElementById('showingTo').textContent = endItem;
    document.getElementById('totalUsersCount').textContent = totalUsers;
}

// User Management Functions
async function viewUser(userId) {
    try {
        showElement('loadingOverlay');
        const user = await apiCall(`/api/admin/users/${userId}`);
        showUserModal(user);
    } catch (error) {
        console.error('Failed to load user details:', error);
        showError('Failed to load user details');
    } finally {
        hideElement('loadingOverlay');
    }
}

function showUserModal(user) {
    const modal = document.getElementById('userModal');
    const content = document.getElementById('userModalContent');
    
    const statusBadge = user.isActive 
        ? '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>'
        : '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Inactive</span>';
        
    const adminBadge = user.isAdmin 
        ? '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 ml-2">Admin</span>'
        : '';
    
    content.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-900 mb-4">User Information</h4>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700">Full Name</label>
                    <p class="mt-1 text-sm text-gray-900">${user.firstName} ${user.lastName}</p>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <p class="mt-1 text-sm text-gray-900">${user.email}</p>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700">Status</label>
                    <div class="mt-1">${statusBadge}${adminBadge}</div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700">Marketing Consent</label>
                    <p class="mt-1 text-sm text-gray-900">${user.marketingConsent ? 'Yes' : 'No'}</p>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700">Registered</label>
                    <p class="mt-1 text-sm text-gray-900">${formatDate(user.createdAt)}</p>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700">Last Login</label>
                    <p class="mt-1 text-sm text-gray-900">${formatDate(user.lastLoginAt)}</p>
                </div>
            </div>
            
            <div class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h4>
                
                <div class="bg-gray-50 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-gray-700">Total CVs</span>
                        <span class="text-xl font-semibold text-gray-900">${user.cvCount || 0}</span>
                    </div>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-gray-700">Subscription Status</span>
                        <span class="text-sm text-gray-900">${user.subscriptionStatus || 'Free'}</span>
                    </div>
                </div>
                
                ${user.cvs && user.cvs.length > 0 ? `
                    <div>
                        <h5 class="text-md font-medium text-gray-900 mb-2">Recent CVs</h5>
                        <div class="space-y-2 max-h-40 overflow-y-auto">
                            ${user.cvs.slice(0, 5).map(cv => `
                                <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <span class="text-sm text-gray-900">${cv.title}</span>
                                    <span class="text-xs text-gray-500">${formatDateShort(cv.createdAt)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
        
        ${!user.isAdmin ? `
            <div class="mt-6 pt-6 border-t border-gray-200">
                <div class="flex space-x-3">
                    <button onclick="exportUser(${user.id})" 
                            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm">
                        <i class="fas fa-download mr-2"></i>Export Data
                    </button>
                    <button onclick="toggleUserStatus(${user.id}, ${!user.isActive})" 
                            class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm">
                        <i class="fas fa-${user.isActive ? 'pause' : 'play'} mr-2"></i>
                        ${user.isActive ? 'Deactivate' : 'Activate'} User
                    </button>
                    <button onclick="deleteUser(${user.id}, '${user.email}')" 
                            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm">
                        <i class="fas fa-trash mr-2"></i>Delete User
                    </button>
                </div>
            </div>
        ` : ''}
    `;
    
    modal.classList.add('show');
}

async function exportUser(userId) {
    try {
        showElement('loadingOverlay');
        const response = await apiCall(`/api/admin/users/${userId}/export`, {
            method: 'POST'
        });
        
        // Create and download the file
        const blob = new Blob([JSON.stringify(response.data, null, 2)], { 
            type: 'application/json' 
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `user-data-${userId}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showSuccess('User data exported successfully');
    } catch (error) {
        console.error('Failed to export user data:', error);
        showError('Failed to export user data');
    } finally {
        hideElement('loadingOverlay');
    }
}

async function toggleUserStatus(userId, activate) {
    try {
        showElement('loadingOverlay');
        const endpoint = activate ? 'reactivate' : 'deactivate';
        await apiCall(`/api/admin/users/${userId}/${endpoint}`, {
            method: 'POST'
        });
        
        showSuccess(`User ${activate ? 'activated' : 'deactivated'} successfully`);
        loadUsers(currentPage, document.getElementById('userSearch').value);
        
        // Close modal if open
        document.getElementById('userModal').classList.remove('show');
        
    } catch (error) {
        console.error('Failed to toggle user status:', error);
        showError('Failed to update user status');
    } finally {
        hideElement('loadingOverlay');
    }
}

function deleteUser(userId, userEmail) {
    // Show confirmation modal
    const modal = document.getElementById('confirmModal');
    const title = document.getElementById('confirmTitle');
    const message = document.getElementById('confirmMessage');
    const emailInput = document.getElementById('confirmEmailInput');
    const confirmEmail = document.getElementById('confirmEmail');
    
    title.textContent = 'Delete User Account';
    message.textContent = `This will permanently delete the user account and ALL associated data. This action cannot be undone.`;
    
    showElement('confirmEmailInput');
    confirmEmail.value = '';
    confirmEmail.placeholder = userEmail;
    
    modal.classList.add('show');
    
    // Set up confirmation action
    const confirmBtn = document.getElementById('confirmAction');
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    newConfirmBtn.onclick = async () => {
        if (confirmEmail.value !== userEmail) {
            showError('Email confirmation does not match');
            return;
        }
        
        try {
            showElement('loadingOverlay');
            modal.classList.remove('show');
            
            await apiCall(`/api/admin/users/${userId}`, {
                method: 'DELETE',
                body: JSON.stringify({ confirmEmail: userEmail })
            });
            
            showSuccess('User account deleted successfully');
            loadUsers(currentPage, document.getElementById('userSearch').value);
            
            // Close user modal if open
            document.getElementById('userModal').classList.remove('show');
            
        } catch (error) {
            console.error('Failed to delete user:', error);
            showError('Failed to delete user account');
        } finally {
            hideElement('loadingOverlay');
        }
    };
}

function showAdminDashboard() {
    hideElement('loginScreen');
    showElement('adminDashboard');
    
    // Update admin info
    document.getElementById('adminUserInfo').textContent = 
        `Logged in as ${currentUser.firstName} ${currentUser.lastName}`;
    
    // Load dashboard data
    loadDashboardStats();
    loadUsers();
}

// Search and Filter Functions
function setupSearch() {
    const searchInput = document.getElementById('userSearch');
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentPage = 1;
            loadUsers(1, e.target.value);
        }, 300);
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check for stored authentication
    checkStoredAuth();
    
    // Login form
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        const loginBtn = document.getElementById('loginBtn');
        const loginBtnText = document.getElementById('loginBtnText');
        const loginSpinner = document.getElementById('loginSpinner');
        
        // Show loading state
        loginBtnText.style.display = 'none';
        showElement('loginSpinner');
        loginBtn.disabled = true;
        
        try {
            await login(email, password);
            showAdminDashboard();
        } catch (error) {
            showError(error.message);
        } finally {
            // Reset button state
            loginBtnText.style.display = 'inline';
            hideElement('loginSpinner');
            loginBtn.disabled = false;
        }
    });
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Refresh users button
    document.getElementById('refreshUsers').addEventListener('click', () => {
        loadUsers(currentPage, document.getElementById('userSearch').value);
    });
    
    // Setup search functionality
    setupSearch();
    
    // Modal close buttons
    document.getElementById('closeUserModal').addEventListener('click', () => {
        document.getElementById('userModal').classList.remove('show');
    });
    
    document.getElementById('cancelConfirm').addEventListener('click', () => {
        document.getElementById('confirmModal').classList.remove('show');
    });
    
    // Close modals when clicking outside
    document.getElementById('userModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('userModal')) {
            document.getElementById('userModal').classList.remove('show');
        }
    });
    
    document.getElementById('confirmModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('confirmModal')) {
            document.getElementById('confirmModal').classList.remove('show');
        }
    });
});

// Global functions for onclick handlers
window.viewUser = viewUser;
window.exportUser = exportUser;
window.toggleUserStatus = toggleUserStatus;
window.deleteUser = deleteUser; 