export interface MediaItem {
  id: string;
  uri: string;
  type: 'photo' | 'video';
  timestamp: number;
}

export interface Activity {
  id: string;
  title: string;
  time: string;
  location: string;
  description: string;
  media: MediaItem[];
  reminder?: {
    enabled: boolean;
    notificationId?: string;
  };
  completed: boolean;
}

export interface TripDay {
  id: string;
  date: string;
  activities: Activity[];
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  days: TripDay[];
  createdAt: number;
  updatedAt: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  defaultReminderTime: number; // minutes before activity
}