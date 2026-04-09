import { motion } from "framer-motion";
import { User, Mail, Building2, Calendar, Phone, Shield, Stethoscope, MapPin } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { usePatientData } from "@/context/PatientDataContext";

const doctorProfile = {
  name: "Dr. Rithika Singh",
  email: "rithika.singh@medhahealth.in",
  phone: "+91 98765 43210",
  dob: "1982-07-15",
  gender: "Female",
  hospital: "AIIMS Multi-Specialty Care Centre",
  department: "Internal Medicine & Chronic Disease Management",
  location: "New Delhi, India",
  licenseNo: "MCI-2008-47832",
  specialization: "Internal Medicine, Post-Surgical Recovery, Chronic Disease AI Analytics",
  experience: "18 years",
};

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-sm text-foreground font-medium">{value}</p>
      </div>
    </div>
  );
}

export default function Settings() {
  const { patients } = usePatientData();

  // Derive caregiver accounts from patients
  const caregiverMap = new Map<string, { name: string; patients: string[]; lastLogin: string }>();
  patients.forEach((p) => {
    if (p.caregiverName && p.caregiverName !== "Self-managed") {
      const existing = caregiverMap.get(p.caregiverName);
      if (existing) {
        existing.patients.push(p.name);
      } else {
        caregiverMap.set(p.caregiverName, {
          name: p.caregiverName,
          patients: [p.name],
          lastLogin: "2024-04-05",
        });
      }
    }
  });
  const caregiverAccounts = Array.from(caregiverMap.values());

  return (
    <div>
      <DashboardHeader title="Settings" subtitle="Doctor profile, caregiver accounts & system configuration" />

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-healthcare p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-xl font-bold text-primary-foreground">RS</div>
            <div>
              <h2 className="font-display text-xl text-foreground">{doctorProfile.name}</h2>
              <p className="text-xs text-muted-foreground">{doctorProfile.specialization}</p>
            </div>
          </div>
          <InfoRow icon={Mail} label="Email" value={doctorProfile.email} />
          <InfoRow icon={Phone} label="Phone" value={doctorProfile.phone} />
          <InfoRow icon={Calendar} label="Date of Birth" value={doctorProfile.dob} />
          <InfoRow icon={Building2} label="Hospital" value={doctorProfile.hospital} />
          <InfoRow icon={Stethoscope} label="Department" value={doctorProfile.department} />
          <InfoRow icon={MapPin} label="Location" value={doctorProfile.location} />
          <InfoRow icon={Shield} label="License No." value={doctorProfile.licenseNo} />
          <InfoRow icon={User} label="Experience" value={doctorProfile.experience} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          <h2 className="font-display text-xl text-foreground">Caregiver Accounts ({caregiverAccounts.length})</h2>
          {caregiverAccounts.map((cg, i) => (
            <motion.div key={cg.name} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="card-healthcare p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-lavender-light flex items-center justify-center text-xs font-bold text-lavender">
                    {cg.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{cg.name}</p>
                    <p className="text-[10px] text-muted-foreground">{cg.name.toLowerCase().replace(/\s+/g, ".")}@medhaai.health</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-sage-light text-sage text-[10px] font-medium">Primary Caregiver</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-2">
                <span>Patients: {cg.patients.join(", ")}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
