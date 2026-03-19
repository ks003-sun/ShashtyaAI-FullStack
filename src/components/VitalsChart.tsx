import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { VitalReading } from "@/data/mockPatients";

interface VitalsChartProps {
  data: VitalReading[];
  metric: "bloodPressure" | "heartRate" | "bloodSugar" | "oxygenSat";
  title: string;
  color: string;
}

export default function VitalsChart({ data, metric, title, color }: VitalsChartProps) {
  const chartData = data.map((v) => ({
    date: v.date.slice(5),
    value: metric === "bloodPressure" ? v.bloodPressureSys : metric === "heartRate" ? v.heartRate : metric === "bloodSugar" ? v.bloodSugar : v.oxygenSat,
    ...(metric === "bloodPressure" ? { dia: v.bloodPressureDia } : {}),
  }));

  return (
    <div className="card-healthcare p-5">
      <h4 className="text-sm font-medium text-foreground mb-4">{title}</h4>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.15} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={35} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
              fontSize: "12px",
            }}
          />
          <Area type="monotone" dataKey="value" stroke={color} fill={`url(#gradient-${metric})`} strokeWidth={2} dot={{ r: 3, fill: color }} />
          {metric === "bloodPressure" && (
            <Area type="monotone" dataKey="dia" stroke={color} fill="none" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 2, fill: color }} />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
