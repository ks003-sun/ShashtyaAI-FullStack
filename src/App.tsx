import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PatientDataProvider } from "@/context/PatientDataContext";
import AppLayout from "@/components/AppLayout";
import SplashPage from "@/pages/SplashPage";
import LoginPage from "@/pages/LoginPage";
import CaregiverLogin from "@/pages/CaregiverLogin";
import CaregiverDashboard from "@/pages/CaregiverDashboard";
import Dashboard from "@/pages/Dashboard";
import PatientDetail from "@/pages/PatientDetail";
import PatientsPage from "@/pages/PatientsPage";
import InsightsPage from "@/pages/InsightsPage";
import FamilyHealthPage from "@/pages/FamilyHealthPage";
import MedicationsPage from "@/pages/MedicationsPage";
import GPSTrackingPage from "@/pages/GPSTrackingPage";
import PostCareContinuum from "@/pages/PostCareContinuum";
import Alerts from "@/pages/Alerts";
import Settings from "@/pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PatientDataProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SplashPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/caregiver/login" element={<CaregiverLogin />} />
            <Route path="/caregiver/dashboard" element={<CaregiverDashboard />} />
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/patient/:id" element={<PatientDetail />} />
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/family" element={<FamilyHealthPage />} />
              <Route path="/medications" element={<MedicationsPage />} />
              <Route path="/tracking" element={<GPSTrackingPage />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PatientDataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
