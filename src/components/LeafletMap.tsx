import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label: string;
  type: "patient" | "ambulance" | "hospital";
  popup?: string;
  riskLevel?: "low" | "medium" | "high";
}

interface LeafletMapProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  showRoute?: boolean;
  routeFrom?: [number, number];
  routeTo?: [number, number];
}

const markerColors: Record<string, string> = {
  patient: "#2563EB",
  ambulance: "#EF4444",
  hospital: "#22C55E",
};

const riskColors: Record<string, string> = {
  high: "#EF4444",
  medium: "#F59E0B",
  low: "#22C55E",
};

function createIcon(type: string, riskLevel?: string): L.DivIcon {
  const color = type === "patient" && riskLevel ? riskColors[riskLevel] : markerColors[type];
  const size = type === "ambulance" ? 14 : 12;
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 8px ${color}80;"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function LeafletMap({
  markers,
  center = [22.5, 78.5],
  zoom = 5,
  className = "h-[400px]",
  showRoute,
  routeFrom,
  routeTo,
}: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapRef.current = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: true,
      attributionControl: false,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
    }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    if (!mapRef.current) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    markers.forEach((m) => {
      const marker = L.marker([m.lat, m.lng], {
        icon: createIcon(m.type, m.riskLevel),
      }).addTo(mapRef.current!);
      if (m.popup || m.label) {
        marker.bindPopup(
          `<div style="font-size:12px;min-width:120px;">
            <strong>${m.label}</strong>
            ${m.popup ? `<br/><span style="color:#666;">${m.popup}</span>` : ""}
          </div>`
        );
      }
      markersRef.current.push(marker);
    });
  }, [markers]);

  // Update route
  useEffect(() => {
    if (!mapRef.current) return;
    if (routeRef.current) {
      routeRef.current.remove();
      routeRef.current = null;
    }
    if (showRoute && routeFrom && routeTo) {
      // Create a curved route with intermediate points
      const midLat = (routeFrom[0] + routeTo[0]) / 2 + (Math.random() - 0.5) * 0.01;
      const midLng = (routeFrom[1] + routeTo[1]) / 2 + (Math.random() - 0.5) * 0.01;
      routeRef.current = L.polyline(
        [routeFrom, [midLat, midLng], routeTo],
        { color: "#EF4444", weight: 3, opacity: 0.7, dashArray: "8 6" }
      ).addTo(mapRef.current);
    }
  }, [showRoute, routeFrom, routeTo]);

  return (
    <div
      ref={containerRef}
      className={`rounded-xl overflow-hidden border border-border ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}
