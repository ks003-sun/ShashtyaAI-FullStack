import DashboardHeader from "@/components/DashboardHeader";
import PatientGPSMap from "@/components/PatientGPSMap";
import FollowUpScheduler from "@/components/FollowUpScheduler";

export default function GPSTrackingPage() {
  return (
    <div>
      <DashboardHeader title="GPS & Follow-ups" subtitle="Live Patient Tracking & Scheduled Care" />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PatientGPSMap />
        </div>
        <div>
          <FollowUpScheduler showAll />
        </div>
      </div>
    </div>
  );
}
