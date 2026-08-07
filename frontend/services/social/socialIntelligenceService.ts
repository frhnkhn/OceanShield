export interface SocialPost {
  id: string;
  source: "X" | "Reddit" | "Facebook" | "Instagram" | "Telegram" | "News";
  author: string;
  text: string;
  timestamp: string;
  location: string;
  disasterType: string;
  severity: "low" | "moderate" | "high" | "critical";
  credibilityScore: number; // 0-100%
  sentiment: "negative" | "neutral" | "positive";
  hashtags: string[];
}

export const MOCK_SOCIAL_POSTS: SocialPost[] = [
  {
    id: "p1",
    source: "X",
    author: "@ChennaiAlerts",
    text: "Water level rose 1.8m near Royapuram bridge. Heavy storm surge blocking coastal road. Seek alternative routes immediately! #ChennaiFloods #Royapuram",
    timestamp: new Date().toISOString(),
    location: "Royapuram, Chennai",
    disasterType: "Coastal Flooding",
    severity: "critical",
    credibilityScore: 94,
    sentiment: "negative",
    hashtags: ["ChennaiFloods", "Royapuram"]
  },
  {
    id: "p2",
    source: "Reddit",
    author: "u/fisher_guard",
    text: "Heavy sea wave erosion collapsing fishing shacks at Mylapore beach. Need emergency reinforcement. High tide expected in 30 mins.",
    timestamp: new Date(Date.now() - 600000).toISOString(),
    location: "Mylapore Beach, Chennai",
    disasterType: "High Waves / Erosion",
    severity: "high",
    credibilityScore: 89,
    sentiment: "negative",
    hashtags: ["Erosion", "CoastalSafety"]
  },
  {
    id: "p3",
    source: "Telegram",
    author: "Chennai Rescue Channel",
    text: "Local community volunteer teams dispatched to Marina shelter. Water logging reported on Kamarajar Salai.",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    location: "Marina Beach, Chennai",
    disasterType: "Coastal Flooding",
    severity: "moderate",
    credibilityScore: 82,
    sentiment: "neutral",
    hashtags: ["Marina", "Volunteer"]
  },
  {
    id: "p4",
    source: "News",
    author: "State Weather Journal",
    text: "Deep depression in Bay of Bengal expected to make landfall near Nagapattinam tomorrow morning. Cyclone category Cat-2. High warning active.",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    location: "Nagapattinam Coast",
    disasterType: "Cyclone / Wind Damage",
    severity: "critical",
    credibilityScore: 98,
    sentiment: "negative",
    hashtags: ["Nagapattinam", "CycloneAlert"]
  }
];

export async function fetchSocialPosts(keyword?: string): Promise<SocialPost[]> {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  if (!keyword) return MOCK_SOCIAL_POSTS;
  
  return MOCK_SOCIAL_POSTS.filter(post => 
    post.text.toLowerCase().includes(keyword.toLowerCase()) ||
    post.location.toLowerCase().includes(keyword.toLowerCase()) ||
    post.hashtags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
  );
}
