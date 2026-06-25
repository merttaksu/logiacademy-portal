export interface CourseModule {
  id: string;
  title: string;
  description: string;
  type: 'Zorunlu' | 'Seçmeli';
  icon: 'code' | 'database' | 'brush' | 'school' | 'extension';
  progress: number; // percentage (0 to 100)
  weeks: WeekContent[];
}

export interface WeekContent {
  weekNumber: number;
  title: string;
  description: string;
  status: 'Tamamlandı' | 'Devam Ediyor' | 'Planlandı';
  materials: MaterialItem[];
}

export interface MaterialItem {
  id: string;
  title: string;
  type: 'Ders Notu' | 'Ödev' | 'Ek Kaynak' | 'Sunum' | 'Video';
  icon: string;
  isLocked?: boolean;
}

export interface Student {
  id: string;
  name: string;
  avatarInitials: string;
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  assignedSchools: string[];
  assignedCourses: string[]; // CourseModule IDs
}

export interface School {
  id: string;
  name: string;
  location: string;
}

export interface AttendanceRecord {
  studentId: string;
  status: 'present' | 'absent' | 'late';
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  category: 'Öğretim Kılavuzları' | 'Öğrenci Notları' | 'Harici Araçlar';
  type: 'Video' | 'PDF' | 'Web Sitesi' | 'DOCX';
  durationOrPages: string;
  fileSizeOrUrl: string;
  imageUrl?: string;
  icon: string;
}

export interface RecentTopic {
  id: string;
  title: string;
  course: string;
  updatedAt: string;
  icon: string;
  type: 'document' | 'quiz' | 'video';
  content?: string;
}

export interface LessonSchedule {
  id: string;
  time: string;
  endTime: string;
  title: string;
  location: string;
  studentsCount: number;
  borderClass: string;
  badge?: string;
}
