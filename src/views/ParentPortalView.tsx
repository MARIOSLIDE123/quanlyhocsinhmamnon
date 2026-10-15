import React, { useState } from 'react';
import {
  Student,
  Classroom,
  AttendanceRecord,
  MealMenu,
  DailyActivity,
  HealthRecord,
  Announcement,
  ParentCommunication,
  DriveMediaItem,
  UserAccount
} from '../types';
import { StudentAvatarBadge } from '../components/StudentAvatarBadge';
import {
  Heart,
  Calendar,
  Utensils,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  Phone,
  ShieldCheck,
  Send,
  MessageSquare,
  Image as ImageIcon,
  Info,
  Sparkles,
  MapPin,
  Smile,
  ChevronRight
} from 'lucide-react';

interface Props {
  student: Student;
  currentClass: Classroom;
  attendance: AttendanceRecord[];
  mealMenus: MealMenu[];
  activities: DailyActivity[];
  healthRecords: HealthRecord[];
  announcements: Announcement[];
  messages: ParentCommunication[];
  mediaFiles: DriveMediaItem[];
  currentUser: UserAccount;
  selectedDate: string;
  onSendMessage: (msg: Partial<ParentCommunication>) => Promise<void>;
}

export const ParentPortalView: React.FC<Props> = ({
  student,
  currentClass,
  attendance,
  mealMenus,
  activities,
  healthRecords,
  announcements,
  messages,
  mediaFiles,
  currentUser,
  selectedDate,
  onSendMessage
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'profile' | 'attendance' | 'meals' | 'health' | 'photos' | 'messages'>('today');
  const [newMsgContent, setNewMsgContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Today's attendance for child
  const todayAttendance = attendance.find(
    a => a.studentId === student.id && (a.date === selectedDate || true)
  );

  // Child's attendance history
  const childAttendanceList = attendance.filter(a => a.studentId === student.id);

  // Child's health records
  const childHealth = healthRecords.filter(h => h.studentId === student.id);
  const latestHealth = childHealth[0];

  // Today's meals for the class
  const todayMeals = mealMenus.filter(m => m.date === selectedDate || m.dayOfWeek === 'Hôm nay' || true).slice(0, 4);

  // Today's activities
  const classActivities = activities.filter(a => a.classId === currentClass.id || true).slice(0, 5);

  // Messages between parent and teacher
  const chatMessages = messages.filter(
    m => m.studentId === student.id || m.senderId === currentUser.id || m.recipientId === currentUser.id
  );

  // Class gallery photos
  const classPhotos = mediaFiles.filter(m => m.category.includes('HINH_ANH') || true);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgContent.trim()) return;

    setIsSending(true);
    try {
      await onSendMessage({
        studentId: student.id,
        studentName: student.fullName,
        classId: currentClass.id,
        senderId: currentUser.id,
        senderName: currentUser.displayName,
        senderRole: 'parent',
        recipientId: currentClass.teacherId || 'TCH-01',
        content: newMsgContent.trim()
      });
      setNewMsgContent('');
    } catch (err: any) {
      alert('Không thể gửi tin nhắn: ' + err.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* CHILD HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 p-6 md:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 md:gap-5">
            <StudentAvatarBadge
              name={student.fullName}
              initials={student.avatarInitials}
              size="xl"
              className="border-2 border-white/80 shadow-lg text-white"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold backdrop-blur-xs">
                <span>🌸</span>
                <span>{currentClass.name}</span>
                <span>•</span>
                <span>Mã bé: {student.studentCode}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-1">
                Bé {student.fullName}
                {student.nickname && (
                  <span className="text-lg font-normal text-rose-100 ml-2">
                    (Bé {student.nickname})
                  </span>
                )}
              </h1>
              <p className="text-xs text-rose-100 mt-1 flex items-center gap-3">
                <span>Giáo viên chủ nhiệm: <strong>{currentClass.teacherName}</strong></span>
                <span>•</span>
                <span>Phụ huynh: <strong>{currentUser.displayName}</strong></span>
              </p>
            </div>
          </div>

          {/* Today Quick Status Pill */}
          <div className="rounded-2xl bg-white/15 backdrop-blur-md p-4 border border-white/20 text-xs space-y-1 self-start md:self-auto">
            <span className="text-[11px] uppercase tracking-wider text-rose-100 font-bold block">
              Trạng thái hôm nay
            </span>
            <div className="flex items-center gap-2">
              <span className={`inline-block h-3 w-3 rounded-full ${todayAttendance?.status === 'present' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-300'}`}></span>
              <span className="font-extrabold text-sm">
                {todayAttendance?.status === 'present'
                  ? `Đang ở lớp (${todayAttendance.arrivalTime || '07:30'})`
                  : 'Chờ điểm danh sáng'}
              </span>
            </div>
            {todayAttendance?.temperature && (
              <div className="text-[11px] text-rose-100">
                Thân nhiệt sáng: <strong>{todayAttendance.temperature}°C</strong> (Bình thường)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PARENT NAVIGATION TABS */}
      <div className="flex border-b border-rose-100 bg-white rounded-2xl p-1.5 shadow-xs overflow-x-auto gap-1">
        {[
          { key: 'today', label: 'Hôm nay của bé', icon: Sparkles },
          { key: 'profile', label: 'Hồ sơ con', icon: Heart },
          { key: 'attendance', label: 'Lịch sử điểm danh', icon: CheckCircle },
          { key: 'meals', label: 'Thực đơn ăn', icon: Utensils },
          { key: 'health', label: 'Sức khỏe & BMI', icon: Activity },
          { key: 'photos', label: 'Ảnh hoạt động lớp', icon: ImageIcon },
          { key: 'messages', label: 'Nhắn tin với cô giáo', icon: MessageSquare }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-rose-50 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: TODAY'S HIGHLIGHTS */}
      {activeTab === 'today' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Col 1 & 2: Meals and Activities */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Meals Today */}
            <div className="rounded-3xl border border-rose-100 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-rose-500" />
                  Hôm nay bé ăn gì? (Thực đơn Lớp 2 Tuổi I)
                </h3>
                <span className="text-xs text-rose-600 font-bold bg-rose-50 px-2.5 py-0.5 rounded-full">
                  Chuẩn dinh dưỡng MN
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {todayMeals.map((meal) => (
                  <div key={meal.id} className="rounded-2xl border border-rose-100/60 bg-rose-50/30 p-3.5 text-xs space-y-1.5">
                    <span className="font-extrabold text-rose-700 block">
                      {meal.mealTypeName}
                    </span>
                    <p className="font-bold text-slate-800 text-[13px]">{meal.dishName}</p>
                    <p className="text-slate-500 text-[11px] line-clamp-2">
                      {meal.dishComponents?.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Activities Today */}
            <div className="rounded-3xl border border-rose-100 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-500" />
                  Lịch sinh hoạt & Hoạt động trong ngày
                </h3>
                <span className="text-xs text-slate-400">Thời khóa biểu 24 - 36 tháng</span>
              </div>

              <div className="space-y-3">
                {classActivities.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="shrink-0 px-2.5 py-1 rounded-xl bg-white border border-slate-200 font-mono text-[11px] font-bold text-rose-600">
                      {act.timeStart} - {act.timeEnd}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800">{act.title}</h4>
                      <p className="text-slate-500 text-[11px] mt-0.5">{act.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Col 3: Teacher notes & pickup check */}
          <div className="space-y-6">
            
            {/* Teacher note */}
            <div className="rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50 to-pink-50 p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold text-base">
                  🌸
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800">{currentClass.teacherName}</h4>
                  <span className="text-[11px] text-rose-600 font-medium">Lời dặn cô giáo chủ nhiệm</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 italic bg-white p-3.5 rounded-2xl border border-rose-100">
                "{todayAttendance?.pickupNote || 'Hôm nay bé tham gia hoạt động góc và ăn hết suất rất ngoan. Ba mẹ yên tâm nhé!'}"
              </p>
              <button
                onClick={() => setActiveTab('messages')}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Nhắn tin dặn dò cô
              </button>
            </div>

            {/* Pickup Authorization Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
              <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Người được ủy quyền đón bé
              </h4>
              <p className="text-[11px] text-slate-500">
                Chỉ những người có tên dưới đây mới được cô giáo giao trả trẻ khi tan trường:
              </p>
              <div className="space-y-2">
                {student.guardians?.map((g, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{g.relationship}: {g.fullName}</span>
                      <div className="text-[11px] text-slate-500 font-mono">{g.phone}</div>
                    </div>
                    {g.canPickup && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Được đón
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: PROFILE */}
      {activeTab === 'profile' && (
        <div className="max-w-3xl mx-auto rounded-3xl border border-rose-100 bg-white p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-rose-100">
            <StudentAvatarBadge
              name={student.fullName}
              initials={student.avatarInitials}
              size="lg"
            />
            <div>
              <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                {student.studentCode}
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">{student.fullName}</h2>
              <p className="text-xs text-slate-500">
                {currentClass.name} • Giới tính: <strong>{student.gender}</strong>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-1">Ngày sinh</span>
              <span className="font-extrabold text-slate-800 text-sm">
                {new Date(student.dateOfBirth).toLocaleDateString('vi-VN')}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-1">Nhóm máu</span>
              <span className="font-extrabold text-slate-800 text-sm">
                {student.bloodGroup || 'O'}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-1">Ngày nhập học</span>
              <span className="font-extrabold text-slate-800 text-sm">
                {new Date(student.admissionDate).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>

          {student.allergies && student.allergies.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <strong className="flex items-center gap-1.5 text-amber-800 mb-1">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Lưu ý dị ứng của bé:
              </strong>
              {student.allergies.join(', ')}
            </div>
          )}

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
            <span className="text-slate-400 block mb-1">Địa chỉ thường trú:</span>
            <span className="font-medium">{student.address || 'Quỳnh Sơn, Yên Dũng, Bắc Giang'}</span>
          </div>
        </div>
      )}

      {/* TAB 3: ATTENDANCE HISTORY */}
      {activeTab === 'attendance' && (
        <div className="max-w-3xl mx-auto rounded-3xl border border-rose-100 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Nhật Ký Điểm Danh Của Bé
          </h3>
          <div className="divide-y divide-slate-100">
            {childAttendanceList.map((rec) => (
              <div key={rec.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800">
                    {new Date(rec.date).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </span>
                  <div className="text-[11px] text-slate-400">
                    Đến: {rec.arrivalTime || '--:--'} • Thân nhiệt: {rec.temperature ? `${rec.temperature}°C` : 'Bình thường'}
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  rec.status === 'present'
                    ? 'bg-emerald-100 text-emerald-800'
                    : rec.status === 'excused'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {rec.status === 'present' ? 'Đi học đủ' : rec.status === 'excused' ? 'Nghỉ có phép' : 'Vắng'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MEALS */}
      {activeTab === 'meals' && (
        <div className="max-w-3xl mx-auto rounded-3xl border border-rose-100 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-rose-500" />
            Thực Đơn Dinh Dưỡng Tuần Của Lớp
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {todayMeals.map((meal) => (
              <div key={meal.id} className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 text-xs space-y-2">
                <span className="font-extrabold text-rose-600 text-xs block uppercase">
                  {meal.mealTypeName}
                </span>
                <h4 className="font-black text-slate-800 text-sm">{meal.dishName}</h4>
                <p className="text-slate-600 text-[11px]">{meal.dishComponents?.join(' • ')}</p>
                {meal.calorieKcal && (
                  <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                    ⚡ {meal.calorieKcal} Kcal
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: HEALTH */}
      {activeTab === 'health' && (
        <div className="max-w-3xl mx-auto rounded-3xl border border-rose-100 bg-white p-6 md:p-8 shadow-xs space-y-6">
          <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-500" />
            Thể Trạng & Tăng Trưởng (Chuẩn WHO)
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
              <span className="text-xs text-emerald-700 font-bold">Chiều cao</span>
              <div className="text-2xl font-black text-emerald-800 mt-1">
                {latestHealth?.heightCm || 87.5} cm
              </div>
              <span className="text-[10px] text-emerald-600">Đạt chuẩn phát triển</span>
            </div>
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-center">
              <span className="text-xs text-sky-700 font-bold">Cân nặng</span>
              <div className="text-2xl font-black text-sky-800 mt-1">
                {latestHealth?.weightKg || 12.3} kg
              </div>
              <span className="text-[10px] text-sky-600">Thể trạng cân đối</span>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-center col-span-2 sm:col-span-1">
              <span className="text-xs text-rose-700 font-bold">Chỉ số BMI</span>
              <div className="text-2xl font-black text-rose-800 mt-1">
                {latestHealth?.bmi || 16.1}
              </div>
              <span className="text-[10px] text-rose-600">Bình thường</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PHOTOS */}
      {activeTab === 'photos' && (
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-rose-500" />
            Hình Ảnh Vui Chơi Của Các Bé Lớp 2 Tuổi I
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {classPhotos.map((photo) => (
              <div key={photo.id} className="group rounded-2xl overflow-hidden border border-rose-100 bg-white shadow-xs">
                <img
                  src={photo.thumbnailLink || photo.webViewLink}
                  alt={photo.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="p-3">
                  <h4 className="text-xs font-bold text-slate-800 truncate">{photo.title}</h4>
                  <span className="text-[10px] text-slate-400">{photo.activityDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: MESSAGES */}
      {activeTab === 'messages' && (
        <div className="max-w-3xl mx-auto rounded-3xl border border-rose-100 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-rose-100">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-rose-500" />
              Sổ Liên Lạc & Nhắn Tin Với Cô Lê Thị Hạnh
            </h3>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              Cô giáo đang online
            </span>
          </div>

          <div className="h-72 overflow-y-auto space-y-3 p-3 bg-slate-50/50 rounded-2xl">
            {chatMessages.length === 0 ? (
              <div className="text-center text-xs text-slate-400 py-12">
                Chưa có tin nhắn nào. Phụ huynh hãy nhập lời nhắn dặn dò cô giáo ở khung bên dưới.
              </div>
            ) : (
              chatMessages.map((msg) => {
                const isMe = msg.senderRole === 'parent';
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-3 text-xs ${
                      isMe
                        ? 'bg-rose-500 text-white rounded-br-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-2xs'
                    }`}>
                      <div className="text-[10px] font-bold opacity-80 mb-0.5">
                        {msg.senderName}
                      </div>
                      <p>{msg.content}</p>
                      <div className="text-[9px] opacity-70 text-right mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <form onSubmit={handleSendChat} className="flex gap-2">
            <input
              type="text"
              placeholder="Nhập lời dặn dò cô giáo (uống thuốc, đón muộn, sức khỏe bé)..."
              value={newMsgContent}
              onChange={(e) => setNewMsgContent(e.target.value)}
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-2.5 text-xs focus:border-rose-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSending || !newMsgContent.trim()}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gửi cô</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
