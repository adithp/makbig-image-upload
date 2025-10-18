import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import pb, { authHelpers, otpHelpers } from "../pocketbase/config";

interface AuthContextType {
  currentUser: any | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ requiresOTP: boolean; tempAuth?: any }>;
  verifyOTP: (email: string, otpCode: string) => Promise<void>;
  requestOTP: (email: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    domain: string
  ) => Promise<void>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<void>;
  verifyPasswordResetOTP: (email: string, otpCode: string) => Promise<void>;
  resetPassword: (email: string, newPassword: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Login function - returns whether OTP verification is required
  const login = async (email: string, password: string) => {
    try {
      const authData = await authHelpers.login(email, password);

      // Check if user has verified their email
      if (!authData.record.email_verified) {
        // User needs to verify email with OTP
        return {
          requiresOTP: true,
          tempAuth: authData,
        };
      }

      // Email already verified, complete login
      setCurrentUser(authData.record);
      return {
        requiresOTP: false,
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Request OTP (send OTP to email)
  const requestOTP = async (email: string) => {
    try {
      // Call backend to generate and send OTP
      const response = await fetch(
        `${pb.baseUrl}/api/collections/users/request-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to request OTP");
      }

      return await response.json();
    } catch (error) {
      console.error("Error requesting OTP:", error);
      throw error;
    }
  };

  // Verify OTP code
  const verifyOTP = async (email: string, otpCode: string) => {
    try {
      const response = await fetch(
        `${pb.baseUrl}/api/collections/users/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp: otpCode }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "OTP verification failed");
      }

      const data = await response.json();

      // After verification, log the user in
      if (data.success) {
        // Fetch updated user data
        const user = await pb.collection("users").getOne(data.userId);
        setCurrentUser(user);
      }

      return data;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  };

  // Register function
  const register = async (
    name: string,
    email: string,
    password: string,
    domain: string
  ) => {
    try {
      await authHelpers.register(name, email, password, domain);
      // Auto-login after registration
      const authData = await authHelpers.login(email, password);
      setCurrentUser(authData.record);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    authHelpers.logout();
    setCurrentUser(null);
  };

  // Request password reset (send OTP)
  const requestPasswordReset = async (email: string) => {
    try {
      const response = await fetch(
        `${pb.baseUrl}/api/collections/users/request-password-reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to request password reset");
      }

      return await response.json();
    } catch (error) {
      console.error("Error requesting password reset:", error);
      throw error;
    }
  };

  // Verify password reset OTP
  const verifyPasswordResetOTP = async (email: string, otpCode: string) => {
    try {
      const response = await fetch(
        `${pb.baseUrl}/api/collections/users/verify-password-reset-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp: otpCode }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "OTP verification failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Error verifying password reset OTP:", error);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email: string, newPassword: string) => {
    try {
      const response = await fetch(
        `${pb.baseUrl}/api/collections/users/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, newPassword }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to reset password");
      }

      return await response.json();
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
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
    verifyOTP,
    requestOTP,
    register,
    logout,
    requestPasswordReset,
    verifyPasswordResetOTP,
    resetPassword,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
