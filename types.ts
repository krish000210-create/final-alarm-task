
export interface Task {
  id: number;
  text: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

export interface Alarm {
  id: number;
  time: string; // HH:MM
  description: string;
  repeat: boolean;
}

export type TabName = 'daily' | 'progress' | 'pomodoro' | 'alarms';
