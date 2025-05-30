// Debug utility for CV Builder
(function() {
    console.log('=== CV Builder Diagnostic Tool ===');
    
    // Check if the DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        console.log('✅ DOM loaded successfully');
    });
    
    // Check if the root element exists
    window.addEventListener('load', function() {
        const rootElement = document.getElementById('root');
        if (rootElement) {
            console.log('✅ #root element found');
            console.log('Root element contents:', rootElement.innerHTML.substring(0, 100) + '...');
        } else {
            console.error('❌ #root element not found - this will prevent React from rendering');
        }
        
        // Check environment variables
        const envVars = {
            'VITE_DEV_MODE': window.ENV_VITE_DEV_MODE || process.env.VITE_DEV_MODE,
            'VITE_SKIP_AUTH': window.ENV_VITE_SKIP_AUTH || process.env.VITE_SKIP_AUTH,
            'VITE_API_URL': window.ENV_VITE_API_URL || process.env.VITE_API_URL
        };
        
        console.log('Environment variables:', envVars);
        
        // Try to fetch API health endpoint
        fetch('/api/health')
            .then(response => {
                console.log(`✅ API health check: ${response.status}`);
                return response.json().catch(() => 'No JSON response');
            })
            .then(data => {
                console.log('API response:', data);
            })
            .catch(error => {
                console.error('❌ API health check failed:', error);
                console.log('This could indicate your backend is not running or not accessible');
            });
            
        // Check for any console errors
        if (window.consoleErrors && window.consoleErrors.length > 0) {
            console.log('❌ Console errors detected:', window.consoleErrors);
        } else {
            console.log('✅ No console errors detected so far');
        }
        
        // Check local storage
        try {
            const theme = localStorage.getItem('theme');
            console.log('✅ localStorage accessible, theme setting:', theme);
        } catch (e) {
            console.error('❌ localStorage not accessible:', e);
        }
    });
    
    // Capture console errors
    window.consoleErrors = [];
    const originalConsoleError = console.error;
    console.error = function() {
        window.consoleErrors.push(Array.from(arguments));
        originalConsoleError.apply(console, arguments);
    };
    
    console.log('Diagnostic tool initialized');
})(); 