import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "@/services/UserService";

interface EmployeeInfo {
  _id: string;
  employeeCode: string;
  position: string;
  department: string;
}

interface UserData {
  id: string;
  _id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  employee: EmployeeInfo | null;
}

interface PermissionContextType {
  loading: boolean;
  user: UserData | null;
  isSuper: boolean;
  hasPermission: (positions: string[]) => boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [isSuper, setIsSuper] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      // Kiểm tra cookie trước khi gọi API
      const cookies = document.cookie;
      const hasUserId = cookies.split(';').some(cookie => cookie.trim().startsWith('userId='));
      
      if (!hasUserId) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser();
        if (response.success && response.data) {
          setUser(response.data);
          setIsSuper(response.data.username === "admin" || (response.data as any).isSuper);
        }
      } catch (error: any) {
        // Bỏ qua lỗi 403 (chưa login) hoặc 401 (unauthorized)
        if (error.response?.status === 403 || error.response?.status === 401) {
          // Xóa cookie cũ/invalid
          document.cookie = 'userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        } else {
          console.error("Failed to fetch user:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const hasPermission = (positions: string[]) => {
    if (isSuper) return true;
    if (!user?.employee) return false;
    return positions.includes(user.employee.position);
  };

  return (
    <PermissionContext.Provider value={{ loading, user, isSuper, hasPermission }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermission must be used within PermissionProvider");
  }
  return context;
};
