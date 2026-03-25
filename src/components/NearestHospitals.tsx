import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Building2, Navigation, Phone, Clock, ChevronDown, ChevronUp } from "lucide-react";

interface Hospital {
  name: string;
  type: string;
  distance: string;
  address: string;
  phone: string;
  specialties: string[];
  open24x7: boolean;
}

const hospitalsByCity: Record<string, Hospital[]> = {
  "Jaipur, Rajasthan": [
    { name: "Sawai Man Singh Hospital", type: "Government", distance: "2.3 km", address: "JLN Marg, Jaipur", phone: "+91-141-256-0291", specialties: ["Cardiology", "Endocrinology", "Geriatrics"], open24x7: true },
    { name: "Fortis Escorts Hospital", type: "Private", distance: "5.1 km", address: "Malviya Nagar, Jaipur", phone: "+91-141-254-7000", specialties: ["Cardiac Sciences", "Neurology", "Orthopedics"], open24x7: true },
    { name: "Narayana Multispeciality Hospital", type: "Private", distance: "7.8 km", address: "Sector 28, Kumbha Marg", phone: "+91-141-710-0100", specialties: ["Nephrology", "Oncology", "Pulmonology"], open24x7: true },
  ],
  "Varanasi, Uttar Pradesh": [
    { name: "BHU Sir Sunderlal Hospital", type: "Government", distance: "1.8 km", address: "Lanka, Varanasi", phone: "+91-542-236-7568", specialties: ["Cardiology", "Pulmonology", "General Medicine"], open24x7: true },
    { name: "Heritage Hospital", type: "Private", distance: "4.2 km", address: "Lanka Road, Varanasi", phone: "+91-542-227-5555", specialties: ["Cardiac Surgery", "Nephrology"], open24x7: true },
    { name: "Medwin Hospital", type: "Private", distance: "6.5 km", address: "Sigra, Varanasi", phone: "+91-542-222-0707", specialties: ["Orthopedics", "Neurology"], open24x7: false },
  ],
  "Ahmedabad, Gujarat": [
    { name: "Civil Hospital Ahmedabad", type: "Government", distance: "3.0 km", address: "Asarwa, Ahmedabad", phone: "+91-79-2268-3721", specialties: ["General Medicine", "Surgery", "Geriatrics"], open24x7: true },
    { name: "Apollo Hospitals", type: "Private", distance: "5.5 km", address: "Gandhinagar Highway", phone: "+91-79-6670-1800", specialties: ["Cardiology", "Oncology", "Neurology"], open24x7: true },
  ],
  "Chennai, Tamil Nadu": [
    { name: "Rajiv Gandhi Government Hospital", type: "Government", distance: "2.1 km", address: "Park Town, Chennai", phone: "+91-44-2530-5000", specialties: ["General Medicine", "Nephrology", "Diabetology"], open24x7: true },
    { name: "Apollo Hospitals Greams Road", type: "Private", distance: "4.8 km", address: "Greams Lane, Chennai", phone: "+91-44-2829-3333", specialties: ["Cardiology", "Nephrology", "Neurology"], open24x7: true },
    { name: "MIOT International", type: "Private", distance: "8.2 km", address: "Manapakkam, Chennai", phone: "+91-44-4200-2288", specialties: ["Orthopedics", "Spine Surgery", "Transplants"], open24x7: true },
  ],
  "Amritsar, Punjab": [
    { name: "Government Medical College Hospital", type: "Government", distance: "1.5 km", address: "Circular Road, Amritsar", phone: "+91-183-222-5681", specialties: ["Cardiology", "General Medicine"], open24x7: true },
    { name: "Fortis Escorts Hospital", type: "Private", distance: "4.0 km", address: "Majitha Verka Bypass", phone: "+91-183-504-1111", specialties: ["Cardiac Sciences", "Neurology", "Orthopedics"], open24x7: true },
  ],
  "Kochi, Kerala": [
    { name: "Government Medical College Ernakulam", type: "Government", distance: "2.5 km", address: "Kalamassery, Kochi", phone: "+91-484-254-5001", specialties: ["Neurology", "Psychiatry", "General Medicine"], open24x7: true },
    { name: "Amrita Hospital", type: "Private", distance: "6.0 km", address: "Ponekkara, Kochi", phone: "+91-484-285-1234", specialties: ["Cardiology", "Oncology", "Neurology"], open24x7: true },
  ],
  "Srinagar, Jammu & Kashmir": [
    { name: "SKIMS Soura", type: "Government", distance: "3.2 km", address: "Soura, Srinagar", phone: "+91-194-240-3470", specialties: ["Pulmonology", "Cardiology", "General Medicine"], open24x7: true },
    { name: "SMHS Hospital", type: "Government", distance: "1.8 km", address: "Karan Nagar, Srinagar", phone: "+91-194-245-2329", specialties: ["Emergency", "Surgery", "Orthopedics"], open24x7: true },
  ],
  "Pune, Maharashtra": [
    { name: "Sassoon General Hospital", type: "Government", distance: "2.0 km", address: "Sassoon Road, Pune", phone: "+91-20-2612-0441", specialties: ["General Medicine", "Surgery"], open24x7: true },
    { name: "Ruby Hall Clinic", type: "Private", distance: "3.5 km", address: "Sassoon Road, Pune", phone: "+91-20-6645-5555", specialties: ["Cardiology", "Rheumatology", "Gastroenterology"], open24x7: true },
  ],
  "Kolkata, West Bengal": [
    { name: "SSKM Hospital", type: "Government", distance: "2.8 km", address: "AJC Bose Road, Kolkata", phone: "+91-33-2223-5611", specialties: ["Neurology", "Geriatrics", "General Medicine"], open24x7: true },
    { name: "Apollo Gleneagles", type: "Private", distance: "5.3 km", address: "Canal Circular Road, Kolkata", phone: "+91-33-2320-3040", specialties: ["Cardiology", "Neurology", "Oncology"], open24x7: true },
  ],
  "Mysuru, Karnataka": [
    { name: "K.R. Hospital", type: "Government", distance: "1.5 km", address: "Irwin Road, Mysuru", phone: "+91-821-242-0700", specialties: ["General Medicine", "Orthopedics"], open24x7: true },
    { name: "JSS Hospital", type: "Private", distance: "3.8 km", address: "MG Road, Mysuru", phone: "+91-821-254-8400", specialties: ["Cardiology", "Neurology", "Nephrology"], open24x7: true },
  ],
  "Hyderabad, Telangana": [
    { name: "Osmania General Hospital", type: "Government", distance: "2.2 km", address: "Afzalgunj, Hyderabad", phone: "+91-40-2460-0146", specialties: ["General Medicine", "Cardiology"], open24x7: true },
    { name: "KIMS Hospital", type: "Private", distance: "4.5 km", address: "Minister Road, Secunderabad", phone: "+91-40-4488-5000", specialties: ["Cardiac Surgery", "Pulmonology", "Oncology"], open24x7: true },
  ],
  "Ludhiana, Punjab": [
    { name: "CMC Ludhiana", type: "Private", distance: "1.2 km", address: "Brown Road, Ludhiana", phone: "+91-161-501-0800", specialties: ["Pulmonology", "Cardiology", "Endocrinology"], open24x7: true },
    { name: "Dayanand Medical College", type: "Government", distance: "3.0 km", address: "Tagore Nagar, Ludhiana", phone: "+91-161-230-2620", specialties: ["General Medicine", "Surgery"], open24x7: true },
  ],
  "Patna, Bihar": [
    { name: "PMCH Patna", type: "Government", distance: "2.0 km", address: "Ashok Rajpath, Patna", phone: "+91-612-230-0343", specialties: ["General Medicine", "Ophthalmology", "Endocrinology"], open24x7: true },
    { name: "Paras HMRI Hospital", type: "Private", distance: "5.5 km", address: "Raja Bazar, Patna", phone: "+91-612-727-7777", specialties: ["Cardiology", "Nephrology", "Neurology"], open24x7: true },
  ],
  "Kottayam, Kerala": [
    { name: "Government Medical College Kottayam", type: "Government", distance: "1.0 km", address: "Gandhinagar, Kottayam", phone: "+91-481-259-7311", specialties: ["Cardiology", "General Medicine"], open24x7: true },
    { name: "Caritas Hospital", type: "Private", distance: "2.8 km", address: "Thellakom, Kottayam", phone: "+91-481-279-0025", specialties: ["Nephrology", "Urology", "Orthopedics"], open24x7: true },
  ],
  "Lucknow, Uttar Pradesh": [
    { name: "KGMU Hospital", type: "Government", distance: "1.5 km", address: "Shah Mina Road, Lucknow", phone: "+91-522-225-7540", specialties: ["Cardiology", "Geriatrics", "General Medicine"], open24x7: true },
    { name: "Medanta Hospital Lucknow", type: "Private", distance: "8.0 km", address: "Shaheed Path, Lucknow", phone: "+91-522-678-9000", specialties: ["Cardiac Surgery", "Oncology", "Neurology"], open24x7: true },
  ],
  "Visakhapatnam, Andhra Pradesh": [
    { name: "KGH Hospital", type: "Government", distance: "2.0 km", address: "Maharanipeta, Vizag", phone: "+91-891-256-4891", specialties: ["General Medicine", "Nephrology", "Endocrinology"], open24x7: true },
    { name: "CARE Hospital", type: "Private", distance: "4.5 km", address: "Ramnagar, Vizag", phone: "+91-891-710-2222", specialties: ["Cardiology", "Nephrology", "Pulmonology"], open24x7: true },
  ],
  "Bhopal, Madhya Pradesh": [
    { name: "Hamidia Hospital", type: "Government", distance: "1.8 km", address: "Royal Market, Bhopal", phone: "+91-755-254-0222", specialties: ["General Medicine", "Neurology", "Geriatrics"], open24x7: true },
    { name: "Bansal Hospital", type: "Private", distance: "4.0 km", address: "Shahpura, Bhopal", phone: "+91-755-403-0000", specialties: ["Cardiology", "Orthopedics", "Neurology"], open24x7: true },
  ],
};

const defaultHospitals: Hospital[] = [
  { name: "District General Hospital", type: "Government", distance: "3.0 km", address: "City Center", phone: "108", specialties: ["General Medicine", "Emergency"], open24x7: true },
  { name: "Primary Health Center", type: "Government", distance: "5.0 km", address: "Town Area", phone: "108", specialties: ["General Medicine"], open24x7: false },
];

export default function NearestHospitals({ city }: { city?: string }) {
  const [expanded, setExpanded] = useState(false);
  const hospitals = (city && hospitalsByCity[city]) || defaultHospitals;

  return (
    <div className="card-healthcare p-4">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          <Building2 className="w-4 h-4 text-teal" />
          Nearest Network Hospitals
          {city && <span className="text-[10px] text-muted-foreground font-normal">· {city}</span>}
        </h3>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 space-y-2.5">
          {hospitals.map((h, i) => (
            <motion.div
              key={h.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-3 rounded-xl bg-muted/30 border border-border/30 space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-foreground">{h.name}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />{h.address}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold text-teal flex items-center gap-1">
                    <Navigation className="w-3 h-3" />{h.distance}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full mt-0.5 inline-block ${h.type === "Government" ? "bg-sage-light text-sage" : "bg-primary/10 text-primary"}`}>
                    {h.type}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {h.specialties.map((s) => (
                  <span key={s} className="text-[9px] px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">{s}</span>
                ))}
              </div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{h.phone}</span>
                {h.open24x7 && <span className="flex items-center gap-1 text-sage"><Clock className="w-3 h-3" />24×7</span>}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
