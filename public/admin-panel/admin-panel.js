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

    console.log('Making API call:', {
        url: url,
        method: config.method || 'GET',
        hasAuth: !!authToken,
        authTokenLength: authToken ? authToken.length : 0
    });

    try {
        const response = await fetch(url, config);
        
        console.log('API response status:', response.status);
        console.log('API response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Network error' }));
            console.error('API error response:', errorData);
            throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
        }

        const responseData = await response.json();
        console.log('API success response:', responseData);
        return responseData;
    } catch (error) {
        console.error('API call failed:', error);
        console.error('API call details:', {
            url: url,
            method: config.method || 'GET',
            error: error.message,
            stack: error.stack
        });
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

        // Handle the actual backend response structure
        if (response.accessToken && response.user) {
            // Check if user has admin privileges
            const isAdmin = response.user.email === 'jamesingleton1971@gmail.com' || response.user.isAdmin;
            
            if (!isAdmin) {
                throw new Error('Access denied. Admin privileges required.');
            }
            
            authToken = response.accessToken;
            currentUser = response.user;
            localStorage.setItem('adminToken', authToken);
            localStorage.setItem('adminUser', JSON.stringify(currentUser));
            return true;
        } else {
            throw new Error('Invalid login response from server.');
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
        
        // Handle the actual backend response structure
        document.getElementById('totalUsers').textContent = stats.users?.total || 0;
        document.getElementById('activeUsers').textContent = stats.users?.active || 0;
        document.getElementById('totalCVs').textContent = stats.cvs?.total || 0;
        document.getElementById('activeSubscriptions').textContent = stats.subscriptions?.active || 0;
        
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
        
        // Handle the actual backend response structure
        allUsers = response.users || [];
        filteredUsers = allUsers;
        totalUsers = response.pagination?.total || 0;
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
    // Clear existing content safely
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    
    filteredUsers.forEach(user => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        
        // Create status badge
        const statusBadge = document.createElement('span');
        statusBadge.className = `px-2 py-1 text-xs font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`;
        statusBadge.textContent = user.isActive ? 'Active' : 'Inactive';
        
        // Create admin badge if applicable
        const adminBadge = (user.email === 'jamesingleton1971@gmail.com' || user.isAdmin) ? 
            (() => {
                const badge = document.createElement('span');
                badge.className = 'px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 ml-2';
                badge.textContent = 'Admin';
                return badge;
            })() : null;
            
        // Create marketing consent icon
        const marketingIcon = document.createElement('i');
        marketingIcon.className = user.marketingConsent ? 'fas fa-check text-green-500' : 'fas fa-times text-red-500';
        
        // Handle name display safely
        const displayName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A';
        
        // Create table cells
        const nameCell = document.createElement('td');
        nameCell.className = 'px-6 py-4 whitespace-nowrap';
        
        const nameContainer = document.createElement('div');
        nameContainer.className = 'flex items-center';
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'flex-shrink-0 h-10 w-10';
        const avatarInner = document.createElement('div');
        avatarInner.className = 'h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center';
        const avatarIcon = document.createElement('i');
        avatarIcon.className = 'fas fa-user text-gray-600';
        avatarInner.appendChild(avatarIcon);
        avatarDiv.appendChild(avatarInner);
        
        const textDiv = document.createElement('div');
        textDiv.className = 'ml-4';
        const nameDiv = document.createElement('div');
        nameDiv.className = 'text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600';
        nameDiv.textContent = displayName;
        nameDiv.onclick = () => viewUser(user.id);
        nameDiv.title = 'Click to view user details';
        const emailDiv = document.createElement('div');
        emailDiv.className = 'text-sm text-gray-500';
        emailDiv.textContent = user.email;
        textDiv.appendChild(nameDiv);
        textDiv.appendChild(emailDiv);
        
        nameContainer.appendChild(avatarDiv);
        nameContainer.appendChild(textDiv);
        nameCell.appendChild(nameContainer);
        
        // Status cell
        const statusCell = document.createElement('td');
        statusCell.className = 'px-6 py-4 whitespace-nowrap';
        statusCell.appendChild(statusBadge);
        if (adminBadge) {
            statusCell.appendChild(adminBadge);
        }
        
        // Created date cell
        const createdCell = document.createElement('td');
        createdCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-500';
        createdCell.textContent = formatDateShort(user.createdAt);
        
        // Last login cell
        const loginCell = document.createElement('td');
        loginCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-500';
        loginCell.textContent = formatDateShort(user.lastLogin);
        
        // CVs count cell
        const cvsCell = document.createElement('td');
        cvsCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-500';
        cvsCell.textContent = user._count?.cvs || 0;
        
        // Marketing consent cell
        const marketingCell = document.createElement('td');
        marketingCell.className = 'px-6 py-4 whitespace-nowrap text-center text-sm';
        marketingCell.appendChild(marketingIcon);
        
        // Actions cell
        const actionsCell = document.createElement('td');
        actionsCell.className = 'px-6 py-4 whitespace-nowrap text-right text-sm font-medium';
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'flex space-x-2';
        
        // View button
        const viewBtn = document.createElement('button');
        viewBtn.className = 'text-blue-600 hover:text-blue-900 px-2 py-1 rounded';
        viewBtn.onclick = () => viewUser(user.id);
        const viewIcon = document.createElement('i');
        viewIcon.className = 'fas fa-eye';
        viewBtn.appendChild(viewIcon);
        actionsDiv.appendChild(viewBtn);
        
        // Export button
        const exportBtn = document.createElement('button');
        exportBtn.className = 'text-green-600 hover:text-green-900 px-2 py-1 rounded';
        exportBtn.title = 'Export Data';
        exportBtn.onclick = () => exportUser(user.id);
        const exportIcon = document.createElement('i');
        exportIcon.className = 'fas fa-download';
        exportBtn.appendChild(exportIcon);
        actionsDiv.appendChild(exportBtn);
        
        // Only add toggle/delete buttons for non-admin users
        if (!adminBadge) {
            // Toggle status button
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'text-yellow-600 hover:text-yellow-900 px-2 py-1 rounded';
            toggleBtn.title = user.isActive ? 'Deactivate User' : 'Activate User';
            toggleBtn.onclick = () => toggleUserStatus(user.id, !user.isActive);
            const toggleIcon = document.createElement('i');
            toggleIcon.className = `fas fa-${user.isActive ? 'pause' : 'play'}`;
            toggleBtn.appendChild(toggleIcon);
            actionsDiv.appendChild(toggleBtn);
            
            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'text-red-600 hover:text-red-900 px-2 py-1 rounded';
            deleteBtn.title = 'Delete User';
            deleteBtn.onclick = () => deleteUser(user.id, user.email);
            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'fas fa-trash';
            deleteBtn.appendChild(deleteIcon);
            actionsDiv.appendChild(deleteBtn);
        }
        
        actionsCell.appendChild(actionsDiv);
        
        // Append all cells to row
        row.appendChild(nameCell);
        row.appendChild(statusCell);
        row.appendChild(createdCell);
        row.appendChild(loginCell);
        row.appendChild(cvsCell);
        row.appendChild(marketingCell);
        row.appendChild(actionsCell);
        
        tbody.appendChild(row);
    });
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    // Clear existing pagination safely
    while (pagination.firstChild) {
        pagination.removeChild(pagination.firstChild);
    }
    
    const totalPages = Math.ceil(totalUsers / usersPerPage);
    
    // Previous button
    const prevButton = document.createElement('button');
    prevButton.className = `px-3 py-2 rounded-md text-sm font-medium ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`;
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => !prevButton.disabled && loadUsers(currentPage - 1, document.getElementById('userSearch').value);
    
    const prevIcon = document.createElement('i');
    prevIcon.className = 'fas fa-chevron-left';
    prevButton.appendChild(prevIcon);
    pagination.appendChild(prevButton);
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `px-3 py-2 rounded-md text-sm font-medium ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`;
        pageButton.textContent = i;
        pageButton.onclick = () => loadUsers(i, document.getElementById('userSearch').value);
        pagination.appendChild(pageButton);
    }
    
    // Next button
    const nextButton = document.createElement('button');
    nextButton.className = `px-3 py-2 rounded-md text-sm font-medium ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`;
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => !nextButton.disabled && loadUsers(currentPage + 1, document.getElementById('userSearch').value);
    
    const nextIcon = document.createElement('i');
    nextIcon.className = 'fas fa-chevron-right';
    nextButton.appendChild(nextIcon);
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
        console.log('ViewUser called with userId:', userId);
        console.log('Current authToken:', authToken ? 'Present' : 'Missing');
        console.log('API_BASE_URL:', API_BASE_URL);
        
        showElement('loadingOverlay');
        const response = await apiCall(`/api/admin/users/${userId}`);
        console.log('User detail response:', response);
        
        const user = response.user || response; // Handle different response formats
        console.log('Processed user data:', user);
        
        showUserModal(user);
    } catch (error) {
        console.error('Failed to load user details:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            userId: userId,
            authToken: authToken ? 'Present' : 'Missing'
        });
        showError(`Failed to load user details: ${error.message}`);
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
        
    const adminBadge = (user.email === 'jamesingleton1971@gmail.com' || user.isAdmin)
        ? '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 ml-2">Admin</span>'
        : '';
    
    const displayName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A';
    
    content.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-900 mb-4">User Information</h4>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700">Full Name</label>
                    <p class="mt-1 text-sm text-gray-900">${displayName}</p>
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
                    <p class="mt-1 text-sm text-gray-900">${formatDate(user.lastLogin)}</p>
                </div>
            </div>
            
            <div class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h4>
                
                <div class="bg-gray-50 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-gray-700">Total CVs</span>
                        <span class="text-xl font-semibold text-gray-900">${user.cvs?.length || 0}</span>
                    </div>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-gray-700">Subscriptions</span>
                        <span class="text-sm text-gray-900">${user.subscriptions?.length || 0}</span>
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
        
        ${!adminBadge ? `
            <div class="mt-6 pt-6 border-t border-gray-200">
                <div class="flex space-x-3">
                    <button onclick="exportUser('${user.id}')" 
                            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm">
                        <i class="fas fa-download mr-2"></i>Export Data
                    </button>
                    <button onclick="toggleUserStatus('${user.id}', ${!user.isActive})" 
                            class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm">
                        <i class="fas fa-${user.isActive ? 'pause' : 'play'} mr-2"></i>
                        ${user.isActive ? 'Deactivate' : 'Activate'} User
                    </button>
                    <button onclick="deleteUser('${user.id}', '${user.email}')" 
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
    const displayName = currentUser.name || `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.email;
    document.getElementById('adminUserInfo').textContent = `Logged in as ${displayName}`;
    
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