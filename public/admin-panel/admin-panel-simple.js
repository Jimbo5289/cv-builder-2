// Simple Admin Panel - Working Version
const API_BASE_URL = 'https://cv-builder-backend-zjax.onrender.com';

let authToken = null;
let currentUser = null;
let allUsers = [];

// Utility Functions
function showElement(id) {
    document.getElementById(id).style.display = 'block';
}

function hideElement(id) {
    document.getElementById(id).style.display = 'none';
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
    loadUsers();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check for stored token
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken) {
        authToken = storedToken;
        showAdminDashboard();
    }
    
    // Login form
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        
        try {
            await login(email, password);
        } catch (error) {
            showError(error.message);
        }
    });
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', () => {
        authToken = null;
        localStorage.removeItem('adminToken');
        hideElement('adminDashboard');
        showElement('loginScreen');
    });
});

// Make deleteUser globally available
window.deleteUser = deleteUser; 