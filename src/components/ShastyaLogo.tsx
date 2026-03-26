import shastyaLogo from "@/assets/shastyaai-logo.png";

interface ShastyaLogoProps {
  className?: string;
  height?: number;
}

export default function ShastyaLogo({ className = "", height = 40 }: ShastyaLogoProps) {
  return (
    <img
      src={shastyaLogo}
      alt="ShastyaAI"
      style={{ height }}
      className={`object-contain ${className}`}
    />
  );
}
