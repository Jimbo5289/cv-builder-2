// Debug version of admin panel role logic
// Add this to the browser console to debug role badges

function debugRoleBadges() {
    console.log('🔍 Debugging role badges...');
    
    // Check if users data has roles
    if (typeof filteredUsers !== 'undefined') {
        console.log('📊 Current filteredUsers:', filteredUsers);
        
        filteredUsers.forEach((user, index) => {
            console.log(`User ${index + 1}:`, {
                email: user.email,
                hasRole: user.hasOwnProperty('role'),
                roleValue: user.role,
                fullUser: user
            });
        });
    } else {
        console.log('❌ filteredUsers not found - try loading users first');
    }
    
    // Check if role badges exist in DOM
    const statusCells = document.querySelectorAll('td:nth-child(2)'); // Status column
    console.log(`📋 Found ${statusCells.length} status cells`);
    
    statusCells.forEach((cell, index) => {
        const badges = cell.querySelectorAll('span');
        console.log(`Status cell ${index + 1}:`, {
            badgeCount: badges.length,
            badgeTexts: Array.from(badges).map(b => b.textContent),
            innerHTML: cell.innerHTML
        });
    });
}

// Run this in browser console after loading admin panel
console.log('💡 Debug tool loaded. Run debugRoleBadges() in console to analyze.');

// Test role badge creation manually
function testRoleBadgeCreation() {
    console.log('🧪 Testing role badge creation...');
    
    const testUsers = [
        { email: 'test@example.com', role: 'user' },
        { email: 'admin@example.com', role: 'admin' },
        { email: 'jamesingleton1971@gmail.com', role: 'superuser' }
    ];
    
    testUsers.forEach(user => {
        console.log(`Testing user: ${user.email} (${user.role})`);
        
        const roleBadge = (() => {
            const badge = document.createElement('span');
            badge.className = 'px-2 py-1 text-xs font-semibold rounded-full ml-2';
            
            if (user.role === 'superuser') {
                badge.className += ' bg-purple-100 text-purple-800';
                badge.textContent = '👑 Superuser';
            } else if (user.role === 'admin' || user.email === 'jamesingleton1971@gmail.com') {
                badge.className += ' bg-blue-100 text-blue-800';
                badge.textContent = '🛡️ Admin';
            } else {
                badge.className += ' bg-gray-100 text-gray-800';
                badge.textContent = '👤 User';
            }
            
            return badge;
        })();
        
        console.log(`Created badge:`, {
            text: roleBadge.textContent,
            className: roleBadge.className,
            element: roleBadge
        });
    });
} 