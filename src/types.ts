export interface Task {
  id: string;
  time: string; // e.g., "09:30"
  title: string;
  description: string;
  location: string;
  completed: boolean;
  reminderEnabled: boolean;
  reminderMinutesBefore: number; // minutes before task time (e.g., 0, 15, 30, 60)
  reminderTriggered?: boolean;
}

export interface DaySchedule {
  date: string; // e.g., "2026-06-18"
  dateLabel: string; // e.g., "Day 1 (6/18)"
  tasks: Task[];
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  location: string; // e.g., "澎湖"
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  schedule: { [date: string]: Task[] }; // keys: YYYY-MM-DD, values: list of tasks
  createdAt: number; // milliseconds
  updatedAt: number; // milliseconds
  userId?: string; // owner uid
}

export interface WeatherData {
  temperature: string;
  condition: string;
  description: string;
  humidity?: string;
  wind?: string;
  tips: string[];
}

export interface Landmark {
  name: string;
  description: string;
  highlight: string;
  address?: string;
  priceRange?: string;
  tags?: string[];
}
