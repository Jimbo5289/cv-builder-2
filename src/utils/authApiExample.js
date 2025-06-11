// Example file showing how to use the API configuration with axios
import api, { apiConfig } from './api';

/**
 * Authentication API functions using the configured axios instance
 */

// User login function
export const loginUser = async (email, password) => {
  try {
    const response = await api.post(apiConfig.auth.login, { 
      email, 
      password 
    });
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

// User signup function
export const signupUser = async (userData) => {
  try {
    const response = await api.post(apiConfig.auth.signup, userData);
    return response.data;
  } catch (error) {
    console.error('Signup error:', error.response?.data || error.message);
    throw error;
  }
};

// Logout function
export const logoutUser = async () => {
  try {
    const response = await api.post(apiConfig.auth.logout);
    return response.data;
  } catch (error) {
    console.error('Logout error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * CV-related API functions
 */

// Get all CVs for the current user
export const getAllCVs = async () => {
  try {
    const response = await api.get(apiConfig.cv.getAll);
    return response.data;
  } catch (error) {
    console.error('Error fetching CVs:', error.response?.data || error.message);
    throw error;
  }
};

// Get a specific CV by ID
export const getCVById = async (cvId) => {
  try {
    const response = await api.get(apiConfig.cv.getById(cvId));
    return response.data;
  } catch (error) {
    console.error(`Error fetching CV ${cvId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Create a new CV
export const createCV = async (cvData) => {
  try {
    const response = await api.post(apiConfig.cv.create, cvData);
    return response.data;
  } catch (error) {
    console.error('Error creating CV:', error.response?.data || error.message);
    throw error;
  }
};

// Update an existing CV
export const updateCV = async (cvId, cvData) => {
  try {
    const response = await api.put(apiConfig.cv.update(cvId), cvData);
    return response.data;
  } catch (error) {
    console.error(`Error updating CV ${cvId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Delete a CV
export const deleteCV = async (cvId) => {
  try {
    const response = await api.delete(apiConfig.cv.delete(cvId));
    return response.data;
  } catch (error) {
    console.error(`Error deleting CV ${cvId}:`, error.response?.data || error.message);
    throw error;
  }
}; 