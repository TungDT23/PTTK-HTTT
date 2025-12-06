import { useEffect, useState } from "react";
import { getCurrentUser } from "@/services/UserService";

interface EmployeeInfo {
  _id: string;
  employeeCode: string;
  position: string;
  department: string;
}

interface UserWithEmployee {
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

export const useEmployeePermission = (requiredPositions: string[]) => {
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<EmployeeInfo | null>(null);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const response = await getCurrentUser();
        if (response.success && response.data) {
          const userData: UserWithEmployee = response.data;
          
          // Nếu là super admin (username = "admin") thì có toàn quyền
          if (userData.username === "admin" || (userData as any).isSuper) {
            setHasPermission(true);
            if (userData.employee) {
              setCurrentEmployee(userData.employee);
            }
            return;
          }
          
          if (userData.employee) {
            setCurrentEmployee(userData.employee);
            // Check if employee position is in required positions
            const hasAccess = requiredPositions.includes(userData.employee.position);
            setHasPermission(hasAccess);
          } else {
            setHasPermission(false);
          }
        }
      } catch (error) {
        console.error("Permission check failed:", error);
        setHasPermission(false);
      } finally {
        setLoading(false);
      }
    };

    checkPermission();
  }, [requiredPositions]);

  return { loading, hasPermission, currentEmployee };
};
