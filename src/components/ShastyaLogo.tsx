import shastyaLogo from "@/assets/shastyaai-logo.png";

interface MedhaLogoProps {
  className?: string;
  height?: number;
}

export default function ShastyaLogo({ className = "", height = 48 }: MedhaLogoProps) {
  return (
    <img
      src={shastyaLogo}
      alt="MedhaHealth"
      style={{ height: Math.max(32, height * 2), width: "auto" }}
      className={`object-contain ${className}`}
    />
  );
}
