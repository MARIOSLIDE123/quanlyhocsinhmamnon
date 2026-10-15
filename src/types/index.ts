export type UserRole = 'teacher' | 'parent';

export interface UserAccount {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  password?: string;
  phone?: string;
  avatarUrl?: string;
  classId?: string; // Assigned class for teachers or child's class for parents
  studentId?: string; // Associated child ID for parents
  isDemo?: boolean; // Demo account flag with restricted permissions
  status: 'active' | 'inactive';
}

export interface SchoolInfo {
  id: string;
  name: string;
  slogan: string;
  address: string;
  phone: string;
  email: string;
  principalName: string;
  logoUrl?: string;
  currentSchoolYearId: string;
  currentSchoolYearName: string;
}

export interface SchoolYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: 'active' | 'archived';
}

export interface Classroom {
  id: string;
  name: string;
  gradeLevel: 'Mam' | 'Choi' | 'La' | 'NhaTre'; // Nhà trẻ (18-36m), Mầm (3-4t), Chồi (4-5t), Lá (5-6t)
  room: string;
  schoolYearId: string;
  teacherId: string;
  teacherName: string;
  assistantTeacherName?: string;
  maxCapacity: number;
  currentCount: number;
  status: 'active' | 'closed';
  colorTheme: string;
}

export interface Guardian {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  relationship: 'Mẹ' | 'Bố' | 'Ông' | 'Bà' | 'Người giám hộ';
  occupation?: string;
  address?: string;
  isPrimaryContact: boolean;
  canPickup: boolean;
  avatarUrl?: string;
}

export interface Student {
  id: string;
  studentCode: string; // e.g., TRE-001
  fullName: string;
  nickname?: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: 'Nam' | 'Nữ';
  classId: string;
  className?: string;
  admissionDate: string;
  avatarUrl?: string;
  avatarInitials?: string;
  avatarColor?: string;
  status: 'active' | 'leave' | 'suspended';
  healthNotes?: string;
  allergies?: string[];
  bloodGroup?: string;
  address?: string;
  guardians: Guardian[];
  createdAt: string;
  updatedAt: string;
}

export type AttendanceStatus = 'present' | 'excused' | 'unexcused' | 'late' | 'early' | 'unmarked';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  studentName?: string;
  classId: string;
  status: AttendanceStatus;
  arrivalTime?: string; // HH:mm
  pickupTime?: string; // HH:mm
  pickupPersonName?: string;
  pickupNote?: string;
  temperature?: number; // e.g. 36.5
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthRecord {
  id: string;
  studentId: string;
  studentName?: string;
  classId: string;
  recordDate: string; // YYYY-MM-DD
  heightCm: number;
  weightKg: number;
  bmi: number;
  bmiStatus: 'Suy dinh dưỡng' | 'Bình thường' | 'Nguy cơ thừa cân' | 'Béo phì';
  eyesight?: string;
  dentalHealth?: string;
  temperature?: number;
  healthNotes?: string;
  checkedBy: string;
}

export interface DevelopmentalEvaluation {
  id: string;
  studentId: string;
  studentName?: string;
  classId: string;
  monthYear: string; // MM/YYYY
  domainPhysical: number; // 1-5 scale or description
  domainPhysicalNote?: string;
  domainCognitive: number;
  domainCognitiveNote?: string;
  domainLanguage: number;
  domainLanguageNote?: string;
  domainSocialEmotional: number;
  domainSocialEmotionalNote?: string;
  domainAesthetic: number;
  domainAestheticNote?: string;
  generalRemark: string;
  teacherId: string;
  teacherName: string;
  createdAt: string;
}

export interface DailyActivity {
  id: string;
  classId: string;
  date: string; // YYYY-MM-DD
  timeStart: string; // e.g. "07:30"
  timeEnd: string; // e.g. "08:15"
  title: string;
  category: 'Đón trẻ' | 'Thể dục sáng' | 'Hoạt động học' | 'Vui chơi ngoài trời' | 'Ăn trưa' | 'Ngủ trưa' | 'Hoạt động chiều' | 'Trả trẻ';
  description: string;
  teacherInCharge: string;
  location?: string;
}

export interface MealMenu {
  id: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: string; // Thứ 2, Thứ 3, etc.
  mealType: 'breakfast' | 'snack_morning' | 'lunch' | 'snack_afternoon';
  mealTypeName: string; // Bữa Sáng, Bữa Phụ Sáng, Bữa Trưa, Bữa Xế
  dishName: string;
  dishComponents: string[]; // e.g. ["Cơm tấm sườn", "Canh bí đao thịt bằm", "Chuối sứ"]
  calorieKcal?: number;
  allergyNotice?: string;
  notes?: string;
}

export interface LessonPlan {
  id: string;
  title: string;
  theme: string; // e.g. "Chủ đề: Bản thân & Gia đình"
  gradeLevel: 'Mam' | 'Choi' | 'La' | 'NhaTre';
  classId?: string;
  weekNumber: number;
  month: number;
  year: number;
  startDate: string;
  endDate: string;
  objectives: string[];
  activitiesDetail: string;
  teacherId: string;
  teacherName: string;
  driveFileId?: string;
  driveFileName?: string;
  driveFileUrl?: string;
  status: 'draft' | 'approved' | 'completed';
  createdAt: string;
}

export interface DriveMediaItem {
  id: string;
  fileId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  category: '01_HO_SO_TRE' | '02_GIAO_AN_KE_HOACH' | '03_HINH_ANH_HOAT_DONG' | '04_VIDEO_HOAT_DONG' | '05_TAI_LIEU_HOC_LIEU' | '06_BAO_CAO' | '07_TEP_DINH_KEM';
  categoryLabel: string;
  classId?: string;
  studentId?: string;
  activityDate?: string;
  title: string;
  description?: string;
  webViewLink: string;
  thumbnailLink?: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'urgent' | 'general' | 'event' | 'nutrition' | 'fee';
  targetType: 'all' | 'class' | 'teachers';
  targetClassId?: string;
  targetClassName?: string;
  authorName: string;
  authorRole: string;
  isPinned: boolean;
  createdAt: string;
  readCount: number;
  totalTarget: number;
}

export interface ParentCommunication {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  action: string;
  entity: string;
  entityId: string;
  performedBy: string;
  details: string;
}

export interface SystemConfig {
  spreadsheetId: string;
  spreadsheetName: string;
  driveRootFolderId: string;
  driveRootFolderName: string;
  appsScriptUrl: string;
  isGasConnected: boolean;
  lastSyncAt: string | null;
  totalSyncedSheets: number;
}
