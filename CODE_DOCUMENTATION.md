# CV Builder Code Documentation

This document explains the code documentation process for the CV Builder application.

## Documentation Overview

The CV Builder codebase uses a standardized documentation approach with JSDoc-style comment blocks. Each file includes documentation that helps developers understand:

1. What the component/page/utility does
2. How it works
3. Its inputs and outputs
4. Usage examples

## Documentation Standards

### Components

Components use this documentation template:

```jsx
/**
 * @component ComponentName
 * @description Detailed description of what this component does and its role in the application
 * 
 * @props {PropType} propName - Description of prop
 * [Add more props as needed]
 * 
 * @example
 * // Basic usage example
 * <ComponentName propName={value} />
 * 
 * @returns {JSX.Element} Description of what is rendered
 */
```

### Pages

Pages use this documentation template:

```jsx
/**
 * @page PageName
 * @description Detailed description of this page, its purpose, and key features
 * 
 * @route /route-path - The route that renders this page
 * 
 * @param {ParamType} paramName - Description of route/query parameter
 * [Add more parameters as needed]
 * 
 * @context Lists contexts used by this page
 * @hooks Lists custom hooks used by this page
 * 
 * @returns {JSX.Element} The page component
 */
```

### Contexts

Contexts use this documentation template:

```jsx
/**
 * @context ContextName
 * @description Detailed description of what this context provides and its purpose
 * 
 * @property {PropType} propertyName - Description of context property
 * [Add more properties as needed]
 * 
 * @function functionName - Description of context function
 * [Add more functions as needed]
 * 
 * @example
 * // Example of how to use this context
 * const { propertyName, functionName } = useContext(ContextName);
 */
```

### Hooks

Custom hooks use this documentation template:

```jsx
/**
 * @hook useHookName
 * @description Detailed description of what this hook does, when to use it, and its purpose
 * 
 * @param {ParamType} paramName - Description of parameter
 * [Add more parameters as needed]
 * 
 * @returns {ReturnType} Description of what is returned
 * 
 * @example
 * // Example of how to use this hook
 * const result = useHookName(param);
 */
```

### Utilities

Utility functions use this documentation template:

```jsx
/**
 * @utility UtilityName
 * @description Detailed description of what this utility does and its purpose
 * 
 * @param {ParamType} paramName - Description of parameter
 * [Add more parameters as needed]
 * 
 * @returns {ReturnType} Description of what is returned
 * 
 * @example
 * // Example of how to use this utility
 * const result = utilityName(param);
 */
```

## Automated Documentation Tool

The project includes a documentation script (`document-codebase.js`) that can automatically add documentation templates to files. This script:

1. Scans for files that don't have documentation
2. Adds appropriate documentation templates based on file type and location
3. Preserves existing ESLint comments

### Using the Documentation Tool

To use the tool:

```bash
# Make the script executable
chmod +x document-codebase.js

# Document the entire codebase
node document-codebase.js

# Show what would be documented without making changes
node document-codebase.js --dry-run

# Document only a specific directory
node document-codebase.js --dir=src/components

# Document only component files
node document-codebase.js --component

# Document only page files
node document-codebase.js --page

# Show help
node document-codebase.js --help
```

## Tips for Good Documentation

When filling in the documentation templates:

1. **Be specific** - Explain exactly what the code does, not just what it is
2. **Include examples** - Show how to use components, hooks, and utilities
3. **Document props** - For components, document all props, including types and default values
4. **Note dependencies** - Mention contexts, hooks, or external libraries the code depends on
5. **Explain key logic** - Comment complex logic within functions
6. **Keep it updated** - Update documentation when code changes

## Documentation Flow

The recommended process for documenting code is:

1. Run the documentation script to add templates
2. Fill in the templates with specific details
3. Add additional inline comments for complex logic
4. Review documentation for completeness
5. Update documentation when making significant changes

## Recommended VS Code Extensions

For better documentation experience:

- **Better Comments**: Highlights different types of comments
- **Document This**: Generates JSDoc comments
- **ESLint**: Helps maintain consistent code and comment style 