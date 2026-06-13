import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import * as authService from "../../service/auth.service";

export interface User {
  id: number;
  email: string;
  name: string;
  role: "student" | "teacher" | "admin";
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user and token from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem("lms_user");
      const savedToken = localStorage.getItem("lms_token");
      
      if (savedUser && savedToken) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } catch (error) {
          localStorage.removeItem("lms_user");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    const { user: userData, accessToken } = response;

    setUser(userData);
    localStorage.setItem("lms_user", JSON.stringify(userData));
    localStorage.setItem("lms_token", accessToken);

    toast.success(`Chào mừng trở lại, ${userData.name}!`, {
      description: "Đăng nhập thành công",
    });
  };

  const logout = async () => {
    const userName = user?.name;
    try {
      await authService.logout();
    } catch (error) {
      // Ignore logout errors, just clear local state
    }
    setUser(null);
    localStorage.removeItem("lms_token");
    localStorage.removeItem("lms_user");
    toast.info(`Tạm biệt, ${userName}!`, {
      description: "Đã đăng xuất khỏi hệ thống",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
