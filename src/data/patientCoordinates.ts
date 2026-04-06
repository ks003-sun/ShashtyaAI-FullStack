// GPS coordinates for Indian cities (patient locations)
export const cityCoordinates: Record<string, [number, number]> = {
  "Jaipur, Rajasthan": [26.9124, 75.7873],
  "Varanasi, Uttar Pradesh": [25.3176, 82.9739],
  "Ahmedabad, Gujarat": [23.0225, 72.5714],
  "Chennai, Tamil Nadu": [13.0827, 80.2707],
  "Amritsar, Punjab": [31.6340, 74.8723],
  "Kochi, Kerala": [9.9312, 76.2673],
  "Srinagar, Jammu & Kashmir": [34.0837, 74.7973],
  "Pune, Maharashtra": [18.5204, 73.8567],
  "Kolkata, West Bengal": [22.5726, 88.3639],
  "Hyderabad, Telangana": [17.3850, 78.4867],
  "Bengaluru, Karnataka": [12.9716, 77.5946],
  "Mumbai, Maharashtra": [19.0760, 72.8777],
  "Delhi": [28.7041, 77.1025],
  "Lucknow, Uttar Pradesh": [26.8467, 80.9462],
  "Ludhiana, Punjab": [30.9010, 75.8573],
  "Patna, Bihar": [25.6093, 85.1376],
  "Kottayam, Kerala": [9.5916, 76.5222],
  "Visakhapatnam, Andhra Pradesh": [17.6868, 83.2185],
  "Bhopal, Madhya Pradesh": [23.2599, 77.4126],
};

// Add slight random offset to simulate real patient GPS
export function getPatientCoords(location?: string): [number, number] {
  if (!location) return [20.5937, 78.9629]; // India center
  const base = cityCoordinates[location];
  if (!base) return [20.5937, 78.9629];
  const jitter = () => (Math.random() - 0.5) * 0.02;
  return [base[0] + jitter(), base[1] + jitter()];
}
