export interface ContentItem {
  id: string;
  title: string;
  description: string;
  category: string;
  imageKeyword: string;
  duration: string;
  isAI?: boolean;
}

export interface HistoryItem {
  id: string;
  title: string;
  timestamp: string; // e.g., "Mon 8:30 PM"
  details: string;   // e.g., "2 eps • 45m"
  profile: 'Dad' | 'Kid' | 'Teen' | 'Family';
}

export interface UserPreferences {
  interests: string[];
}

export const AVAILABLE_INTERESTS = [
  "Hard Sci-Fi",
  "Space Operas",
  "Cyberpunk",
  "Physics Documentaries",
  "Family Movie Night",
  "90s Action",
  "Animation",
  "Tech News",
  "Canadian Comedy"
];