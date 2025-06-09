/**
 * Utility functions for safely handling DOM operations
 */

/**
 * Check if we're running in a browser environment
 * @returns {boolean} True if in browser, false otherwise
 */
export const isBrowser = () => {
  return typeof window !== 'undefined' && 
         typeof document !== 'undefined' &&
         window.document === document;
};

/**
 * Safely get a DOM element by ID
 * @param {string} id - Element ID to find
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} delay - Delay between retries in ms
 * @returns {Promise<Element|null>} The found element or null
 */
export const getDomElementById = (id, maxRetries = 5, delay = 100) => {
  return new Promise((resolve) => {
    // Immediately check if element exists
    const element = document.getElementById(id);
    if (element) {
      resolve(element);
      return;
    }

    let retries = 0;
    
    // Function to retry getting the element
    const findElement = () => {
      const element = document.getElementById(id);
      if (element) {
        // Found it!
        resolve(element);
        return;
      }
      
      // Retry if we haven't reached max retries
      if (retries < maxRetries) {
        retries++;
        setTimeout(findElement, delay);
      } else {
        // Couldn't find element after max retries
        console.warn(`Element with ID '${id}' not found after ${maxRetries} attempts`);
        resolve(null);
      }
    };
    
    // Start the retry process
    setTimeout(findElement, delay);
  });
};

/**
 * Safely insert an element into the DOM
 * @param {string} parentSelector - CSS selector for parent element
 * @param {Element} element - Element to insert
 * @param {string} position - Position to insert ('beforebegin', 'afterbegin', 'beforeend', 'afterend')
 * @returns {boolean} Success status
 */
export const safelyInsertElement = (parentSelector, element, position = 'beforeend') => {
  try {
    const parent = document.querySelector(parentSelector);
    if (!parent) {
      console.warn(`Parent element '${parentSelector}' not found`);
      return false;
    }
    
    parent.insertAdjacentElement(position, element);
    return true;
  } catch (e) {
    console.error('Error inserting element:', e);
    return false;
  }
};

/**
 * Create a root element if it doesn't exist
 * @returns {Element|null} The root element or null if creation failed
 */
export const ensureRootElement = () => {
  try {
    let rootElement = document.getElementById('root');
    
    // If root element doesn't exist, create it
    if (!rootElement) {
      console.log('Root element not found, creating one');
      rootElement = document.createElement('div');
      rootElement.id = 'root';
      
      // Try to append to body
      if (document.body) {
        document.body.appendChild(rootElement);
        console.log('Root element created and appended to body');
      } else {
        console.error('Cannot append root element - document.body not available');
        return null;
      }
    }
    
    return rootElement;
  } catch (e) {
    console.error('Error ensuring root element:', e);
    return null;
  }
};

/**
 * Safely execute a function when DOM is ready
 * @param {Function} callback - Function to execute
 */
export const onDomReady = (callback) => {
  if (!isBrowser()) {
    console.warn('Not in browser environment');
    return;
  }
  
  try {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      // DOM already ready, execute callback after a small delay
      setTimeout(callback, 1);
    } else {
      // Wait for DOMContentLoaded event
      document.addEventListener('DOMContentLoaded', callback);
    }
  } catch (e) {
    console.error('Error in onDomReady:', e);
  }
}; 