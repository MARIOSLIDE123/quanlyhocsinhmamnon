import React, { useState } from 'react';
import { LessonPlan, Classroom } from '../types';
import {
  BookOpen,
  Plus,
  FileText,
  ExternalLink,
  Calendar,
  CheckCircle,
  Clock,
  Sparkles,
  X
} from 'lucide-react';

interface Props {
  lessonPlans: LessonPlan[];
  currentClass: Classroom;
  onSaveLessonPlan: (plan: Partial<LessonPlan>) => Promise<void>;
}

export const CurriculumView: React.FC<Props> = ({
  lessonPlans,
  currentClass,
  onSaveLessonPlan
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null);

  const [formData, setFormData] = useState<Partial<LessonPlan>>({
    title: '',
    theme: 'Chủ đề: Bản thân & Gia đình',
    gradeLevel: currentClass.gradeLevel,
    classId: currentClass.id,
    weekNumber: 27,
    month: 3,
    year: 2026,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().split('T')[0],
    objectives: [],
    activitiesDetail: '',
    teacherName: currentClass.teacherName,
    driveFileName: '',
    driveFileUrl: '',
    status: 'approved'
  });

  const [objectivesInput, setObjectivesInput] = useState('');

  const handleOpenAdd = () => {
    setEditingPlan(null);
    setFormData({
      title: '',
      theme: 'Chủ đề: Thế giới thực vật',
      gradeLevel: currentClass.gradeLevel,
      classId: currentClass.id,
      weekNumber: 27,
      month: 3,
      year: 2026,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().split('T')[0],
      objectives: [],
      activitiesDetail: '',
      teacherName: currentClass.teacherName,
      driveFileName: '',
      driveFileUrl: '',
      status: 'approved'
    });
    setObjectivesInput('');
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      alert('Vui lòng nhập tiêu đề giáo án');
      return;
    }

    try {
      const parsedObjectives = objectivesInput
        .split('\n')
        .map(o => o.trim())
        .filter(Boolean);

      await onSaveLessonPlan({
        ...formData,
        objectives: parsedObjectives,
        id: editingPlan?.id
      });
      setIsFormOpen(false);
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-600" />
            Kế Hoạch Giáo Dục & Giáo Án Mầm Non
          </h2>
          <p className="text-xs text-slate-500">
            Quản lý kế hoạch tuần, tháng, chủ đề giáo dục và liên kết tài liệu Google Drive
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:from-purple-700 hover:to-pink-700 transition cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Soạn giáo án mới
        </button>
      </div>

      {/* Lesson Plans List */}
      <div className="space-y-4">
        {lessonPlans.map((plan) => (
          <div
            key={plan.id}
            className="rounded-3xl border border-purple-100 bg-white p-6 shadow-xs space-y-4 hover:shadow-md transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-100 text-purple-800">
                  Tuần {plan.weekNumber}
                </span>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                  {plan.theme}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle className="w-3 h-3" />
                  Đã duyệt BGH
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900">{plan.title}</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-purple-500" />
                Thời gian: <strong>{new Date(plan.startDate).toLocaleDateString('vi-VN')}</strong> đến <strong>{new Date(plan.endDate).toLocaleDateString('vi-VN')}</strong> • Soạn bởi: <strong>{plan.teacherName}</strong>
              </p>
            </div>

            {/* Objectives */}
            <div className="bg-purple-50/40 p-4 rounded-2xl border border-purple-100/80 space-y-2">
              <span className="text-xs font-bold text-purple-900 block">Mục tiêu bài học & Kỹ năng phát triển:</span>
              <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                {plan.objectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>

            {/* Activities Detail */}
            <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <strong className="text-slate-800 block mb-1">Chi tiết các hoạt động trong tuần:</strong>
              {plan.activitiesDetail}
            </div>

            {/* Drive Attachment Link */}
            {plan.driveFileName && (
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white text-xs">
                <div className="flex items-center gap-2 font-medium text-slate-700">
                  <FileText className="w-4 h-4 text-rose-500" />
                  <span>Tệp đính kèm Drive: <strong>{plan.driveFileName}</strong></span>
                </div>
                {plan.driveFileUrl && (
                  <a
                    href={plan.driveFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-purple-600 hover:text-purple-700"
                  >
                    Mở trên Drive <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CREATE LESSON PLAN MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-purple-100 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Soạn Kế Hoạch Giáo Dục & Giáo Án</h3>
              <button onClick={() => setIsFormOpen(false)} className="rounded-full p-1.5 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề kế hoạch giáo dục *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Kế hoạch tuần 27: Bé tìm hiểu về các loài hoa mùa xuân"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chủ đề giáo dục</label>
                  <input
                    type="text"
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số tuần trong năm học</label>
                  <input
                    type="number"
                    value={formData.weekNumber || 27}
                    onChange={(e) => setFormData({ ...formData, weekNumber: parseInt(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngày bắt đầu</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngày kết thúc</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mục tiêu cần đạt (Mỗi dòng một mục tiêu)
                </label>
                <textarea
                  rows={3}
                  placeholder="Trẻ biết gọi tên các loài hoa&#10;Rèn kỹ năng khéo léo của đôi tay qua tạo hình&#10;Biết yêu quý thiên nhiên và không bẻ cành"
                  value={objectivesInput}
                  onChange={(e) => setObjectivesInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nội dung chi tiết các hoạt động</label>
                <textarea
                  rows={3}
                  value={formData.activitiesDetail}
                  onChange={(e) => setFormData({ ...formData, activitiesDetail: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên file Google Drive</label>
                  <input
                    type="text"
                    placeholder="GiaoAn_Tuan27.docx"
                    value={formData.driveFileName || ''}
                    onChange={(e) => setFormData({ ...formData, driveFileName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Đường dẫn xem trên Google Drive</label>
                  <input
                    type="url"
                    placeholder="https://docs.google.com/..."
                    value={formData.driveFileUrl || ''}
                    onChange={(e) => setFormData({ ...formData, driveFileUrl: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2"
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
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700"
                >
                  Lưu kế hoạch giáo dục
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
