import AppSidebar from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}
