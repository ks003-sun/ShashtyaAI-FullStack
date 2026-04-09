import medhaLogo from "@/assets/medhaai-logo.jpeg";

interface MedhaLogoProps {
  className?: string;
  height?: number;
  showSubtitle?: boolean;
}

export default function ShastyaLogo({ className = "", height = 48, showSubtitle = false }: MedhaLogoProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <img
        src={medhaLogo}
        alt="MedhaAI"
        style={{ height: Math.max(32, height), width: "auto" }}
        className="object-contain"
      />
      {showSubtitle && (
        <p className="text-[10px] text-muted-foreground tracking-wide mt-1 font-medium">
          A Round-the-Clock Patient Care Coordinator
        </p>
      )}
    </div>
  );
}
