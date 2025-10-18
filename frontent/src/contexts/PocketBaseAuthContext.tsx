import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import pb, { authHelpers } from '../pocketbase/config';

interface AuthContextType {
  currentUser: any | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, domain: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const authData = await authHelpers.login(email, password);
      setCurrentUser(authData.record);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string, domain: string) => {
    try {
      await authHelpers.register(name, email, password, domain);
      // Auto-login after registration
      const authData = await authHelpers.login(email, password);
      setCurrentUser(authData.record);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    authHelpers.logout();
    setCurrentUser(null);
  };

  // Listen for auth state changes
  useEffect(() => {
    // Set initial user
    if (pb.authStore.isValid) {
      setCurrentUser(pb.authStore.model);
    }

    // Listen for auth changes
    const unsubscribe = pb.authStore.onChange((token, model) => {
      setCurrentUser(model);
      setLoading(false);
    });

    setLoading(false);

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
