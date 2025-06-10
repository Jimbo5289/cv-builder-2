/**
 * Utility to mark variables as intentionally unused
 * Use this to suppress "unused variable" warnings from ESLint
 * 
 * @param {any} variable - The variable to mark as intentionally unused
 */
export const markUnused = (variable) => {
  // This function does nothing but suppress linting errors
  // eslint-disable-next-line no-unused-expressions
  variable;
  return;
};

/**
 * Utility to mark multiple variables as intentionally unused
 * 
 * @param {Array<any>} variables - The variables to mark as intentionally unused
 */
export const markAllUnused = (...variables) => {
  variables.forEach(markUnused);
}; 