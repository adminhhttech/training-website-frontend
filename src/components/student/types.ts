// types.ts
export interface UserType {  // Renamed from User to avoid conflicts
  name?: string;
  email?: string;
  [key: string]: any;
}

export interface Course {
  id: number;
  title: string;
  image: string;
  instructor: string;
  progress: number;
  [key: string]: any;
}

export interface Achievement {
  id: number;
  title: string;
  icon?: React.ReactNode;
  description: string;
  earned: boolean;
}

export interface LearningStat {
  label: string;
  value: string;
  icon: React.ComponentType<any>;
  color: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
}