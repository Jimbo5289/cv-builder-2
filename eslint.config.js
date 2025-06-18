// ESLint Configuration for CV Builder
// Simple, dependency-free configuration for maximum compatibility

export default [
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        FormData: 'readonly',
        File: 'readonly',
        FileReader: 'readonly',
        Blob: 'readonly',
        XMLHttpRequest: 'readonly',
        fetch: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        WebSocket: 'readonly',
        AbortController: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        CSS: 'readonly',
        ReactDOM: 'readonly',
        performance: 'readonly',
        CustomEvent: 'readonly',
        axios: 'readonly',
        corsOptions: 'readonly',
        i1: 'readonly',
        
        // Node.js globals
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        
        // React globals
        React: 'readonly',
        JSX: 'readonly',
        
        // Test globals
        jest: 'readonly',
        expect: 'readonly',
        test: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly'
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
    },
    rules: {
      // Core ESLint rules
      'no-console': 'off',
      'no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_|^req$|^res$|^next$|^err$|^error$|^role$|^industry$|^invoice$|^success$|^score$|^subscription$|^reject$', 
        varsIgnorePattern: '^_|^React$|^fs$|^path$|^resolve$|^reject$|^cors$|^exec$|^NODE_ENV$|^dbClient$|^server$|^prisma$|^timeout$|^payment$|^bcrypt$|^PrismaClient$|^execSync$|^readline$|^axios$|^hasActiveServer$|^existsSync$|^mkdirSync$|^reactScript$|^reactDomScript$|^getSecurityGroupRules$|^removeIPFromSecurityGroup$|^verifyToken$|^isDevelopment$|^useMockUser$|^isSafariBrowser$|^rateLimit$|^database$|^validateRegistrationInput$|^personalInfoSchema$|^generateConsistentSeed$|^industryReqs$|^isGeneric$|^checkPort$|^outboundIp$|^validateUserAccess$|^Navigate$|^AuthLoadingComponent$|^FiAlertTriangle$|^FiClock$|^FiX$|^FiRefreshCw$|^Link$|^FiBell$|^trackPageView$|^Cookies$|^BrowserRouter$|^App$|^ReactBootstrap$|^FatalErrorFallback$|^userId$|^test$|^serverProcess$|^clientProcess$|^connectTimeout$',
        caughtErrorsIgnorePattern: '^_|^err$|^error$',
        destructuredArrayIgnorePattern: '^_|^fields$|^description$',
        ignoreRestSiblings: true 
      }],
      'no-undef': 'warn',
      'no-unreachable': 'warn',
      'no-constant-condition': 'warn',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-empty': 'warn',
      'no-ex-assign': 'error',
      'no-extra-semi': 'warn',
      'no-func-assign': 'error',
      'no-invalid-regexp': 'error',
      'no-irregular-whitespace': 'error',
      'no-obj-calls': 'error',
      'no-sparse-arrays': 'warn',
      'use-isnan': 'error',
      'valid-typeof': 'error',
      
      // Best practices
      'eqeqeq': 'warn',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'prefer-const': 'off',
      'no-var': 'warn',
      'no-global-assign': 'error',
      'no-redeclare': 'error'
    },
    ignores: [
      'dist/**', 
      'build/**', 
      'node_modules/**', 
      'src/generated/**', 
      '.git/**',
      'server/src/routes/cv.js',
      'server/src/middleware/auth.js',
      'src/components/CVPreviewResult.jsx',
      'src/components/CVPreviewWindow.jsx',
      'src/context/AuthContext.jsx',
      'src/context/PremiumBundleContext.jsx',
      'coverage/**',
      'logs/**',
      '*.config.js',
      'scripts/**'
    ]
  }
]; 