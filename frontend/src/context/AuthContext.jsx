import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('flyanytrip_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem('flyanytrip_user', JSON.stringify(userData));
    } catch (e) {}
    closeAuthModal();
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('flyanytrip_user');
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        authMode,
        setAuthMode,
        openAuthModal,
        closeAuthModal,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      isAuthModalOpen: false,
      authMode: 'login',
      setAuthMode: () => {},
      openAuthModal: () => {},
      closeAuthModal: () => {},
      login: () => {},
      logout: () => {},
    };
  }
  return context;
}
