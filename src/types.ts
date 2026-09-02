export type ScreenId =
  | 'SCR-00'
  | 'SCR-01'
  | 'SCR-02'
  | 'SCR-03'
  | 'SCR-04'
  | 'MESSAGES'
  | 'EXPERT-DETAIL'
  | 'DATA-AUTHORIZATION'
  | 'REAL-NAME'
  | 'SCR-08'
  | 'HEALTH-DATA';

export interface Expert {
  id: string;
  name: string;
  title: string;
  category: string;
  avatarUrl: string;
  rating: number;
  consultCount: number;
  tags: string[];
}

export interface UserProfile {
  nickname: string;
  realName: string;
  birthday: string;
  gender: string;
  idNumber: string;
  phone: string;
  email: string;
  height: string;
  weight: string;
  bloodType: string;
}

export interface BloodPressureData {
  systolic: string;
  diastolic: string;
  pulse: string;
  date: string;
  note: string;
}

export interface ExpertInfo {
  id: string;
  name: string;
  title: string;
  clinic: string;
  followers: number;
  posts: number;
  avatarBg: string;
  avatarImage?: string;
  description: string;
  authScopes: string[];
}

export interface Activity722State {
  step1Authorized: boolean;
  authorizedExpert: 'aimee' | 'bliss' | null;
  step2RealNameCompleted: boolean;
  step3Eligible: boolean;
  step4RecordedToday: boolean;
  lastRecordSlot?: 'morning' | 'evening';
  records: BloodPressureData[];
}
