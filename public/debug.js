// Debug utility for CV Builder
(function() {
    console.log('=== CV Builder Diagnostic Tool ===');
    console.log('Version: 1.1 - Enhanced Diagnostics');

    // Check browser compatibility
    const browserInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        vendor: navigator.vendor,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled
    };
    console.log('Browser info:', browserInfo);
    
    // Check if the DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        console.log('✅ DOM loaded successfully');
    });
    
    // Collect and log potential errors
    window.errors = [];
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Unhandled promise rejection:', event.reason);
        window.errors.push({
            type: 'promise',
            message: event.reason?.message || String(event.reason),
            stack: event.reason?.stack,
            timestamp: new Date().toISOString()
        });
    });
    
    // Check if the root element exists
    window.addEventListener('load', function() {
        // List files successfully loaded
        const resourceList = performance.getEntriesByType('resource');
        console.log(`${resourceList.length} resources loaded:`, 
            resourceList.map(r => ({
                name: r.name.split('/').pop(),
                duration: Math.round(r.duration),
                size: r.transferSize
            }))
        );
        
        // Check root element
        const rootElement = document.getElementById('root');
        if (rootElement) {
            console.log('✅ #root element found');
            console.log('Root element contents:', rootElement.innerHTML.substring(0, 100) + '...');
        } else {
            console.error('❌ #root element not found - this will prevent React from rendering');
        }
        
        // Check main script load
        const mainScript = document.querySelector('script[src*="main.jsx"]');
        if (mainScript) {
            console.log('✅ Main script tag found in document');
        } else {
            console.error('❌ Main script tag not found in document');
        }
        
        // Check environment variables
        const envVars = {
            'window.ENV_VITE_DEV_MODE': window.ENV_VITE_DEV_MODE,
            'window.ENV_VITE_SKIP_AUTH': window.ENV_VITE_SKIP_AUTH,
            'window.ENV_VITE_API_URL': window.ENV_VITE_API_URL,
            'process.env.VITE_DEV_MODE': typeof process !== 'undefined' ? process.env?.VITE_DEV_MODE : 'process not defined',
            'process.env.VITE_SKIP_AUTH': typeof process !== 'undefined' ? process.env?.VITE_SKIP_AUTH : 'process not defined',
            'process.env.VITE_API_URL': typeof process !== 'undefined' ? process.env?.VITE_API_URL : 'process not defined'
        };
        
        console.log('Environment variables:', envVars);
        
        // Try to fetch API health endpoint
        console.log('Checking API connectivity...');
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
        
        // Check for unhandled promise rejections
        if (window.errors && window.errors.length > 0) {
            console.log('❌ Unhandled promise rejections detected:', window.errors);
        } else {
            console.log('✅ No unhandled promise rejections detected');
        }
        
        // Check local storage
        try {
            const theme = localStorage.getItem('theme');
            console.log('✅ localStorage accessible, theme setting:', theme);
            
            // Try setting a test value
            localStorage.setItem('debug_test', 'ok');
            const testValue = localStorage.getItem('debug_test');
            if (testValue === 'ok') {
                console.log('✅ localStorage write/read test passed');
                localStorage.removeItem('debug_test');
            } else {
                console.error('❌ localStorage write/read test failed');
            }
        } catch (e) {
            console.error('❌ localStorage not accessible:', e);
        }
        
        // Add a diagnostic UI button
        const debugButton = document.createElement('button');
        debugButton.textContent = 'Show Diagnostics';
        debugButton.style.position = 'fixed';
        debugButton.style.bottom = '10px';
        debugButton.style.right = '10px';
        debugButton.style.zIndex = '9999';
        debugButton.style.padding = '8px 12px';
        debugButton.style.backgroundColor = '#3498db';
        debugButton.style.color = 'white';
        debugButton.style.border = 'none';
        debugButton.style.borderRadius = '4px';
        debugButton.style.cursor = 'pointer';
        
        debugButton.addEventListener('click', function() {
            const diagnosticInfo = {
                timestamp: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent,
                screenSize: `${window.innerWidth}x${window.innerHeight}`,
                errors: window.errors || [],
                consoleErrors: window.consoleErrors || [],
                environment: envVars,
                localStorage: {
                    available: !!window.localStorage,
                    theme: localStorage.getItem('theme')
                },
                rootElement: !!rootElement,
                mainScript: !!mainScript
            };
            
            // Create diagnostic output
            const output = document.createElement('div');
            output.style.position = 'fixed';
            output.style.top = '0';
            output.style.left = '0';
            output.style.width = '100%';
            output.style.height = '100%';
            output.style.backgroundColor = 'rgba(0,0,0,0.9)';
            output.style.color = 'white';
            output.style.padding = '20px';
            output.style.zIndex = '10000';
            output.style.overflow = 'auto';
            output.style.fontFamily = 'monospace';
            
            const closeBtn = document.createElement('button');
            closeBtn.textContent = 'Close';
            closeBtn.style.position = 'absolute';
            closeBtn.style.top = '10px';
            closeBtn.style.right = '10px';
            closeBtn.style.padding = '5px 10px';
            closeBtn.addEventListener('click', function() {
                document.body.removeChild(output);
            });
            
            const pre = document.createElement('pre');
            pre.textContent = JSON.stringify(diagnosticInfo, null, 2);
            
            output.appendChild(closeBtn);
            output.appendChild(pre);
            document.body.appendChild(output);
            
            // Copy to clipboard
            navigator.clipboard.writeText(JSON.stringify(diagnosticInfo))
                .then(() => {
                    console.log('Diagnostic info copied to clipboard');
                })
                .catch(err => {
                    console.error('Failed to copy diagnostic info:', err);
                });
        });
        
        document.body.appendChild(debugButton);
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