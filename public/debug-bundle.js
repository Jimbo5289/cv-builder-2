// CV Builder Vercel Deployment Diagnostic Tool
(function() {
  console.log('=== CV Builder Vercel Diagnostic Tool ===');
  console.log('Running comprehensive diagnostics...');
  
  // Store diagnostic results
  const diagnostics = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    errors: [],
    warnings: [],
    environment: {},
    resourceLoading: {},
    domStatus: {},
    reactStatus: {}
  };
  
  // Check React initialization
  function checkReact() {
    console.log('Checking React initialization...');
    try {
      // Check if React is defined globally
      if (typeof React === 'undefined') {
        diagnostics.reactStatus.reactLoaded = false;
        diagnostics.errors.push('React is not defined globally');
        console.error('❌ React is not defined globally');
      } else {
        diagnostics.reactStatus.reactLoaded = true;
        diagnostics.reactStatus.reactVersion = React.version;
        console.log('✅ React is loaded, version:', React.version);
      }
      
      // Check if ReactDOM is defined
      if (typeof ReactDOM === 'undefined') {
        diagnostics.reactStatus.reactDomLoaded = false;
        diagnostics.errors.push('ReactDOM is not defined globally');
        console.error('❌ ReactDOM is not defined globally');
      } else {
        diagnostics.reactStatus.reactDomLoaded = true;
        diagnostics.reactStatus.reactDomVersion = ReactDOM.version;
        console.log('✅ ReactDOM is loaded, version:', ReactDOM.version);
      }
    } catch (e) {
      diagnostics.errors.push(`Error checking React: ${e.message}`);
      console.error('❌ Error checking React:', e);
    }
  }
  
  // Check bundle loading
  function checkBundleLoading() {
    console.log('Checking bundle loading...');
    try {
      const scripts = document.querySelectorAll('script');
      diagnostics.resourceLoading.scripts = Array.from(scripts).map(s => ({
        src: s.src,
        type: s.type,
        async: s.async,
        defer: s.defer
      }));
      
      // Check for vendor bundle
      const vendorBundle = Array.from(scripts).find(s => 
        s.src && (s.src.includes('vendor') || s.src.includes('chunk-vendors'))
      );
      diagnostics.resourceLoading.vendorBundleFound = !!vendorBundle;
      
      // Check for main bundle
      const mainBundle = Array.from(scripts).find(s => 
        s.src && (s.src.includes('main.') || s.src.includes('app.'))
      );
      diagnostics.resourceLoading.mainBundleFound = !!mainBundle;
      
      // Check network requests
      const resources = performance.getEntriesByType('resource');
      diagnostics.resourceLoading.networkRequests = resources.map(r => ({
        name: r.name,
        type: r.initiatorType,
        duration: Math.round(r.duration),
        size: r.transferSize,
        failed: r.transferSize === 0 && r.initiatorType !== 'navigation'
      }));
      
      // Check for failed requests
      const failedRequests = resources.filter(r => 
        r.transferSize === 0 && r.initiatorType !== 'navigation'
      );
      if (failedRequests.length > 0) {
        diagnostics.warnings.push(`${failedRequests.length} resources failed to load properly`);
        console.warn(`⚠️ ${failedRequests.length} resources failed to load properly`);
      }
    } catch (e) {
      diagnostics.errors.push(`Error checking bundle loading: ${e.message}`);
      console.error('❌ Error checking bundle loading:', e);
    }
  }
  
  // Check DOM status
  function checkDOM() {
    console.log('Checking DOM status...');
    try {
      // Check root element
      const rootElement = document.getElementById('root');
      diagnostics.domStatus.rootElementFound = !!rootElement;
      if (rootElement) {
        console.log('✅ Root element found');
        diagnostics.domStatus.rootElementContent = rootElement.innerHTML.substring(0, 200) + '...';
        diagnostics.domStatus.rootElementChildren = rootElement.childElementCount;
      } else {
        console.error('❌ Root element not found');
        diagnostics.errors.push('Root element #root not found');
      }
      
      // Check document structure
      diagnostics.domStatus.headElementCount = document.head.childElementCount;
      diagnostics.domStatus.bodyElementCount = document.body.childElementCount;
      
      // Check for CSS
      const styleSheets = document.styleSheets;
      diagnostics.domStatus.styleSheetCount = styleSheets.length;
      try {
        // Attempt to check if styles are being applied
        const computedStyles = window.getComputedStyle(document.body);
        diagnostics.domStatus.stylesApplied = computedStyles.backgroundColor !== '';
      } catch (e) {
        diagnostics.warnings.push(`Could not check computed styles: ${e.message}`);
      }
    } catch (e) {
      diagnostics.errors.push(`Error checking DOM: ${e.message}`);
      console.error('❌ Error checking DOM:', e);
    }
  }
  
  // Check environment variables
  function checkEnvironment() {
    console.log('Checking environment variables...');
    try {
      // Check window.ENV_* variables
      diagnostics.environment = {
        ENV_VITE_DEV_MODE: window.ENV_VITE_DEV_MODE || 'not set',
        ENV_VITE_SKIP_AUTH: window.ENV_VITE_SKIP_AUTH || 'not set',
        ENV_VITE_API_URL: window.ENV_VITE_API_URL || 'not set',
        NODE_ENV: window.NODE_ENV || 'not set',
        BASE_URL: window.BASE_URL || 'not set'
      };
      
      // Check process.env if available
      if (typeof process !== 'undefined' && process.env) {
        diagnostics.environment.process_env = {
          NODE_ENV: process.env.NODE_ENV || 'not set',
          VITE_DEV_MODE: process.env.VITE_DEV_MODE || 'not set',
          VITE_SKIP_AUTH: process.env.VITE_SKIP_AUTH || 'not set',
          VITE_API_URL: process.env.VITE_API_URL || 'not set'
        };
      } else {
        diagnostics.warnings.push('process.env is not available');
      }
    } catch (e) {
      diagnostics.errors.push(`Error checking environment: ${e.message}`);
      console.error('❌ Error checking environment:', e);
    }
  }
  
  // Check for console errors
  function checkConsoleErrors() {
    console.log('Checking for console errors...');
    if (window.consoleErrors && window.consoleErrors.length > 0) {
      diagnostics.errors.push(...window.consoleErrors.map(e => 
        typeof e === 'object' ? JSON.stringify(e) : String(e)
      ));
      console.log('❌ Console errors detected:', window.consoleErrors);
    } else {
      console.log('✅ No console errors detected so far');
    }
  }
  
  // Check localStorage
  function checkLocalStorage() {
    console.log('Checking localStorage...');
    try {
      localStorage.setItem('diagnostic_test', 'ok');
      const testValue = localStorage.getItem('diagnostic_test');
      diagnostics.domStatus.localStorageWorking = testValue === 'ok';
      localStorage.removeItem('diagnostic_test');
      console.log('✅ localStorage is working');
    } catch (e) {
      diagnostics.domStatus.localStorageWorking = false;
      diagnostics.errors.push(`localStorage not available: ${e.message}`);
      console.error('❌ localStorage not available:', e);
    }
  }
  
  // Create UI for diagnostic results
  function createDiagnosticUI() {
    console.log('Creating diagnostic UI...');
    try {
      const diagnosticButton = document.createElement('button');
      diagnosticButton.textContent = 'Show Deployment Diagnostics';
      diagnosticButton.style.position = 'fixed';
      diagnosticButton.style.bottom = '10px';
      diagnosticButton.style.right = '10px';
      diagnosticButton.style.zIndex = '9999';
      diagnosticButton.style.padding = '8px 12px';
      diagnosticButton.style.backgroundColor = '#3498db';
      diagnosticButton.style.color = 'white';
      diagnosticButton.style.border = 'none';
      diagnosticButton.style.borderRadius = '4px';
      diagnosticButton.style.cursor = 'pointer';
      
      diagnosticButton.addEventListener('click', function() {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.9)';
        overlay.style.color = 'white';
        overlay.style.padding = '20px';
        overlay.style.zIndex = '10000';
        overlay.style.overflow = 'auto';
        overlay.style.fontFamily = 'monospace';
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '10px';
        closeBtn.style.right = '10px';
        closeBtn.style.padding = '5px 10px';
        closeBtn.addEventListener('click', function() {
          document.body.removeChild(overlay);
        });
        
        const heading = document.createElement('h2');
        heading.textContent = 'CV Builder Vercel Deployment Diagnostics';
        heading.style.marginBottom = '20px';
        
        const errorCount = document.createElement('div');
        errorCount.style.backgroundColor = diagnostics.errors.length > 0 ? '#e74c3c' : '#2ecc71';
        errorCount.style.padding = '10px';
        errorCount.style.borderRadius = '4px';
        errorCount.style.marginBottom = '10px';
        errorCount.textContent = diagnostics.errors.length > 0 
          ? `⚠️ ${diagnostics.errors.length} errors detected` 
          : '✅ No errors detected';
        
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy Results';
        copyButton.style.padding = '8px 16px';
        copyButton.style.backgroundColor = '#2ecc71';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '4px';
        copyButton.style.marginTop = '10px';
        copyButton.style.cursor = 'pointer';
        copyButton.addEventListener('click', function() {
          navigator.clipboard.writeText(JSON.stringify(diagnostics, null, 2))
            .then(() => {
              copyButton.textContent = 'Copied!';
              setTimeout(() => {
                copyButton.textContent = 'Copy Results';
              }, 2000);
            })
            .catch(err => {
              console.error('Failed to copy:', err);
              copyButton.textContent = 'Copy Failed';
            });
        });
        
        const pre = document.createElement('pre');
        pre.textContent = JSON.stringify(diagnostics, null, 2);
        pre.style.backgroundColor = '#2c3e50';
        pre.style.padding = '10px';
        pre.style.borderRadius = '4px';
        pre.style.overflow = 'auto';
        pre.style.maxHeight = 'calc(100vh - 200px)';
        
        overlay.appendChild(closeBtn);
        overlay.appendChild(heading);
        overlay.appendChild(errorCount);
        overlay.appendChild(pre);
        overlay.appendChild(copyButton);
        document.body.appendChild(overlay);
      });
      
      document.body.appendChild(diagnosticButton);
    } catch (e) {
      console.error('❌ Error creating diagnostic UI:', e);
    }
  }
  
  // Run all checks
  function runAllChecks() {
    console.log('Running all diagnostic checks...');
    checkEnvironment();
    checkDOM();
    checkBundleLoading();
    checkLocalStorage();
    checkConsoleErrors();
    
    // Only check React if the page has loaded completely
    window.addEventListener('load', function() {
      // Delayed check for React
      setTimeout(function() {
        checkReact();
        createDiagnosticUI();
        console.log('All diagnostics completed. Results:', diagnostics);
      }, 1000);
    });
  }
  
  // Capture console errors
  const originalConsoleError = console.error;
  window.consoleErrors = [];
  console.error = function() {
    window.consoleErrors.push(Array.from(arguments));
    originalConsoleError.apply(console, arguments);
  };
  
  // Start diagnostics
  runAllChecks();
})(); 