import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "@/store/store";

export default function AdminRoute() {
  const user = useSelector((state: RootState) => state.user.user);

  if (!user) return <Navigate to="/login" />;      
  if (user.role !== "admin") return <Navigate to="/" />; 

  return <Outlet />; 
}
