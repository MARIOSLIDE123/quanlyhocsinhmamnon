import React, { useState } from 'react';
import { Classroom, DailyActivity } from '../types';
import {
  Calendar,
  Clock,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  MapPin,
  User,
  Sparkles,
  X
} from 'lucide-react';

interface Props {
  activities: DailyActivity[];
  currentClass: Classroom;
  selectedDate: string;
  onSaveActivity: (activity: Partial<DailyActivity>) => Promise<void>;
}

export const ScheduleView: React.FC<Props> = ({
  activities,
  currentClass,
  selectedDate,
  onSaveActivity
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<DailyActivity | null>(null);

  const [formData, setFormData] = useState<Partial<DailyActivity>>({
    classId: currentClass.id,
    date: selectedDate,
    timeStart: '08:30',
    timeEnd: '09:15',
    title: '',
    category: 'Hoạt động học',
    description: '',
    teacherInCharge: currentClass.teacherName,
    location: currentClass.room
  });

  const classActivities = activities
    .filter(a => a.classId === currentClass.id)
    .sort((a, b) => a.timeStart.localeCompare(b.timeStart));

  // Check for time overlap
  const checkOverlap = (act: DailyActivity, idx: number) => {
    if (idx === 0) return false;
    const prev = classActivities[idx - 1];
    return prev && act.timeStart < prev.timeEnd;
  };

  const handleOpenAdd = () => {
    setEditingActivity(null);
    setFormData({
      classId: currentClass.id,
      date: selectedDate,
      timeStart: '08:30',
      timeEnd: '09:15',
      title: '',
      category: 'Hoạt động học',
      description: '',
      teacherInCharge: currentClass.teacherName,
      location: currentClass.room
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (act: DailyActivity) => {
    setEditingActivity(act);
    setFormData(act);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      alert('Vui lòng nhập tên hoạt động');
      return;
    }
    try {
      await onSaveActivity({
        ...formData,
        id: editingActivity?.id
      });
      setIsFormOpen(false);
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    }
  };

  const categoryColors: { [key: string]: string } = {
    'Đón trẻ': 'bg-pink-100 text-pink-700 border-pink-200',
    'Thể dục sáng': 'bg-amber-100 text-amber-700 border-amber-200',
    'Hoạt động học': 'bg-purple-100 text-purple-700 border-purple-200',
    'Vui chơi ngoài trời': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Ăn trưa': 'bg-rose-100 text-rose-700 border-rose-200',
    'Ngủ trưa': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'Hoạt động chiều': 'bg-sky-100 text-sky-700 border-sky-200',
    'Trả trẻ': 'bg-teal-100 text-teal-700 border-teal-200'
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-purple-500" />
            Lịch Hoạt Động & Thời Khóa Biểu
          </h2>
          <p className="text-xs text-slate-500">
            Kế hoạch sinh hoạt và các tiết học trong ngày của {currentClass.name}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:from-purple-600 hover:to-indigo-600 transition cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Thêm hoạt động mới
        </button>
      </div>

      {/* Routine Timeline */}
      <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Dòng thời gian hoạt động trong ngày ({classActivities.length} tiết mục)
          </span>
          <span className="text-xs text-purple-600 font-semibold">
            {new Date(selectedDate).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-purple-100">
          {classActivities.map((act, idx) => {
            const isOverlap = checkOverlap(act, idx);

            return (
              <div key={act.id} className="relative group">
                {/* Node icon on timeline */}
                <div className="absolute -left-6 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white border-2 border-purple-400 text-purple-600 shadow-xs">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                </div>

                {/* Activity Card */}
                <div className={`rounded-2xl border p-4.5 transition hover:shadow-md ${
                  isOverlap ? 'border-amber-300 bg-amber-50/40' : 'border-slate-100 bg-slate-50/50 hover:bg-white'
                }`}>
                  
                  {isOverlap && (
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-amber-700">
                      <AlertTriangle className="w-4 h-4" />
                      Cảnh báo: Thời gian hoạt động này bị trùng lặp với tiết trước!
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-extrabold text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        {act.timeStart} – {act.timeEnd}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${categoryColors[act.category] || 'bg-slate-100 text-slate-700'}`}>
                        {act.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(act)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
                        title="Sửa hoạt động"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-black text-slate-800 mt-2">
                    {act.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1">
                    {act.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-purple-400" />
                      Phụ trách: <strong>{act.teacherInCharge}</strong>
                    </span>
                    {act.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        Địa điểm: <strong>{act.location}</strong>
                      </span>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ADD / EDIT ACTIVITY MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-purple-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">
                {editingActivity ? 'Cập Nhật Hoạt Động' : 'Thêm Hoạt Động Mới'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên hoạt động *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Khám phá khoa học: Sự kỳ diệu của nước"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giờ bắt đầu</label>
                  <input
                    type="time"
                    required
                    value={formData.timeStart}
                    onChange={(e) => setFormData({ ...formData, timeStart: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 font-mono focus:border-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giờ kết thúc</label>
                  <input
                    type="time"
                    required
                    value={formData.timeEnd}
                    onChange={(e) => setFormData({ ...formData, timeEnd: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 font-mono focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Loại hoạt động</label>
                <select
                  value={formData.category}
                  onChange={(e: any) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-purple-400 focus:outline-none"
                >
                  <option value="Đón trẻ">Đón trẻ</option>
                  <option value="Thể dục sáng">Thể dục sáng</option>
                  <option value="Hoạt động học">Hoạt động học</option>
                  <option value="Vui chơi ngoài trời">Vui chơi ngoài trời</option>
                  <option value="Ăn trưa">Ăn trưa</option>
                  <option value="Ngủ trưa">Ngủ trưa</option>
                  <option value="Hoạt động chiều">Hoạt động chiều</option>
                  <option value="Trả trẻ">Trả trẻ</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nội dung / Mục tiêu hoạt động</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả các bước thực hiện và đồ dùng cần chuẩn bị..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giáo viên phụ trách</label>
                  <input
                    type="text"
                    value={formData.teacherInCharge}
                    onChange={(e) => setFormData({ ...formData, teacherInCharge: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Địa điểm thực hiện</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-xs"
                >
                  Lưu hoạt động
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
