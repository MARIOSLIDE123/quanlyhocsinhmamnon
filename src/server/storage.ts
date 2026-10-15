import fs from 'fs';
import path from 'path';
import {
  Student,
  AttendanceRecord,
  HealthRecord,
  MealMenu,
  DailyActivity,
  LessonPlan,
  Announcement,
  Classroom,
  SchoolInfo,
  SchoolYear,
  UserAccount,
  DriveMediaItem,
  ParentCommunication,
  SystemAuditLog,
  DevelopmentalEvaluation
} from '../types';

export interface DatabaseState {
  school: SchoolInfo;
  schoolYears: SchoolYear[];
  classes: Classroom[];
  accounts: UserAccount[];
  students: Student[];
  attendance: AttendanceRecord[];
  healthRecords: HealthRecord[];
  evaluations: DevelopmentalEvaluation[];
  mealMenus: MealMenu[];
  activities: DailyActivity[];
  lessonPlans: LessonPlan[];
  announcements: Announcement[];
  mediaFiles: DriveMediaItem[];
  messages: ParentCommunication[];
  auditLogs: SystemAuditLog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'kindergarten_db.json');

// Initial seed data with authentic Vietnamese preschool details
const DEFAULT_INITIAL_STATE: DatabaseState = {
  school: {
    id: 'SCH-QS-01',
    name: 'TRƯỜNG MẦM NON QUỲNH SƠN 1',
    slogan: 'Nơi ươm mầm yêu thương – Vững bước tương lai cho trẻ thơ',
    address: 'Xã Quỳnh Sơn, Huyện Yên Dũng, Tỉnh Bắc Giang',
    phone: '0204 385 6789',
    email: 'c1quynhson@bacgiang.edu.vn',
    principalName: 'Cô Nguyễn Thị Mai',
    logoUrl: '/icon.svg',
    currentSchoolYearId: 'SY-2025-2026',
    currentSchoolYearName: '2025 - 2026'
  },
  schoolYears: [
    {
      id: 'SY-2025-2026',
      name: 'Năm học 2025 - 2026',
      startDate: '2025-09-05',
      endDate: '2026-05-31',
      isCurrent: true,
      status: 'active'
    },
    {
      id: 'SY-2024-2025',
      name: 'Năm học 2024 - 2025',
      startDate: '2024-09-05',
      endDate: '2025-05-31',
      isCurrent: false,
      status: 'archived'
    }
  ],
  classes: [
    {
      id: 'CLS-2TUOI-I',
      name: 'Lớp 2 Tuổi I - Trường Mầm non Quỳnh Sơn 1',
      gradeLevel: 'NhaTre',
      room: 'Phòng 101 - Khu nhà A (Tầng 1)',
      schoolYearId: 'SY-2025-2026',
      teacherId: 'TCH-01',
      teacherName: 'Cô Lê Thị Hạnh',
      assistantTeacherName: 'Cô Nguyễn Thị Thu',
      maxCapacity: 20,
      currentCount: 6,
      status: 'active',
      colorTheme: 'rose'
    },
    {
      id: 'CLS-CHOI-1',
      name: 'Lớp Chồi 1 (4 - 5 Tuổi)',
      gradeLevel: 'Choi',
      room: 'Phòng 201 - Tầng 2',
      schoolYearId: 'SY-2025-2026',
      teacherId: 'TCH-01',
      teacherName: 'Cô Nguyễn Thị Hồng Hạnh',
      assistantTeacherName: 'Cô Trần Mai Lan',
      maxCapacity: 25,
      currentCount: 8,
      status: 'active',
      colorTheme: 'rose'
    }
  ],
  accounts: [
    {
      id: 'ACC-01',
      uid: 'bgh',
      email: 'bgh@quynhson1.edu.vn',
      password: 'bgh123',
      displayName: 'Cô Nguyễn Thị Mai (Ban Giám Hiệu)',
      role: 'admin',
      phone: '0912 111 222',
      status: 'active'
    },
    {
      id: 'ACC-02',
      uid: 'giaovien',
      email: 'giaovien@quynhson1.edu.vn',
      password: 'gv123',
      displayName: 'Cô Lê Thị Hạnh (Chủ nhiệm Lớp 2 Tuổi I)',
      role: 'teacher',
      phone: '0908 333 444',
      classId: 'CLS-2TUOI-I',
      status: 'active'
    },
    {
      id: 'ACC-03',
      uid: 'phuhuynh',
      email: 'phuhuynh@quynhson1.edu.vn',
      password: 'ph123',
      displayName: 'Anh Hoàng Văn Nam (Phụ huynh bé An Nhiên)',
      role: 'parent',
      phone: '0988 555 666',
      classId: 'CLS-2TUOI-I',
      studentId: 'TRE-201',
      status: 'active'
    }
  ],
  students: [
    {
      id: 'TRE-001',
      studentCode: 'MN-2501',
      fullName: 'Trần Bảo Nam',
      nickname: 'Bắp',
      dateOfBirth: '2021-04-12',
      gender: 'Nam',
      classId: 'CLS-CHOI-1',
      className: 'Lớp Chồi 1 (4 - 5 Tuổi)',
      admissionDate: '2024-09-05',
      avatarUrl: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      healthNotes: 'Hơi nhạy cảm với thời tiết lạnh, cần uống nhiều nước ấm',
      allergies: ['Đậu phộng', 'Tôm'],
      bloodGroup: 'O',
      address: '12 Đường Hoa Đào, P. Linh Trung, TP. Thủ Đức',
      guardians: [
        {
          id: 'GD-01',
          fullName: 'Trần Quốc Bảo',
          phone: '0912 345 678',
          email: 'phuhuynh.baonam@gmail.com',
          relationship: 'Bố',
          occupation: 'Kỹ sư phần mềm',
          address: '12 Đường Hoa Đào, TP. Thủ Đức',
          isPrimaryContact: true,
          canPickup: true
        },
        {
          id: 'GD-02',
          fullName: 'Lê Thùy Dung',
          phone: '0918 765 432',
          relationship: 'Mẹ',
          occupation: 'Giáo viên',
          isPrimaryContact: false,
          canPickup: true
        }
      ],
      createdAt: '2024-09-01T08:00:00Z',
      updatedAt: '2026-03-01T10:00:00Z'
    },
    {
      id: 'TRE-002',
      studentCode: 'MN-2502',
      fullName: 'Nguyễn Ngọc Bảo An',
      nickname: 'Miu',
      dateOfBirth: '2021-08-20',
      gender: 'Nữ',
      classId: 'CLS-CHOI-1',
      className: 'Lớp Chồi 1 (4 - 5 Tuổi)',
      admissionDate: '2024-09-05',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      healthNotes: 'Sức khỏe tốt, hoạt bát, tích cực tham gia văn nghệ',
      allergies: [],
      bloodGroup: 'A',
      address: '45/3 Đường Võ Văn Ngân, TP. Thủ Đức',
      guardians: [
        {
          id: 'GD-03',
          fullName: 'Nguyễn Văn Hùng',
          phone: '0983 112 233',
          relationship: 'Bố',
          occupation: 'Bác sĩ',
          isPrimaryContact: true,
          canPickup: true
        }
      ],
      createdAt: '2024-09-01T08:00:00Z',
      updatedAt: '2026-03-01T10:00:00Z'
    },
    {
      id: 'TRE-003',
      studentCode: 'MN-2503',
      fullName: 'Phạm Minh Khôi',
      nickname: 'Ken',
      dateOfBirth: '2021-02-15',
      gender: 'Nam',
      classId: 'CLS-CHOI-1',
      className: 'Lớp Chồi 1 (4 - 5 Tuổi)',
      admissionDate: '2024-09-05',
      avatarUrl: 'https://images.unsplash.com/photo-1595454223600-91fb5799971d?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      healthNotes: 'Cận thị nhẹ, cần chú ý vị trí ngồi gần bảng',
      allergies: ['Sữa bò tươi (dùng sữa hạt đậu nành)'],
      bloodGroup: 'B',
      address: '88 Đường số 6, Linh Trung, Thủ Đức',
      guardians: [
        {
          id: 'GD-04',
          fullName: 'Phạm Quang Minh',
          phone: '0903 889 977',
          relationship: 'Bố',
          occupation: 'Kiến trúc sư',
          isPrimaryContact: true,
          canPickup: true
        }
      ],
      createdAt: '2024-09-01T08:00:00Z',
      updatedAt: '2026-03-01T10:00:00Z'
    },
    {
      id: 'TRE-004',
      studentCode: 'MN-2504',
      fullName: 'Võ Mai Phương Linh',
      nickname: 'Bông',
      dateOfBirth: '2021-11-05',
      gender: 'Nữ',
      classId: 'CLS-CHOI-1',
      className: 'Lớp Chồi 1 (4 - 5 Tuổi)',
      admissionDate: '2024-09-05',
      avatarUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      healthNotes: 'Bé ăn ngủ đều, thích vẽ tranh và nghe kể chuyện',
      allergies: [],
      bloodGroup: 'AB',
      address: '24 Đường số 2, Hiệp Bình Phước, Thủ Đức',
      guardians: [
        {
          id: 'GD-05',
          fullName: 'Võ Minh Trí',
          phone: '0977 445 566',
          relationship: 'Bố',
          isPrimaryContact: true,
          canPickup: true
        }
      ],
      createdAt: '2024-09-01T08:00:00Z',
      updatedAt: '2026-03-01T10:00:00Z'
    },
    {
      id: 'TRE-005',
      studentCode: 'MN-2505',
      fullName: 'Lê Hoàng Đăng Khoa',
      nickname: 'Tin Tin',
      dateOfBirth: '2021-06-28',
      gender: 'Nam',
      classId: 'CLS-CHOI-1',
      className: 'Lớp Chồi 1 (4 - 5 Tuổi)',
      admissionDate: '2024-09-05',
      avatarUrl: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      healthNotes: 'Năng động, cần nhắc uống nước sau giờ vận động ngoài trời',
      allergies: [],
      bloodGroup: 'O',
      address: '15/2 Kha Vạn Cân, Thủ Đức',
      guardians: [
        {
          id: 'GD-06',
          fullName: 'Lê Hoàng Hải',
          phone: '0938 123 999',
          relationship: 'Bố',
          isPrimaryContact: true,
          canPickup: true
        }
      ],
      createdAt: '2024-09-01T08:00:00Z',
      updatedAt: '2026-03-01T10:00:00Z'
    },
    {
      id: 'TRE-006',
      studentCode: 'MN-2506',
      fullName: 'Đặng Ngọc Vy Anh',
      nickname: 'Thỏ',
      dateOfBirth: '2021-09-14',
      gender: 'Nữ',
      classId: 'CLS-CHOI-1',
      className: 'Lớp Chồi 1 (4 - 5 Tuổi)',
      admissionDate: '2024-09-05',
      avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      healthNotes: 'Thích múa hát, tính cách hòa đồng vui vẻ',
      allergies: [],
      bloodGroup: 'A',
      address: '77 Tam Bình, Hiệp Bình Chánh, Thủ Đức',
      guardians: [
        {
          id: 'GD-07',
          fullName: 'Đặng Quốc Anh',
          phone: '0909 334 455',
          relationship: 'Bố',
          isPrimaryContact: true,
          canPickup: true
        }
      ],
      createdAt: '2024-09-01T08:00:00Z',
      updatedAt: '2026-03-01T10:00:00Z'
    },
    {
      id: 'TRE-007',
      studentCode: 'MN-2507',
      fullName: 'Bùi Gia Huy',
      nickname: 'Sóc',
      dateOfBirth: '2021-05-30',
      gender: 'Nam',
      classId: 'CLS-CHOI-1',
      className: 'Lớp Chồi 1 (4 - 5 Tuổi)',
      admissionDate: '2024-09-05',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      healthNotes: 'Bé hơi kén rau xanh, cô giáo chú ý dỗ dành',
      allergies: [],
      bloodGroup: 'O',
      address: '102 Quốc Lộ 1K, Linh Xuân, Thủ Đức',
      guardians: [
        {
          id: 'GD-08',
          fullName: 'Bùi Văn Tiến',
          phone: '0913 221 144',
          relationship: 'Bố',
          isPrimaryContact: true,
          canPickup: true
        }
      ],
      createdAt: '2024-09-01T08:00:00Z',
      updatedAt: '2026-03-01T10:00:00Z'
    },
    {
      id: 'TRE-008',
      studentCode: 'MN-2508',
      fullName: 'Hoàng Cát Tường',
      nickname: 'Dâu Tây',
      dateOfBirth: '2021-12-01',
      gender: 'Nữ',
      classId: 'CLS-CHOI-1',
      className: 'Lớp Chồi 1 (4 - 5 Tuổi)',
      admissionDate: '2024-09-05',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      healthNotes: 'Sức khỏe tốt, chăm học và lễ phép',
      allergies: [],
      bloodGroup: 'B',
      address: '39 Đường số 9, Linh Tây, Thủ Đức',
      guardians: [
        {
          id: 'GD-09',
          fullName: 'Hoàng Văn Vinh',
          phone: '0988 776 655',
          relationship: 'Bố',
          isPrimaryContact: true,
          canPickup: true
        }
      ],
      createdAt: '2024-09-01T08:00:00Z',
      updatedAt: '2026-03-01T10:00:00Z'
    }
  ],
  attendance: [
    {
      id: 'ATT-01',
      date: new Date().toISOString().split('T')[0],
      studentId: 'TRE-001',
      studentName: 'Trần Bảo Nam',
      classId: 'CLS-CHOI-1',
      status: 'present',
      arrivalTime: '07:35',
      temperature: 36.5,
      updatedBy: 'Cô Hồng Hạnh',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'ATT-02',
      date: new Date().toISOString().split('T')[0],
      studentId: 'TRE-002',
      studentName: 'Nguyễn Ngọc Bảo An',
      classId: 'CLS-CHOI-1',
      status: 'present',
      arrivalTime: '07:40',
      temperature: 36.6,
      updatedBy: 'Cô Hồng Hạnh',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'ATT-03',
      date: new Date().toISOString().split('T')[0],
      studentId: 'TRE-003',
      studentName: 'Phạm Minh Khôi',
      classId: 'CLS-CHOI-1',
      status: 'late',
      arrivalTime: '08:25',
      pickupNote: 'Mẹ báo kẹt xe nên đưa bé đến muộn',
      temperature: 36.7,
      updatedBy: 'Cô Hồng Hạnh',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'ATT-04',
      date: new Date().toISOString().split('T')[0],
      studentId: 'TRE-004',
      studentName: 'Võ Mai Phương Linh',
      classId: 'CLS-CHOI-1',
      status: 'present',
      arrivalTime: '07:45',
      temperature: 36.5,
      updatedBy: 'Cô Hồng Hạnh',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'ATT-05',
      date: new Date().toISOString().split('T')[0],
      studentId: 'TRE-005',
      studentName: 'Lê Hoàng Đăng Khoa',
      classId: 'CLS-CHOI-1',
      status: 'excused',
      pickupNote: 'Phụ huynh xin nghỉ về quê đám giỗ',
      updatedBy: 'Cô Hồng Hạnh',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'ATT-06',
      date: new Date().toISOString().split('T')[0],
      studentId: 'TRE-006',
      studentName: 'Đặng Ngọc Vy Anh',
      classId: 'CLS-CHOI-1',
      status: 'present',
      arrivalTime: '07:30',
      temperature: 36.4,
      updatedBy: 'Cô Hồng Hạnh',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'ATT-07',
      date: new Date().toISOString().split('T')[0],
      studentId: 'TRE-007',
      studentName: 'Bùi Gia Huy',
      classId: 'CLS-CHOI-1',
      status: 'present',
      arrivalTime: '07:50',
      temperature: 36.6,
      updatedBy: 'Cô Hồng Hạnh',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'ATT-08',
      date: new Date().toISOString().split('T')[0],
      studentId: 'TRE-008',
      studentName: 'Hoàng Cát Tường',
      classId: 'CLS-CHOI-1',
      status: 'present',
      arrivalTime: '07:38',
      temperature: 36.5,
      updatedBy: 'Cô Hồng Hạnh',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  healthRecords: [
    {
      id: 'HLT-01',
      studentId: 'TRE-001',
      studentName: 'Trần Bảo Nam',
      classId: 'CLS-CHOI-1',
      recordDate: '2026-03-01',
      heightCm: 106.5,
      weightKg: 17.8,
      bmi: 15.7,
      bmiStatus: 'Bình thường',
      eyesight: '10/10',
      dentalHealth: 'Tốt, không sâu răng',
      temperature: 36.5,
      healthNotes: 'Phát triển cân đối, đạt chuẩn WHO cho trẻ 4 tuổi',
      checkedBy: 'Y tế trường - Cô Hoàng Lan'
    },
    {
      id: 'HLT-02',
      studentId: 'TRE-002',
      studentName: 'Nguyễn Ngọc Bảo An',
      classId: 'CLS-CHOI-1',
      recordDate: '2026-03-01',
      heightCm: 104.0,
      weightKg: 16.2,
      bmi: 15.0,
      bmiStatus: 'Bình thường',
      eyesight: '10/10',
      dentalHealth: 'Tốt',
      temperature: 36.6,
      healthNotes: 'Thể trạng tốt, lanh lợi',
      checkedBy: 'Y tế trường - Cô Hoàng Lan'
    },
    {
      id: 'HLT-03',
      studentId: 'TRE-003',
      studentName: 'Phạm Minh Khôi',
      classId: 'CLS-CHOI-1',
      recordDate: '2026-03-01',
      heightCm: 108.0,
      weightKg: 19.5,
      bmi: 16.7,
      bmiStatus: 'Nguy cơ thừa cân',
      eyesight: 'Có dấu hiệu nheo mắt khi nhìn xa',
      dentalHealth: 'Sún răng sữa nhẹ hàm trên',
      temperature: 36.7,
      healthNotes: 'Tăng cường vận động thể chất ngoài trời',
      checkedBy: 'Y tế trường - Cô Hoàng Lan'
    }
  ],
  evaluations: [
    {
      id: 'EVL-01',
      studentId: 'TRE-001',
      studentName: 'Trần Bảo Nam',
      classId: 'CLS-CHOI-1',
      monthYear: '03/2026',
      domainPhysical: 5,
      domainPhysicalNote: 'Chạy nhảy nhanh nhẹn, giữ thăng bằng tốt khi đi trên vạch kẻ',
      domainCognitive: 4,
      domainCognitiveNote: 'Nhận biết đúng các hình khối cơ bản và đếm đến 10',
      domainLanguage: 5,
      domainLanguageNote: 'Phát âm tròn vành rõ chữ, biết diễn đạt mong muốn rõ ràng',
      domainSocialEmotional: 5,
      domainSocialEmotionalNote: 'Biết chia sẻ đồ chơi với bạn, lễ phép chào hỏi cô giáo',
      domainAesthetic: 4,
      domainAestheticNote: 'Tô màu khéo léo, thích hát các bài hát về gia đình',
      generalRemark: 'Bé Bảo Nam rất ngoan, tiếp thu bài học tích cực và hòa đồng cùng các bạn!',
      teacherId: 'TCH-01',
      teacherName: 'Cô Nguyễn Thị Hồng Hạnh',
      createdAt: '2026-03-10T14:30:00Z'
    }
  ],
  mealMenus: [
    {
      id: 'MNU-01',
      date: new Date().toISOString().split('T')[0],
      dayOfWeek: 'Hôm nay',
      mealType: 'breakfast',
      mealTypeName: 'Bữa Sáng (07:45 - 08:15)',
      dishName: 'Cháo thịt bò bằm bí đỏ đậu hà lan',
      dishComponents: ['Cháo gạo thơm ST25', 'Thịt bò tươi băm', 'Bí đỏ hồ lô', 'Đậu hà lan nghiền', 'Dầu oliu dinh dưỡng'],
      calorieKcal: 280,
      notes: 'Thơm ngon, dễ tiêu hóa, giàu sắt và vitamin A'
    },
    {
      id: 'MNU-02',
      date: new Date().toISOString().split('T')[0],
      dayOfWeek: 'Hôm nay',
      mealType: 'snack_morning',
      mealTypeName: 'Bữa Phụ Sáng (09:30)',
      dishName: 'Sữa chua men sống hoa quả dầm',
      dishComponents: ['Sữa chua tươi lên men tự nhiên', 'Thanh long ruột đỏ', 'Chuối tiêu chín mềm'],
      calorieKcal: 110,
      notes: 'Bổ sung lợi khuẩn đường ruột'
    },
    {
      id: 'MNU-03',
      date: new Date().toISOString().split('T')[0],
      dayOfWeek: 'Hôm nay',
      mealType: 'lunch',
      mealTypeName: 'Bữa Trưa (11:15 - 11:50)',
      dishName: 'Cơm tám dẻo + Tôm thịt rim mặn ngọt + Canh cải cúc cá hồi',
      dishComponents: ['Cơm trắng tám Thái', 'Thịt nạc vai rim tôm đồng bóc vỏ', 'Canh rau cải cúc nấu cá hồi Nauy phi lê', 'Tráng miệng: Đu đủ ngọt'],
      calorieKcal: 450,
      allergyNotice: 'Lớp có bé Trần Bảo Nam dị ứng tôm: Nhà bếp đổi sang thịt nạc rim trứng cút',
      notes: 'Bữa trưa đầy đủ 4 nhóm chất: đạm, béo, đường bột, vitamin khoáng chất'
    },
    {
      id: 'MNU-04',
      date: new Date().toISOString().split('T')[0],
      dayOfWeek: 'Hôm nay',
      mealType: 'snack_afternoon',
      mealTypeName: 'Bữa Xế Chiều (14:30)',
      dishName: 'Phở bò Hà Nội mini + Nước cam tươi mật ong',
      dishComponents: ['Bánh phở tươi mềm cắt ngắn', 'Nước hầm xương ngọt tự nhiên', 'Nước cam sành vắt ấm'],
      calorieKcal: 260,
      notes: 'Giúp bé nạp lại năng lượng vui chơi buổi chiều'
    }
  ],
  activities: [
    {
      id: 'ACT-01',
      classId: 'CLS-CHOI-1',
      date: new Date().toISOString().split('T')[0],
      timeStart: '07:15',
      timeEnd: '08:00',
      title: 'Đón trẻ – Thể dục sáng vui khỏe',
      category: 'Đón trẻ',
      description: 'Đón bé tại cửa lớp, kiểm tra nhiệt độ, hướng dẫn cất ba lô, tập bài thể dục theo điệu nhạc Chú ếch con',
      teacherInCharge: 'Cô Hồng Hạnh',
      location: 'Sân trường mầm non'
    },
    {
      id: 'ACT-02',
      classId: 'CLS-CHOI-1',
      date: new Date().toISOString().split('T')[0],
      timeStart: '08:00',
      timeEnd: '08:30',
      title: 'Bữa ăn sáng dinh dưỡng',
      category: 'Hoạt động học',
      description: 'Rèn luyện kỹ năng xúc ăn tự lập, quy tắc không làm rơi vãi thức ăn',
      teacherInCharge: 'Cô Mai Lan',
      location: 'Phòng học Lớp Chồi 1'
    },
    {
      id: 'ACT-03',
      classId: 'CLS-CHOI-1',
      date: new Date().toISOString().split('T')[0],
      timeStart: '08:45',
      timeEnd: '09:30',
      title: 'Khám phá khoa học: Sự kỳ diệu của hạt mầm',
      category: 'Hoạt động học',
      description: 'Bé thực hành quan sát hạt đậu nảy mầm trong ly bông gòn, tưới nước và ghi lại cảm xúc',
      teacherInCharge: 'Cô Hồng Hạnh',
      location: 'Góc thiên nhiên lớp Chồi 1'
    },
    {
      id: 'ACT-04',
      classId: 'CLS-CHOI-1',
      date: new Date().toISOString().split('T')[0],
      timeStart: '09:45',
      timeEnd: '10:45',
      title: 'Vui chơi ngoài trời & trò chơi liên hoàn',
      category: 'Vui chơi ngoài trời',
      description: 'Chơi bóng rổ mini, bập bênh, cầu trượt và trò chơi dân gian Rồng rắn lên mây',
      teacherInCharge: 'Cô Hồng Hạnh & Cô Mai Lan',
      location: 'Khu vận động thể chất ngoài trời'
    },
    {
      id: 'ACT-05',
      classId: 'CLS-CHOI-1',
      date: new Date().toISOString().split('T')[0],
      timeStart: '11:15',
      timeEnd: '12:00',
      title: 'Vệ sinh cá nhân & Bữa trưa vui vẻ',
      category: 'Ăn trưa',
      description: 'Rửa tay 6 bước xà phòng diệt khuẩn, xếp hàng nhận khay ăn trưa',
      teacherInCharge: 'Cô Hồng Hạnh',
      location: 'Phòng học Lớp Chồi 1'
    },
    {
      id: 'ACT-06',
      classId: 'CLS-CHOI-1',
      date: new Date().toISOString().split('T')[0],
      timeStart: '12:00',
      timeEnd: '14:15',
      title: 'Giấc ngủ trưa êm ái',
      category: 'Ngủ trưa',
      description: 'Nghe nhạc êm dịu Mozart, cô kiểm tra đắp chăn ấm cho các bé',
      teacherInCharge: 'Cô Mai Lan',
      location: 'Phòng ngủ Lớp Chồi 1'
    },
    {
      id: 'ACT-07',
      classId: 'CLS-CHOI-1',
      date: new Date().toISOString().split('T')[0],
      timeStart: '15:15',
      timeEnd: '16:00',
      title: 'Hoạt động chiều: Bé tập làm ca sĩ',
      category: 'Hoạt động chiều',
      description: 'Ôn luyện bài hát Cô và Mẹ, tập múa các động tác phụ họa dễ thương',
      teacherInCharge: 'Cô Hồng Hạnh',
      location: 'Phòng học m nhạc'
    },
    {
      id: 'ACT-08',
      classId: 'CLS-CHOI-1',
      date: new Date().toISOString().split('T')[0],
      timeStart: '16:15',
      timeEnd: '17:30',
      title: 'Trả trẻ & Trao đổi tình hình trong ngày cùng phụ huynh',
      category: 'Trả trẻ',
      description: 'Giao bé cho đúng người đón đã đăng ký trên hồ sơ, trao đổi nhanh về ăn ngủ và tinh thần của trẻ',
      teacherInCharge: 'Cô Hồng Hạnh',
      location: 'Sảnh đón trường'
    }
  ],
  lessonPlans: [
    {
      id: 'LP-01',
      title: 'Kế hoạch giáo dục tuần 26: Bé yêu cây xanh và hoa thơm',
      theme: 'Chủ đề: Thế giới thực vật xung quanh em',
      gradeLevel: 'Choi',
      classId: 'CLS-CHOI-1',
      weekNumber: 26,
      month: 3,
      year: 2026,
      startDate: '2026-03-09',
      endDate: '2026-03-13',
      objectives: [
        'Trẻ nhận biết và gọi đúng tên các bộ phận của cây: rễ, thân, lá, hoa, quả',
        'Phát triển kỹ năng quan sát, so sánh sự khác nhau giữa cây thân gỗ và cây thân leo',
        'Giáo dục trẻ thói quen yêu thiên nhiên, không ngắt hoa bẻ cành',
        'Rèn kỹ năng khéo léo của đôi tay qua hoạt động xé dán vườn hoa mùa xuân'
      ],
      activitiesDetail: 'Thứ 2: Khám phá các loại cây trong sân trường. Thứ 3: Làm quen với toán - Đếm số lượng cánh hoa (phạm vi 5). Thứ 4: Tạo hình - Xé dán cánh hoa bằng giấy màu. Thứ 5: m nhạc - Hát và vận động bài Em yêu cây xanh. Thứ 6: Tổng kết chủ đề, liên hoan hoa quả.',
      teacherId: 'TCH-01',
      teacherName: 'Cô Nguyễn Thị Hồng Hạnh',
      driveFileId: 'DRIVE-DOC-01',
      driveFileName: 'GiaoAn_Tuan26_TheGioiThucVat_Choi1.docx',
      driveFileUrl: 'https://docs.google.com/document/d/demo-giao-an-choi-1',
      status: 'approved',
      createdAt: '2026-03-05T09:00:00Z'
    }
  ],
  announcements: [
    {
      id: 'ANC-01',
      title: 'Thông báo kế hoạch tham quan nông trại xanh cho khối Chồi và Lá',
      content: 'Kính gửi Quý Phụ huynh, nhằm giúp các bé có cơ hội trải nghiệm thực tế về thế giới nông nghiệp và động thực vật, nhà trường tổ chức buổi dã ngoại tại Nông trại Sinh thái Happy Farm vào Thứ Sáu tới. Nhà trường kính mời Quý phụ huynh xem chi tiết lịch trình và chuẩn bị trang phục nón, giày thể thao cho bé.',
      type: 'event',
      targetType: 'all',
      authorName: 'Ban Giám Hiệu',
      authorRole: 'Hiệu trưởng',
      isPinned: true,
      createdAt: '2026-03-12T08:00:00Z',
      readCount: 36,
      totalTarget: 45
    },
    {
      id: 'ANC-02',
      title: 'Nhắc nhở tiêm chủng bổ sung và cân đo sức khỏe định kỳ tháng 3',
      content: 'Phòng Y tế trường sẽ phối hợp với Trạm Y tế Phường tổ chức khám chuyên khoa răng hàm mặt và uống bổ sung Vitamin A cho toàn bộ các bé. Phụ huynh vui lòng ký vào sổ sức khỏe tại bàn đón trả trẻ của lớp.',
      type: 'urgent',
      targetType: 'all',
      authorName: 'Cô Hoàng Lan',
      authorRole: 'Cán bộ Y tế',
      isPinned: false,
      createdAt: '2026-03-08T10:30:00Z',
      readCount: 42,
      totalTarget: 45
    }
  ],
  mediaFiles: [
    {
      id: 'MED-01',
      fileId: 'DRIVE-IMG-01',
      fileName: 'hoat_dong_trong_cay_choi1_01.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 2450000,
      category: '03_HINH_ANH_HOAT_DONG',
      categoryLabel: 'Ảnh hoạt động của trẻ',
      classId: 'CLS-CHOI-1',
      activityDate: '2026-03-11',
      title: 'Các bé lớp Chồi 1 hào hứng gieo hạt giống trong giờ Khám phá',
      webViewLink: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      thumbnailLink: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
      uploadedBy: 'Cô Hồng Hạnh',
      uploadedAt: '2026-03-11T16:00:00Z'
    },
    {
      id: 'MED-02',
      fileId: 'DRIVE-IMG-02',
      fileName: 'gio_the_duc_sang_san_truong.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 3100000,
      category: '03_HINH_ANH_HOAT_DONG',
      categoryLabel: 'Ảnh hoạt động của trẻ',
      classId: 'CLS-CHOI-1',
      activityDate: '2026-03-12',
      title: 'Bài thể dục đồng diễn buổi sáng dưới ánh nắng sớm rực rỡ',
      webViewLink: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
      thumbnailLink: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=200&auto=format&fit=crop&q=80',
      uploadedBy: 'Cô Hồng Hạnh',
      uploadedAt: '2026-03-12T08:30:00Z'
    },
    {
      id: 'MED-03',
      fileId: 'DRIVE-DOC-01',
      fileName: 'GiaoAn_Tuan26_TheGioiThucVat_Choi1.docx',
      mimeType: 'application/vnd.google-apps.document',
      sizeBytes: 850000,
      category: '02_GIAO_AN_KE_HOACH',
      categoryLabel: 'Giáo án & Kế hoạch',
      classId: 'CLS-CHOI-1',
      activityDate: '2026-03-05',
      title: 'Giáo án tuần 26 - Chủ đề Thế giới thực vật',
      webViewLink: 'https://docs.google.com/document/d/demo-preview',
      uploadedBy: 'Cô Hồng Hạnh',
      uploadedAt: '2026-03-05T09:00:00Z'
    }
  ],
  messages: [
    {
      id: 'MSG-01',
      studentId: 'TRE-001',
      studentName: 'Trần Bảo Nam',
      classId: 'CLS-CHOI-1',
      senderId: 'ACC-03',
      senderName: 'Anh Trần Quốc Bảo (Bố bé Bảo Nam)',
      senderRole: 'parent',
      recipientId: 'ACC-02',
      content: 'Chào cô Hạnh ạ. Hôm nay buổi trưa bé Bắp có ăn hết suất tôm rim không cô? Ở nhà bé hơi nhạy cảm với hải sản một xíu ạ.',
      createdAt: '2026-03-12T13:10:00Z',
      isRead: true
    },
    {
      id: 'MSG-02',
      studentId: 'TRE-001',
      studentName: 'Trần Bảo Nam',
      classId: 'CLS-CHOI-1',
      senderId: 'ACC-02',
      senderName: 'Cô Hồng Hạnh',
      senderRole: 'teacher',
      recipientId: 'ACC-03',
      content: 'Chào anh Bảo! Dạ hôm nay nhà bếp có lưu ý dị ứng của bé Nam trong sổ thực đơn nên đã đổi sang món thịt nạc rim trứng cút cho bé rồi ạ. Bé ăn rất ngoan và hết cả khay cơm luôn anh nhé!',
      createdAt: '2026-03-12T13:25:00Z',
      isRead: true
    }
  ],
  auditLogs: [
    {
      id: 'LOG-01',
      timestamp: new Date().toISOString(),
      action: 'HE_THONG_KHOI_DONG',
      entity: 'HE_THONG',
      entityId: 'SYS',
      performedBy: 'Hệ thống tự động',
      details: 'Khởi tạo thành công phiên làm việc của ứng dụng Cô Hạnh Mầm Non'
    }
  ]
};

let memoryDb: DatabaseState | null = null;

// Ensure directory exists safely
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  // Read-only environment on Vercel
}

// Load database state from disk or initialize
export function loadDatabase(): DatabaseState {
  if (memoryDb) {
    return memoryDb;
  }
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      memoryDb = JSON.parse(content);
      return memoryDb!;
    }
  } catch (error) {
    console.error('Lỗi khi đọc file database:', error);
  }
  memoryDb = JSON.parse(JSON.stringify(DEFAULT_INITIAL_STATE));
  saveDatabase(memoryDb!);
  return memoryDb!;
}

// Save database state to disk
export function saveDatabase(data: DatabaseState): void {
  memoryDb = data;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    try {
      const tmpPath = path.join('/tmp', 'kindergarten_db.json');
      fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      // In-memory fallback
    }
  }
}

// Helper to log audit actions
export function logSystemAction(action: string, entity: string, entityId: string, performedBy: string, details: string) {
  const db = loadDatabase();
  const log: SystemAuditLog = {
    id: 'LOG-' + Date.now(),
    timestamp: new Date().toISOString(),
    action,
    entity,
    entityId,
    performedBy,
    details
  };
  db.auditLogs.unshift(log);
  if (db.auditLogs.length > 200) {
    db.auditLogs = db.auditLogs.slice(0, 200);
  }
  saveDatabase(db);
}
