import React, { useState, useEffect } from 'react';
import {
  SchoolInfo,
  Classroom,
  Student,
  AttendanceRecord,
  HealthRecord,
  DevelopmentalEvaluation,
  MealMenu,
  DailyActivity,
  LessonPlan,
  Announcement,
  DriveMediaItem,
  ParentCommunication,
  SystemAuditLog,
  UserAccount,
  UserRole
} from './types';
import { apiClient } from './services/api';

// Views
import { LoginView } from './views/LoginView';
import { ParentPortalView } from './views/ParentPortalView';
import { DashboardView } from './views/DashboardView';
import { StudentsView } from './views/StudentsView';
import { AttendanceView } from './views/AttendanceView';
import { ScheduleView } from './views/ScheduleView';
import { MealsView } from './views/MealsView';
import { HealthView } from './views/HealthView';
import { CurriculumView } from './views/CurriculumView';
import { GalleryView } from './views/GalleryView';
import { CommunicationView } from './views/CommunicationView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';

// Components
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { GoogleIntegrationModal } from './components/GoogleIntegrationModal';
import { PrintableReportModal } from './components/PrintableReportModal';

// Icons
import {
  LayoutDashboard,
  Users,
  CheckCircle,
  Calendar,
  Utensils,
  Activity,
  BookOpen,
  Image as ImageIcon,
  Bell,
  BarChart3,
  Settings,
  Menu,
  X,
  FileSpreadsheet,
  Heart,
  ShieldCheck,
  LogOut,
  GraduationCap,
  Sparkles,
  UserCheck
} from 'lucide-react';

export function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Application State
  const [school, setSchool] = useState<SchoolInfo | null>(null);
  const [classes, setClasses] = useState<Classroom[]>([]);
  const [currentClassId, setCurrentClassId] = useState<string>('CLS-2TUOI-I');
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>('teacher');

  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [evaluations, setEvaluations] = useState<DevelopmentalEvaluation[]>([]);
  const [mealMenus, setMealMenus] = useState<MealMenu[]>([]);
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [mediaFiles, setMediaFiles] = useState<DriveMediaItem[]>([]);
  const [messages, setMessages] = useState<ParentCommunication[]>([]);
  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>([]);

  // Modals & Navigation State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [gasStatus, setGasStatus] = useState<any>(null);

  // Load initial data from fullstack backend
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [initialRes, statusRes] = await Promise.all([
        apiClient.getInitialData(),
        apiClient.getGasStatus()
      ]);

      if (initialRes.success && initialRes.data) {
        const d = initialRes.data;
        setSchool(d.school);
        setClasses(d.classes);
        setAccounts(d.accounts);
        setStudents(d.students);
        setAttendance(d.attendance);
        setHealthRecords(d.healthRecords);
        setEvaluations(d.evaluations);
        setMealMenus(d.mealMenus);
        setActivities(d.activities);
        setLessonPlans(d.lessonPlans);
        setAnnouncements(d.announcements);
        setMediaFiles(d.mediaFiles);
        setMessages(d.messages);
        setAuditLogs(d.auditLogs);

        // Check if there is an active logged-in session in localStorage
        const savedAuth = localStorage.getItem('kindergarten_auth_user');
        if (savedAuth) {
          try {
            const parsed = JSON.parse(savedAuth);
            const verified = d.accounts.find((a: any) => a.uid === parsed.uid || a.id === parsed.id) || parsed;
            setCurrentUser(verified);
            setCurrentRole(verified.role || 'teacher');
            if (verified.classId) {
              setCurrentClassId(verified.classId);
            }
          } catch (e) {
            setCurrentUser(null);
          }
        } else {
          // If no session, require login first!
          setCurrentUser(null);
        }
      }

      if (statusRes.success) {
        setGasStatus(statusRes.data);
      }
    } catch (err) {
      console.error('Lỗi khi nạp dữ liệu mầm non:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Login handler
  const handleLogin = (user: UserAccount) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    if (user.classId) {
      setCurrentClassId(user.classId);
    }
    localStorage.setItem('kindergarten_auth_user', JSON.stringify(user));
    setCurrentView('dashboard');
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('kindergarten_auth_user');
    setCurrentUser(null);
  };

  // Switch role helper for testing
  const handleRoleChange = (role: UserRole) => {
    const targetUser = accounts.find(a => a.role === role);
    if (targetUser) {
      handleLogin(targetUser);
    } else {
      setCurrentRole(role);
    }
  };

  const currentClass = classes.find(c => c.id === currentClassId) || classes[0] || {
    id: 'CLS-2TUOI-I',
    name: 'Lớp 2 Tuổi I - Trường Mầm non Quỳnh Sơn 1',
    gradeLevel: 'NhaTre' as const,
    room: 'Phòng 101 - Khu nhà A (Tầng 1)',
    schoolYearId: 'SY-2025-2026',
    teacherId: 'TCH-01',
    teacherName: 'Cô Lê Thị Hạnh',
    maxCapacity: 20,
    currentCount: 6,
    status: 'active' as const,
    colorTheme: 'rose'
  };

  // CRUD Handlers
  const handleAddStudent = async (studentData: Partial<Student>) => {
    const res = await apiClient.addStudent(studentData);
    if (res.success) {
      setStudents(prev => [res.data, ...prev]);
    }
  };

  const handleUpdateStudent = async (id: string, updates: Partial<Student>) => {
    const res = await apiClient.updateStudent(id, updates);
    if (res.success) {
      setStudents(prev => prev.map(s => s.id === id ? res.data : s));
    }
  };

  const handleDeleteStudent = async (id: string) => {
    const res = await apiClient.deleteStudent(id);
    if (res.success) {
      setStudents(prev => prev.map(s => s.id === id ? { ...s, status: 'leave' } : s));
    }
  };

  const handleSaveAttendance = async (records: AttendanceRecord[]) => {
    const res = await apiClient.batchSaveAttendance(records);
    if (res.success) {
      setAttendance(prev => {
        const map = new Map(prev.map(a => [`${a.date}_${a.studentId}`, a]));
        for (const r of res.data) {
          map.set(`${r.date}_${r.studentId}`, r);
        }
        return Array.from(map.values());
      });
    }
  };

  const handleAddHealthRecord = async (data: Partial<HealthRecord>) => {
    const res = await apiClient.addHealthRecord(data);
    if (res.success) {
      setHealthRecords(prev => [res.data, ...prev]);
    }
  };

  const handleAddEvaluation = async (data: Partial<DevelopmentalEvaluation>) => {
    const res = await apiClient.addEvaluation(data);
    if (res.success) {
      setEvaluations(prev => [res.data, ...prev]);
    }
  };

  const handleSaveMeal = async (data: Partial<MealMenu>) => {
    const res = await apiClient.saveMealMenu(data);
    if (res.success) {
      setMealMenus(prev => {
        const idx = prev.findIndex(m => m.id === res.data.id);
        if (idx !== -1) {
          const cp = [...prev];
          cp[idx] = res.data;
          return cp;
        }
        return [...prev, res.data];
      });
    }
  };

  const handleSaveActivity = async (data: Partial<DailyActivity>) => {
    const res = await apiClient.saveActivity(data);
    if (res.success) {
      setActivities(prev => {
        const idx = prev.findIndex(a => a.id === res.data.id);
        if (idx !== -1) {
          const cp = [...prev];
          cp[idx] = res.data;
          return cp;
        }
        return [...prev, res.data];
      });
    }
  };

  const handleSaveLessonPlan = async (data: Partial<LessonPlan>) => {
    const res = await apiClient.saveLessonPlan(data);
    if (res.success) {
      setLessonPlans(prev => [res.data, ...prev]);
    }
  };

  const handleAddAnnouncement = async (data: Partial<Announcement>) => {
    const res = await apiClient.createAnnouncement(data);
    if (res.success) {
      setAnnouncements(prev => [res.data, ...prev]);
    }
  };

  const handleMarkAnnouncementRead = async (id: string) => {
    await apiClient.markAnnouncementRead(id);
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, readCount: a.readCount + 1 } : a));
  };

  const handleSendMessage = async (data: Partial<ParentCommunication>) => {
    const res = await apiClient.sendMessage(data);
    if (res.success) {
      setMessages(prev => [...prev, res.data]);
    }
  };

  const handleUploadMedia = async (data: any) => {
    const res = await apiClient.uploadMedia(data);
    if (res.success) {
      setMediaFiles(prev => [res.data, ...prev]);
    }
  };

  const handleUpdateSchool = async (data: Partial<SchoolInfo>) => {
    const res = await apiClient.updateSchoolInfo(data);
    if (res.success) {
      setSchool(res.data);
    }
  };

  // Filter navigation items based on current role (Ban Giám Hiệu vs Giáo Viên)
  const allNavItems = [
    { key: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard, roles: ['admin', 'teacher'] },
    { key: 'students', label: 'Hồ sơ trẻ', icon: Users, roles: ['admin', 'teacher'] },
    { key: 'attendance', label: 'Điểm danh', icon: CheckCircle, roles: ['admin', 'teacher'] },
    { key: 'schedule', label: 'Lịch hoạt động', icon: Calendar, roles: ['admin', 'teacher'] },
    { key: 'meals', label: 'Thực đơn ăn', icon: Utensils, roles: ['admin', 'teacher'] },
    { key: 'health', label: 'Sức khỏe & BMI', icon: Activity, roles: ['admin', 'teacher'] },
    { key: 'curriculum', label: 'Giáo án tuần', icon: BookOpen, roles: ['admin', 'teacher'] },
    { key: 'gallery', label: 'Thư viện ảnh', icon: ImageIcon, roles: ['admin', 'teacher'] },
    { key: 'communication', label: 'Bảng tin & Nhắn tin', icon: Bell, roles: ['admin', 'teacher'] },
    { key: 'reports', label: 'Báo cáo & Thống kê', icon: BarChart3, roles: ['admin'] },
    { key: 'settings', label: 'Cài đặt hệ thống', icon: Settings, roles: ['admin'] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(currentRole));

  // Loading state screen
  if (isLoading || !school) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-rose-50/50 text-slate-700">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white shadow-xl animate-pulse">
          <Heart className="h-8 w-8 animate-bounce" />
        </div>
        <h2 className="mt-4 text-base font-extrabold text-slate-800 tracking-wide">
          TRƯỜNG MẦM NON QUỲNH SƠN 1
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Đang nạp dữ liệu nghiệp vụ mầm non & Google Sheets...
        </p>
      </div>
    );
  }

  // 1. REQUIREMENT 2: Require Login Before Entering System
  if (!currentUser) {
    return (
      <LoginView
        accounts={accounts}
        onLogin={handleLogin}
      />
    );
  }

  // 2. REQUIREMENT 1: Dedicated Parent Portal View for 'parent' role
  if (currentRole === 'parent') {
    const parentStudent = students.find(s => s.id === currentUser.studentId) || students[0];
    const parentClass = classes.find(c => c.id === parentStudent?.classId) || currentClass;

    return (
      <div className="min-h-screen bg-rose-50/30 text-slate-800">
        <OfflineIndicator />

        {/* Parent Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-rose-100/80 bg-white/95 backdrop-blur-md px-4 md:px-8 py-3.5 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-md">
              <span className="text-xl">🌸</span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>{school.name}</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 font-extrabold">{parentClass.name}</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Cổng thông tin & Sổ liên lạc dành cho Phụ huynh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Role switch for test */}
            <div className="hidden md:flex items-center rounded-xl bg-slate-100 p-1 text-xs">
              <button
                onClick={() => handleRoleChange('admin')}
                className="px-2.5 py-1 rounded-lg font-bold text-[11px] text-slate-500 hover:text-slate-900 cursor-pointer"
                title="Chuyển sang Ban Giám Hiệu"
              >
                BGH
              </button>
              <button
                onClick={() => handleRoleChange('teacher')}
                className="px-2.5 py-1 rounded-lg font-bold text-[11px] text-slate-500 hover:text-slate-900 cursor-pointer"
                title="Chuyển sang Giáo Viên"
              >
                Giáo viên
              </button>
              <button
                className="px-2.5 py-1 rounded-lg font-bold text-[11px] bg-emerald-600 text-white shadow-2xs"
              >
                Phụ huynh
              </button>
            </div>

            {/* User display */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="font-bold text-emerald-900 truncate max-w-[140px] sm:max-w-none">
                {currentUser.displayName}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition cursor-pointer"
              title="Đăng xuất khỏi hệ thống"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </header>

        {/* Parent Portal Content */}
        <main className="max-w-6xl mx-auto p-4 md:p-8">
          <ParentPortalView
            student={parentStudent}
            currentClass={parentClass}
            attendance={attendance}
            mealMenus={mealMenus}
            activities={activities}
            healthRecords={healthRecords}
            announcements={announcements}
            messages={messages}
            mediaFiles={mediaFiles}
            currentUser={currentUser}
            selectedDate={selectedDate}
            onSendMessage={handleSendMessage}
          />
        </main>
      </div>
    );
  }

  // 3. Teacher & BGH (Admin) Main Application Layout
  return (
    <div className="flex min-h-screen bg-rose-50/30 text-slate-800">
      
      {/* Offline Banner */}
      <OfflineIndicator />

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-rose-100/80 bg-white/90 backdrop-blur-md p-5 sticky top-0 h-screen z-30">
        <div className="space-y-6">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white shadow-md">
              <span className="text-xl">🌸</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-black text-slate-900 tracking-tight truncate">
                {school.name.split('–')[0]?.trim()}
              </h1>
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block truncate">
                {currentRole === 'admin' ? 'Ban Giám Hiệu Quản Trị' : 'Giáo Viên Lớp 2 Tuổi I'}
              </span>
            </div>
          </div>

          {/* Current Class Pill */}
          <div className="rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 p-3 border border-rose-100">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              {currentRole === 'admin' ? 'Chọn lớp theo dõi' : 'Lớp phụ trách'}
            </span>
            <select
              value={currentClassId}
              onChange={(e) => setCurrentClassId(e.target.value)}
              disabled={currentRole === 'teacher'}
              className="mt-1 w-full bg-transparent font-extrabold text-xs text-rose-900 focus:outline-none cursor-pointer disabled:cursor-not-allowed"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Navigation Links based on RBAC */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setCurrentView(item.key)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-rose-500 text-white shadow-sm shadow-rose-200'
                      : 'text-slate-600 hover:bg-rose-50/70 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar: User info, Google Sheets button & Logout */}
        <div className="pt-4 border-t border-rose-100/60 space-y-3">
          {currentRole === 'admin' && (
            <button
              onClick={() => setIsGoogleModalOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 transition border border-slate-100 hover:border-emerald-200 text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="text-[11px] font-bold">Google Sheets</div>
                  <div className="text-[10px] text-slate-400">20 Bảng chuẩn hóa</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                Sẵn sàng
              </span>
            </button>
          )}

          {/* User Profile & Logout button */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="min-w-0 pr-2">
              <div className="text-xs font-extrabold text-slate-800 truncate">
                {currentUser.displayName}
              </div>
              <div className="text-[10px] text-rose-600 font-bold">
                {currentRole === 'admin' ? 'Ban Giám Hiệu' : 'Giáo Viên Chủ Nhiệm'}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              title="Đăng xuất khỏi hệ thống"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP HEADER */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-rose-100/80 bg-white/90 backdrop-blur-md px-4 md:px-8 py-3.5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-rose-50 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>{school.name}</span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="hidden sm:inline text-rose-600 font-extrabold">{currentClass.name}</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {new Date(selectedDate).toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Right Header: Role switcher, Google Sheets & Logout */}
          <div className="flex items-center gap-2.5">
            <PWAInstallButton />

            {/* Google Apps Script Connect Button (for Admin) */}
            {currentRole === 'admin' && (
              <button
                onClick={() => setIsGoogleModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
                title="Mở bảng hướng dẫn kết nối Google Apps Script & Sheets"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Google Sheets</span>
              </button>
            )}

            {/* Role Switcher Pill for Testing All Roles */}
            <div className="flex items-center rounded-xl bg-slate-100 p-1 text-xs">
              <button
                onClick={() => handleRoleChange('admin')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                  currentRole === 'admin'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Đăng nhập tài khoản Ban Giám Hiệu"
              >
                BGH
              </button>
              <button
                onClick={() => handleRoleChange('teacher')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                  currentRole === 'teacher'
                    ? 'bg-rose-500 text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Đăng nhập tài khoản Cô Lê Thị Hạnh"
              >
                Giáo viên
              </button>
              <button
                onClick={() => handleRoleChange('parent')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                  currentRole === 'parent'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Đăng nhập tài khoản Phụ huynh bé An Nhiên"
              >
                Phụ huynh
              </button>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition cursor-pointer"
              title="Đăng xuất tài khoản"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* MOBILE MENU DRAWER */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden bg-slate-900/50 backdrop-blur-xs flex">
            <div className="w-72 bg-white h-full p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                  <div className="font-black text-xs text-slate-900">🌸 {school.name}</div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded-lg text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="rounded-xl bg-rose-50 p-3">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Đang chọn lớp</span>
                  <select
                    value={currentClassId}
                    onChange={(e) => {
                      setCurrentClassId(e.target.value);
                      setIsMobileMenuOpen(false);
                    }}
                    disabled={currentRole === 'teacher'}
                    className="w-full bg-transparent font-bold text-xs text-rose-900 mt-1"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => {
                          setCurrentView(item.key);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition ${
                          isActive ? 'bg-rose-500 text-white' : 'text-slate-600 hover:bg-rose-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="space-y-2">
                {currentRole === 'admin' && (
                  <button
                    onClick={() => {
                      setIsGoogleModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200"
                  >
                    Cấu hình Google Sheets
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200"
                >
                  Đăng xuất tài khoản
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)}></div>
          </div>
        )}

        {/* VIEW CONTAINER */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              school={school}
              currentClass={currentClass}
              students={students}
              attendance={attendance}
              activities={activities}
              mealMenus={mealMenus}
              announcements={announcements}
              currentUser={currentUser}
              currentRole={currentRole}
              selectedDate={selectedDate}
              onNavigate={setCurrentView}
              onOpenGoogleIntegration={() => setIsGoogleModalOpen(true)}
            />
          )}

          {currentView === 'students' && (
            <StudentsView
              students={students}
              classes={classes}
              currentClass={currentClass}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
            />
          )}

          {currentView === 'attendance' && (
            <AttendanceView
              students={students}
              currentClass={currentClass}
              classes={classes}
              attendance={attendance}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onClassChange={setCurrentClassId}
              onSaveAttendance={handleSaveAttendance}
              onOpenPrintReport={() => setIsPrintModalOpen(true)}
            />
          )}

          {currentView === 'schedule' && (
            <ScheduleView
              activities={activities}
              currentClass={currentClass}
              selectedDate={selectedDate}
              onSaveActivity={handleSaveActivity}
            />
          )}

          {currentView === 'meals' && (
            <MealsView
              mealMenus={mealMenus}
              currentClass={currentClass}
              onSaveMeal={handleSaveMeal}
            />
          )}

          {currentView === 'health' && (
            <HealthView
              students={students}
              currentClass={currentClass}
              healthRecords={healthRecords}
              evaluations={evaluations}
              onAddHealthRecord={handleAddHealthRecord}
              onAddEvaluation={handleAddEvaluation}
            />
          )}

          {currentView === 'curriculum' && (
            <CurriculumView
              lessonPlans={lessonPlans}
              currentClass={currentClass}
              onSaveLessonPlan={handleSaveLessonPlan}
            />
          )}

          {currentView === 'gallery' && (
            <GalleryView
              mediaFiles={mediaFiles}
              currentClass={currentClass}
              onUploadMedia={handleUploadMedia}
            />
          )}

          {currentView === 'communication' && (
            <CommunicationView
              announcements={announcements}
              messages={messages}
              currentClass={currentClass}
              currentUser={currentUser}
              currentRole={currentRole}
              students={students}
              onAddAnnouncement={handleAddAnnouncement}
              onMarkRead={handleMarkAnnouncementRead}
              onSendMessage={handleSendMessage}
            />
          )}

          {currentView === 'reports' && currentRole === 'admin' && (
            <ReportsView
              school={school}
              classes={classes}
              currentClass={currentClass}
              students={students}
              attendance={attendance}
              healthRecords={healthRecords}
              selectedDate={selectedDate}
              onOpenPrintReport={() => setIsPrintModalOpen(true)}
            />
          )}

          {currentView === 'settings' && currentRole === 'admin' && (
            <SettingsView
              school={school}
              auditLogs={auditLogs}
              gasStatus={gasStatus}
              onUpdateSchool={handleUpdateSchool}
              onOpenGoogleIntegration={() => setIsGoogleModalOpen(true)}
            />
          )}
        </main>

        {/* MOBILE BOTTOM NAVIGATION BAR */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-rose-100 flex items-center justify-around p-2 z-20">
          {[
            { key: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
            { key: 'students', label: 'Trẻ', icon: Users },
            { key: 'attendance', label: 'Điểm danh', icon: CheckCircle },
            { key: 'meals', label: 'Thực đơn', icon: Utensils },
            { key: 'communication', label: 'Bảng tin', icon: Bell }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = currentView === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setCurrentView(tab.key)}
                className={`flex flex-col items-center justify-center p-1.5 transition ${
                  isActive ? 'text-rose-600 font-bold' : 'text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] mt-0.5">{tab.label}</span>
              </button>
            );
          })}
        </nav>

      </div>

      {/* MODALS */}
      <GoogleIntegrationModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        gasStatus={gasStatus}
        onRefreshStatus={loadData}
      />

      <PrintableReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        school={school}
        currentClass={currentClass}
        students={students.filter(s => s.classId === currentClass.id && s.status === 'active')}
        attendance={attendance.filter(a => a.classId === currentClass.id && a.date === selectedDate)}
        selectedDate={selectedDate}
      />

    </div>
  );
}

export default App;
