export interface CardItem {
  id: string;
  type: "tool" | "workshop" | "event" | "story" | "link" | "image";
  label: string;
  title: string;
  description?: string;
  badge?: string;
  details?: string;
  imageUrl?: string;
  bgColor: string;
  textColor: string;
  category: string; // Used for filtering
  link?: string;
  fullContent?: string;
}

export interface ActivityResponse {
  text: string;
}

export interface CoachMessage {
  id: string;
  sender: "user" | "coach";
  text: string;
  timestamp: string;
}
