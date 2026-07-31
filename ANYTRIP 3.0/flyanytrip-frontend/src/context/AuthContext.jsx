import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing session
    const savedUser = localStorage.getItem('flyanytrip_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userDetails) => {
    // Only store what the user provides. If name is missing, initials will be 'U'.
    const newUser = {
      ...userDetails,
      name: userDetails.name || '',
      email: userDetails.email || '',
      mobile: userDetails.mobile || '',
      avatar: null,
      myCash: 0,
      initials: userDetails.name ? userDetails.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'
    };
    setUser(newUser);
    localStorage.setItem('flyanytrip_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('flyanytrip_user');
  };

  const updateProfile = (updatedDetails) => {
    const updatedUser = { ...user, ...updatedDetails };
    setUser(updatedUser);
    localStorage.setItem('flyanytrip_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
