export interface Shelter {
  id: string;
  name: string;
  type: "cyclone_shelter" | "police_station" | "hospital" | "fire_station" | "ndrf_camp" | "coast_guard";
  latitude: number;
  longitude: number;
  address: string;
  contact: string;
  capacity: number;
  occupancy: number;
  status: "active" | "full" | "inactive";
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: "low" | "moderate" | "high" | "critical";
  category: "weather" | "evacuation" | "advisory" | "tsunami";
  timestamp: string;
  sender: string;
}

export interface WeatherInfo {
  temp: number;
  windSpeed: number; // in km/h
  windDir: string;
  humidity: number;
  rainfall: number; // in mm
  tideLevel: string; // "High", "Normal", "Low"
  cycloneWarning: boolean;
  cycloneCategory?: string;
}

export const MOCK_SHELTERS: Shelter[] = [
  {
    id: "s1",
    name: "Marina Beach Multi-Purpose Cyclone Shelter",
    type: "cyclone_shelter",
    latitude: 13.0480,
    longitude: 80.2820,
    address: "Kamarajar Salai, Marina Beach, Chennai",
    contact: "+91 44 2856 1234",
    capacity: 1500,
    occupancy: 420,
    status: "active"
  },
  {
    id: "s2",
    name: "Royapuram Relief Camp & Shelter",
    type: "cyclone_shelter",
    latitude: 13.1140,
    longitude: 80.2940,
    address: "Royapuram High Road, Chennai",
    contact: "+91 44 2856 5678",
    capacity: 1000,
    occupancy: 950,
    status: "active"
  },
  {
    id: "s3",
    name: "Apollo Greams Road Hospital",
    type: "hospital",
    latitude: 13.0600,
    longitude: 80.2520,
    address: "Greams Lane, Off Greams Road, Chennai",
    contact: "+91 44 2829 0200",
    capacity: 500,
    occupancy: 480,
    status: "active"
  },
  {
    id: "s4",
    name: "NDRF 10th Battalion Deployment Camp",
    type: "ndrf_camp",
    latitude: 13.0100,
    longitude: 80.2200,
    address: "Adyar Depot Ground, Chennai",
    contact: "+91 44 2445 9999",
    capacity: 400,
    occupancy: 120,
    status: "active"
  },
  {
    id: "s5",
    name: "Coast Guard Station Chennai East",
    type: "coast_guard",
    latitude: 13.0900,
    longitude: 80.3000,
    address: "Port Area, Chennai Coast Guard HQ",
    contact: "+91 44 2539 0101",
    capacity: 600,
    occupancy: 150,
    status: "active"
  },
  {
    id: "s6",
    name: "Mylapore Police Station Command Post",
    type: "police_station",
    latitude: 13.0330,
    longitude: 80.2680,
    address: "Kutchery Road, Mylapore, Chennai",
    contact: "+91 44 2498 0001",
    capacity: 200,
    occupancy: 40,
    status: "active"
  },
  {
    id: "s7",
    name: "Adyar Fire and Rescue Headquarters",
    type: "fire_station",
    latitude: 13.0060,
    longitude: 80.2570,
    address: "Lattice Bridge Road, Adyar, Chennai",
    contact: "+91 44 2441 0002",
    capacity: 150,
    occupancy: 20,
    status: "active"
  }
];

export const MOCK_ALERTS: Alert[] = [
  {
    id: "a1",
    title: "Extreme Weather Alert: Cyclone Warning",
    description: "Deep depression in Bay of Bengal expected to intensify into Severe Cyclonic Storm. High winds up to 110 km/h and heavy rainfall predicted.",
    severity: "critical",
    category: "weather",
    timestamp: "2026-08-07T12:00:00Z",
    sender: "Indian Meteorological Department (IMD)"
  },
  {
    id: "a2",
    title: "Evacuation Notice: Low-lying Marina Area",
    description: "All residents within 500 meters of Marina Beach and Royapuram coastline are advised to move immediately to identified inland relief shelters.",
    severity: "high",
    category: "evacuation",
    timestamp: "2026-08-07T12:30:00Z",
    sender: "District Disaster Management Authority"
  },
  {
    id: "a3",
    title: "Fishermen Advisory: Sea Condition Rough",
    description: "Fishermen are advised not to venture into deep sea or coastal areas along Tamil Nadu & Puducherry coasts. Return to port immediately.",
    severity: "moderate",
    category: "advisory",
    timestamp: "2026-08-07T10:15:00Z",
    sender: "Indian Coast Guard"
  },
  {
    id: "a4",
    title: "High Tide Advisory",
    description: "Astrological high tide expected at 18:45 IST, coinciding with heavy rainfall. Localized coastal inundation possible.",
    severity: "moderate",
    category: "weather",
    timestamp: "2026-08-07T11:45:00Z",
    sender: "National Centre for Ocean Information Services"
  }
];

export const MOCK_WEATHER: WeatherInfo = {
  temp: 27.5,
  windSpeed: 68,
  windDir: "ENE",
  humidity: 92,
  rainfall: 112.4,
  tideLevel: "High",
  cycloneWarning: true,
  cycloneCategory: "Severe Cyclonic Storm (Cat 2)"
};

// Analytics Data
export const TOP_HAZARD_TYPES = [
  { name: "Coastal Flooding", value: 34 },
  { name: "High Waves / Erosion", value: 22 },
  { name: "Oil Spill / Chemical Hazard", value: 12 },
  { name: "Cyclone / Wind Damage", value: 25 },
  { name: "Marine Pollution", value: 7 }
];

export const MONTHLY_REPORTS = [
  { month: "Jan", reports: 45, resolved: 42 },
  { month: "Feb", reports: 50, resolved: 48 },
  { month: "Mar", reports: 65, resolved: 60 },
  { month: "Apr", reports: 80, resolved: 72 },
  { month: "May", reports: 120, resolved: 110 },
  { month: "Jun", reports: 150, resolved: 135 },
  { month: "Jul", reports: 210, resolved: 190 },
  { month: "Aug", reports: 280, resolved: 230 }
];

export const DISTRICT_COMPARISON = [
  { name: "Chennai", reports: 120, critical: 45 },
  { name: "Tiruvallur", reports: 85, critical: 20 },
  { name: "Kancheepuram", reports: 45, critical: 10 },
  { name: "Cuddalore", reports: 98, critical: 35 },
  { name: "Nagapattinam", reports: 72, critical: 30 },
  { name: "Kanyakumari", reports: 55, critical: 15 }
];

export const SEVERITY_DISTRIBUTION = [
  { name: "Low", value: 45, color: "#10B981" },
  { name: "Moderate", value: 85, color: "#FBBF24" },
  { name: "High", value: 110, color: "#F97316" },
  { name: "Critical", value: 40, color: "#EF4444" }
];

export const STATUS_DISTRIBUTION = [
  { name: "Pending", value: 75, color: "#F59E0B" },
  { name: "Verified", value: 120, color: "#3B82F6" },
  { name: "Assigned", value: 55, color: "#8B5CF6" },
  { name: "Rescue Started", value: 20, color: "#EC4899" },
  { name: "Resolved", value: 180, color: "#10B981" }
];

export const RESPONSE_TIME_DATA = [
  { name: "Flooding", minutes: 35 },
  { name: "Wind Damage", minutes: 22 },
  { name: "Oil Spill Response", minutes: 58 },
  { name: "Evacuation Support", minutes: 18 },
  { name: "Medical Emergency", minutes: 12 }
];

export const EMERGENCY_CONTACTS = [
  { name: "National Emergency Number", phone: "112", subtitle: "All Emergencies" },
  { name: "Disaster Management Authority", phone: "1078", subtitle: "NDMA Control Room" },
  { name: "State Emergency Services", phone: "1070", subtitle: "SDRF Control Room" },
  { name: "Indian Coast Guard Search & Rescue", phone: "1554", subtitle: "Marine Emergencies" },
  { name: "Police Helpline", phone: "100", subtitle: "Emergency Services" },
  { name: "Fire & Rescue Department", phone: "101", subtitle: "Fire Hazards & Rescue" },
  { name: "Ambulance Hotline", phone: "102", subtitle: "Medical Emergencies" },
  { name: "Coastal Police", phone: "1093", subtitle: "Coast Patrol & Incidents" }
];
