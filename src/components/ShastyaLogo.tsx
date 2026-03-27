import shastyaLogo from "@/assets/shastyaai-logo.png";

interface ShastyaLogoProps {
  className?: string;
  height?: number;
}

export default function ShastyaLogo({ className = "", height = 48 }: ShastyaLogoProps) {
  return (
    <img
      src={shastyaLogo}
      alt="ShastyaAI"
      style={{ height: Math.max(32, height * 2), width: "auto" }}
      className={`object-contain ${className}`}
    />
  );
}
