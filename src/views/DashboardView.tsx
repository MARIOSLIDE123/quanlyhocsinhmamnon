import React from 'react';
import {
  SchoolInfo,
  Classroom,
  Student,
  AttendanceRecord,
  DailyActivity,
  MealMenu,
  Announcement,
  UserAccount,
  UserRole
} from '../types';
import {
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Utensils,
  Bell,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  HeartHandshake,
  Activity,
  Award
} from 'lucide-react';

interface Props {
  school: SchoolInfo;
  currentClass: Classroom;
  students: Student[];
  attendance: AttendanceRecord[];
  activities: DailyActivity[];
  mealMenus: MealMenu[];
  announcements: Announcement[];
  currentUser: UserAccount;
  currentRole: UserRole;
  selectedDate: string;
  onNavigate: (view: string) => void;
  onOpenGoogleIntegration: () => void;
}

export const DashboardView: React.FC<Props> = ({
  school,
  currentClass,
  students,
  attendance,
  activities,
  mealMenus,
  announcements,
  currentUser,
  currentRole,
  selectedDate,
  onNavigate,
  onOpenGoogleIntegration
}) => {
  // Calculate attendance numbers for current date and class
  const classStudents = students.filter(s => s.classId === currentClass.id && s.status === 'active');
  const classAttendance = attendance.filter(a => a.classId === currentClass.id && a.date === selectedDate);
  
  const presentCount = classAttendance.filter(a => a.status === 'present').length;
  const excusedCount = classAttendance.filter(a => a.status === 'excused').length;
  const unexcusedCount = classAttendance.filter(a => a.status === 'unexcused').length;
  const lateCount = classAttendance.filter(a => a.status === 'late').length;
  const unmarkedCount = Math.max(0, classStudents.length - classAttendance.length);
  const attendanceRate = classStudents.length > 0 ? Math.round((presentCount / classStudents.length) * 100) : 0;

  // Filter today's meals
  const todayMeals = mealMenus.filter(m => m.date === selectedDate || m.dayOfWeek === 'Hôm nay');

  // Today's activities
  const todayActivities = activities.filter(a => a.classId === currentClass.id && (a.date === selectedDate || true));

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 p-6 md:p-8 text-white shadow-lg">
        {/* Decorative background shapes */}
        <div className="absolute -right-8 -bottom-8 h-48 w-48 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute right-1/4 -top-8 h-32 w-32 rounded-full bg-yellow-200/20 blur-lg"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
              <span>🌸</span>
              <span>{school.name}</span>
              <span>•</span>
              <span>Niên khóa {school.currentSchoolYearName}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight drop-shadow-xs">
              Chào mừng {currentUser.displayName}!
            </h1>
            <p className="text-sm text-rose-50 max-w-xl font-medium">
              {currentRole === 'admin'
                ? 'Hệ thống quản lý mầm non tổng thể trường. Theo dõi chuyên cần, các lớp học, thực đơn và kết nối Google Sheets.'
                : currentRole === 'teacher'
                ? `Hôm nay lớp ${currentClass.name} có ${classStudents.length} bé. Đang phụ trách: ${currentClass.teacherName}.`
                : 'Theo dõi hành trình học tập, vui chơi, bữa ăn dinh dưỡng và sức khỏe của con bạn mỗi ngày.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('attendance')}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-rose-600 shadow-md hover:bg-rose-50 transition cursor-pointer"
            >
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Điểm danh ngay
            </button>
            <button
              onClick={onOpenGoogleIntegration}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900/40 hover:bg-slate-900/60 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-xs transition border border-white/20 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              Kết nối Google Sheets
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Sĩ số lớp</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-slate-800">{classStudents.length}</span>
            <span className="text-xs text-slate-500 font-medium">trẻ (tối đa {currentClass.maxCapacity})</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {currentClass.name}
          </div>
        </div>

        {/* Present */}
        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Có mặt hôm nay</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-emerald-600">{presentCount}</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
              {attendanceRate}%
            </span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-600/80 font-medium">
            Tỉ lệ chuyên cần rất tốt
          </div>
        </div>

        {/* Excused / Absent */}
        <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Vắng mặt</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-amber-600">
              {excusedCount + unexcusedCount}
            </span>
            <span className="text-xs text-slate-500">
              ({excusedCount} phép, {unexcusedCount} k.phép)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-amber-700">
            {lateCount > 0 ? `Đến muộn: ${lateCount} bé` : 'Không có trẻ đến muộn'}
          </div>
        </div>

        {/* Unmarked */}
        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Chưa điểm danh</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-sky-600">{unmarkedCount}</span>
            <span className="text-xs text-slate-500">bé</span>
          </div>
          <div className="mt-2 text-[11px] text-sky-700">
            {unmarkedCount === 0 ? 'Đã hoàn thành điểm danh' : 'Cần điểm danh thêm'}
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Daily Schedule & Today's Meals */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Daily Schedule Widget */}
          <div className="rounded-3xl border border-rose-100 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base">Lịch Hoạt Động Hôm Nay</h3>
                  <p className="text-xs text-slate-500">Lớp {currentClass.name} • Thứ tự hoạt động trong ngày</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('schedule')}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
              >
                Xem chi tiết <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {todayActivities.slice(0, 5).map((act, idx) => (
                <div
                  key={act.id}
                  className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 transition hover:bg-rose-50/30"
                >
                  <div className="flex flex-col items-center justify-center rounded-xl bg-white px-2.5 py-1.5 border border-slate-200 text-center shrink-0">
                    <span className="font-mono text-xs font-bold text-slate-800">{act.timeStart}</span>
                    <span className="text-[10px] text-slate-400">đến {act.timeEnd}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{act.title}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                        {act.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{act.description}</p>
                  </div>
                  <div className="text-right text-[11px] text-slate-500 shrink-0 hidden sm:block">
                    {act.teacherInCharge}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Nutrition & Meals */}
          <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base">Thực Đơn Dinh Dưỡng Hôm Nay</h3>
                  <p className="text-xs text-slate-500">Chế độ 4 nhóm chất chuẩn Viện Dinh Dưỡng Quốc Gia</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('meals')}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
              >
                Thực đơn tuần <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {todayMeals.map((meal) => (
                <div
                  key={meal.id}
                  className="rounded-2xl border border-amber-100/80 bg-gradient-to-br from-amber-50/40 to-white p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                      {meal.mealTypeName}
                    </span>
                    {meal.calorieKcal && (
                      <span className="text-[11px] font-semibold text-slate-500">
                        {meal.calorieKcal} kcal
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">{meal.dishName}</h4>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    {meal.dishComponents.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                  {meal.allergyNotice && (
                    <div className="mt-2 rounded-lg bg-rose-50 p-2 text-[11px] font-medium text-rose-700 border border-rose-100">
                      ⚠️ <strong>Lưu ý:</strong> {meal.allergyNotice}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (1 Col): Announcements, Quick Actions, Teacher Tasks */}
        <div className="space-y-6">
          
          {/* Quick Actions Card */}
          <div className="rounded-3xl border border-rose-100 bg-white p-5 shadow-xs">
            <h3 className="font-extrabold text-slate-800 text-sm mb-3">Thao tác nhanh</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigate('students')}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-rose-50 text-rose-700 hover:bg-rose-100 transition cursor-pointer"
              >
                <Users className="w-5 h-5 mb-1" />
                <span className="text-xs font-bold">Hồ sơ trẻ</span>
              </button>
              <button
                onClick={() => onNavigate('attendance')}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
              >
                <CheckCircle className="w-5 h-5 mb-1" />
                <span className="text-xs font-bold">Điểm danh</span>
              </button>
              <button
                onClick={() => onNavigate('health')}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-50 text-sky-700 hover:bg-sky-100 transition cursor-pointer"
              >
                <Activity className="w-5 h-5 mb-1" />
                <span className="text-xs font-bold">Sức khỏe & BMI</span>
              </button>
              <button
                onClick={() => onNavigate('curriculum')}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition cursor-pointer"
              >
                <Award className="w-5 h-5 mb-1" />
                <span className="text-xs font-bold">Giáo án tuần</span>
              </button>
            </div>
          </div>

          {/* School Announcements */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <Bell className="w-4 h-4 text-rose-500" />
                Bảng Tin Thông Báo
              </h3>
              <button
                onClick={() => onNavigate('communication')}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
              >
                Xem tất cả
              </button>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 3).map((anc) => (
                <div
                  key={anc.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 space-y-1.5 transition hover:bg-rose-50/20"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      anc.type === 'urgent'
                        ? 'bg-rose-100 text-rose-700'
                        : anc.type === 'event'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {anc.type === 'urgent' ? 'Khẩn cấp' : anc.type === 'event' ? 'Sự kiện' : 'Thông báo'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(anc.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{anc.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{anc.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Teacher Checklist / Daily Reminders */}
          <div className="rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50/40 to-white p-5 shadow-xs">
            <h3 className="font-extrabold text-purple-900 text-sm mb-2 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-purple-600" />
              Công việc cô giáo cần lưu ý
            </h3>
            <ul className="text-xs text-slate-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Kiểm tra thân nhiệt buổi sáng cho toàn bộ học sinh.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Lưu ý trẻ dị ứng thực phẩm trong bữa ăn trưa.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>Chụp 3 - 5 bức ảnh hoạt động gieo hạt gửi vào Thư viện.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>Kiểm tra đúng danh sách người đón khi trả trẻ lúc 16:30.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
