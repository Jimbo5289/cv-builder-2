import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function useLogin() {
  const { login } = useAuth();
  return login;
}

function useLogout() {
  const { logout } = useAuth();
  return logout;
}

function useRegister() {
  const { register } = useAuth();
  return register;
}

function useUser() {
  const { user } = useAuth();
  return user;
}

function useAuthStatus() {
  const { isAuthenticated, isLoading } = useAuth();
  return { isAuthenticated, isLoading };
}

export { useAuth, useLogin, useLogout, useRegister, useUser, useAuthStatus }; 