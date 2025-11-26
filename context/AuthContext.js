import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // User state can hold userId, etc.

  const signIn = (userData) => {
    setUser(userData);
    // In a real app, you'd also persist the token here, e.g., AsyncStorage
  };

  const signOut = () => {
    setUser(null);
    // In a real app, you'd also clear the token from storage
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
