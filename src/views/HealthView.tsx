import React, { useState } from 'react';
import { HealthRecord, DevelopmentalEvaluation, Student, Classroom } from '../types';
import { StudentAvatarBadge } from '../components/StudentAvatarBadge';
import {
  Activity,
  Plus,
  TrendingUp,
  Award,
  Heart,
  Scale,
  Ruler,
  AlertCircle,
  CheckCircle2,
  X,
  UserCheck
} from 'lucide-react';

interface Props {
  students: Student[];
  currentClass: Classroom;
  healthRecords: HealthRecord[];
  evaluations: DevelopmentalEvaluation[];
  onAddHealthRecord: (record: Partial<HealthRecord>) => Promise<void>;
  onAddEvaluation: (evaluation: Partial<DevelopmentalEvaluation>) => Promise<void>;
}

export const HealthView: React.FC<Props> = ({
  students,
  currentClass,
  healthRecords,
  evaluations,
  onAddHealthRecord,
  onAddEvaluation
}) => {
  const [activeTab, setActiveTab] = useState<'growth' | 'evaluations'>('growth');
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);

  const classStudents = students.filter(s => s.classId === currentClass.id && s.status === 'active');

  // Form state for health measurement
  const [healthForm, setHealthForm] = useState<{
    studentId: string;
    recordDate: string;
    heightCm: number;
    weightKg: number;
    eyesight: string;
    dentalHealth: string;
    healthNotes: string;
    checkedBy: string;
  }>({
    studentId: classStudents[0]?.id || '',
    recordDate: new Date().toISOString().split('T')[0],
    heightCm: 105,
    weightKg: 17,
    eyesight: '10/10',
    dentalHealth: 'Tốt',
    healthNotes: 'Thể trạng tốt, hoạt bát',
    checkedBy: 'Y tế trường - Cô Hoàng Lan'
  });

  // Calculate BMI and status automatically
  const calculateBmi = (heightCm: number, weightKg: number) => {
    if (!heightCm || !weightKg) return { bmi: 0, status: 'Bình thường' as const };
    const heightM = heightCm / 100;
    const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
    let status: 'Suy dinh dưỡng' | 'Bình thường' | 'Nguy cơ thừa cân' | 'Béo phì' = 'Bình thường';
    if (bmi < 14) status = 'Suy dinh dưỡng';
    else if (bmi >= 14 && bmi <= 16.5) status = 'Bình thường';
    else if (bmi > 16.5 && bmi <= 18) status = 'Nguy cơ thừa cân';
    else status = 'Béo phì';
    return { bmi, status };
  };

  const handleHealthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === healthForm.studentId);
    const { bmi, status } = calculateBmi(healthForm.heightCm, healthForm.weightKg);

    try {
      await onAddHealthRecord({
        ...healthForm,
        studentName: st?.fullName,
        classId: currentClass.id,
        bmi,
        bmiStatus: status
      });
      setIsHealthModalOpen(false);
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    }
  };

  // Evaluation form state
  const [evalForm, setEvalForm] = useState<{
    studentId: string;
    monthYear: string;
    domainPhysical: number;
    domainPhysicalNote: string;
    domainCognitive: number;
    domainCognitiveNote: string;
    domainLanguage: number;
    domainLanguageNote: string;
    domainSocialEmotional: number;
    domainSocialEmotionalNote: string;
    domainAesthetic: number;
    domainAestheticNote: string;
    generalRemark: string;
  }>({
    studentId: classStudents[0]?.id || '',
    monthYear: '03/2026',
    domainPhysical: 5,
    domainPhysicalNote: 'Vận động nhanh nhẹn, thăng bằng tốt',
    domainCognitive: 4,
    domainCognitiveNote: 'Đếm số tốt, nhận diện hình tròn vuông tam giác',
    domainLanguage: 5,
    domainLanguageNote: 'Giao tiếp rõ ràng, biết biểu đạt cảm xúc',
    domainSocialEmotional: 5,
    domainSocialEmotionalNote: 'Biết chia sẻ đồ chơi cùng bạn',
    domainAesthetic: 4,
    domainAestheticNote: 'Hào hứng múa hát và tô màu',
    generalRemark: 'Bé rất ngoan và tích cực tham gia các hoạt động tập thể.'
  });

  const handleEvalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === evalForm.studentId);
    try {
      await onAddEvaluation({
        ...evalForm,
        studentName: st?.fullName,
        classId: currentClass.id,
        teacherId: currentClass.teacherId,
        teacherName: currentClass.teacherName
      });
      setIsEvalModalOpen(false);
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
            <Activity className="w-6 h-6 text-sky-500" />
            Hồ Sơ Sức Khỏe & Đánh Giá Phát Triển
          </h2>
          <p className="text-xs text-slate-500">
            Theo dõi định kỳ chiều cao, cân nặng, BMI theo chuẩn WHO và 5 lĩnh vực phát triển của trẻ
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsHealthModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-sky-500 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-sky-600 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Ghi nhận cân đo
          </button>
          <button
            onClick={() => setIsEvalModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-purple-500 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-purple-600 transition cursor-pointer"
          >
            <Award className="w-4 h-4" />
            Đánh giá 5 lĩnh vực
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('growth')}
          className={`pb-3 text-sm font-bold border-b-2 transition cursor-pointer px-4 ${
            activeTab === 'growth'
              ? 'border-sky-500 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Chỉ số tăng trưởng (Chiều cao, Cân nặng, BMI)
        </button>
        <button
          onClick={() => setActiveTab('evaluations')}
          className={`pb-3 text-sm font-bold border-b-2 transition cursor-pointer px-4 ${
            activeTab === 'evaluations'
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Đánh giá 5 lĩnh vực phát triển
        </button>
      </div>

      {/* TAB 1: GROWTH & BMI */}
      {activeTab === 'growth' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {classStudents.map((student) => {
              const rec = healthRecords.find(h => h.studentId === student.id) || {
                heightCm: 106,
                weightKg: 17.5,
                bmi: 15.6,
                bmiStatus: 'Bình thường' as const,
                recordDate: '2026-03-01',
                healthNotes: ''
              };

              const statusColor = {
                'Suy dinh dưỡng': 'bg-amber-100 text-amber-800 border-amber-200',
                'Bình thường': 'bg-emerald-100 text-emerald-800 border-emerald-200',
                'Nguy cơ thừa cân': 'bg-orange-100 text-orange-800 border-orange-200',
                'Béo phì': 'bg-rose-100 text-rose-800 border-rose-200'
              }[rec.bmiStatus] || 'bg-slate-100 text-slate-800 border-slate-200';

              return (
                <div
                  key={student.id}
                  className="rounded-3xl border border-sky-100 bg-white p-5 shadow-xs space-y-4 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <StudentAvatarBadge
                      name={student.fullName}
                      initials={student.avatarInitials}
                      colorName={student.avatarColor}
                      size="md"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-800 text-sm truncate">{student.fullName}</h4>
                      <span className="font-mono text-[10px] text-slate-400">{student.studentCode}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Chiều cao</div>
                      <div className="font-black text-slate-800 text-sm">{rec.heightCm} cm</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Cân nặng</div>
                      <div className="font-black text-slate-800 text-sm">{rec.weightKg} kg</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Chỉ số BMI</div>
                      <div className="font-black text-sky-600 text-sm">{rec.bmi}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Thể trạng:</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold border text-[11px] ${statusColor}`}>
                      {rec.bmiStatus}
                    </span>
                  </div>

                  {rec.healthNotes && (
                    <p className="text-[11px] text-slate-500 italic border-t border-slate-100 pt-2">
                      "{rec.healthNotes}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: DEVELOPMENTAL EVALUATION */}
      {activeTab === 'evaluations' && (
        <div className="space-y-4">
          {evaluations.map((ev) => (
            <div key={ev.id} className="rounded-3xl border border-purple-100 bg-white p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base text-slate-800">
                    Bé: {ev.studentName || 'Học sinh'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                    Tháng {ev.monthYear}
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  Đánh giá bởi: <strong>{ev.teacherName}</strong>
                </span>
              </div>

              {/* 5 Domains Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {[
                  { title: '1. Thể chất', score: ev.domainPhysical, note: ev.domainPhysicalNote, color: 'text-emerald-700 bg-emerald-50' },
                  { title: '2. Nhận thức', score: ev.domainCognitive, note: ev.domainCognitiveNote, color: 'text-sky-700 bg-sky-50' },
                  { title: '3. Ngôn ngữ', score: ev.domainLanguage, note: ev.domainLanguageNote, color: 'text-amber-700 bg-amber-50' },
                  { title: '4. Tình cảm & XH', score: ev.domainSocialEmotional, note: ev.domainSocialEmotionalNote, color: 'text-rose-700 bg-rose-50' },
                  { title: '5. Thẩm mỹ', score: ev.domainAesthetic, note: ev.domainAestheticNote, color: 'text-purple-700 bg-purple-50' }
                ].map((d, i) => (
                  <div key={i} className={`p-3.5 rounded-2xl border border-slate-100 ${d.color} space-y-1.5`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{d.title}</span>
                      <span className="text-xs font-black">{d.score}/5 ⭐</span>
                    </div>
                    <p className="text-[11px] leading-relaxed line-clamp-3 opacity-90">{d.note || 'Đạt yêu cầu'}</p>
                  </div>
                ))}
              </div>

              {/* General Remark */}
              <div className="bg-purple-50/50 p-3.5 rounded-2xl border border-purple-100 text-xs text-purple-900">
                <strong>Nhận xét chung của giáo viên chủ nhiệm:</strong> "{ev.generalRemark}"
              </div>
            </div>
          ))}
        </div>
      )}

      {/* HEALTH RECORD MODAL */}
      {isHealthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl border border-sky-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Ghi Nhận Chỉ Số Sức Khỏe Trẻ</h3>
              <button onClick={() => setIsHealthModalOpen(false)} className="rounded-full p-1.5 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleHealthSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Chọn học sinh</label>
                <select
                  value={healthForm.studentId}
                  onChange={(e) => setHealthForm({ ...healthForm, studentId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2"
                >
                  {classStudents.map(s => (
                    <option key={s.id} value={s.id}>{s.fullName} ({s.studentCode})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chiều cao (cm) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={healthForm.heightCm}
                    onChange={(e) => setHealthForm({ ...healthForm, heightCm: parseFloat(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cân nặng (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={healthForm.weightKg}
                    onChange={(e) => setHealthForm({ ...healthForm, weightKg: parseFloat(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-sky-50 p-2.5 text-center text-xs text-sky-800 font-semibold border border-sky-100">
                BMI tự tính: <strong>{calculateBmi(healthForm.heightCm, healthForm.weightKg).bmi}</strong> — Thể trạng: <strong>{calculateBmi(healthForm.heightCm, healthForm.weightKg).status}</strong>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi chú sức khỏe</label>
                <input
                  type="text"
                  value={healthForm.healthNotes}
                  onChange={(e) => setHealthForm({ ...healthForm, healthNotes: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsHealthModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-600"
                >
                  Lưu chỉ số
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EVALUATION MODAL */}
      {isEvalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-purple-100 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Đánh Giá 5 Lĩnh Vực Phát Triển</h3>
              <button onClick={() => setIsEvalModalOpen(false)} className="rounded-full p-1.5 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEvalSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chọn học sinh</label>
                  <select
                    value={evalForm.studentId}
                    onChange={(e) => setEvalForm({ ...evalForm, studentId: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2"
                  >
                    {classStudents.map(s => (
                      <option key={s.id} value={s.id}>{s.fullName} ({s.studentCode})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tháng / Năm đánh giá</label>
                  <input
                    type="text"
                    value={evalForm.monthYear}
                    onChange={(e) => setEvalForm({ ...evalForm, monthYear: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                </div>
              </div>

              {/* 5 Domains */}
              {[
                { label: '1. Phát triển Thể chất', keyScore: 'domainPhysical', keyNote: 'domainPhysicalNote' },
                { label: '2. Phát triển Nhận thức', keyScore: 'domainCognitive', keyNote: 'domainCognitiveNote' },
                { label: '3. Phát triển Ngôn ngữ', keyScore: 'domainLanguage', keyNote: 'domainLanguageNote' },
                { label: '4. Phát triển Tình cảm & Kỹ năng xã hội', keyScore: 'domainSocialEmotional', keyNote: 'domainSocialEmotionalNote' },
                { label: '5. Phát triển Thẩm mỹ', keyScore: 'domainAesthetic', keyNote: 'domainAestheticNote' }
              ].map(d => (
                <div key={d.label} className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{d.label}</span>
                    <select
                      value={(evalForm as any)[d.keyScore]}
                      onChange={(e) => setEvalForm({ ...evalForm, [d.keyScore]: parseInt(e.target.value) })}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 font-bold"
                    >
                      <option value="5">5 ⭐ (Xuất sắc)</option>
                      <option value="4">4 ⭐ (Tốt)</option>
                      <option value="3">3 ⭐ (Đạt)</option>
                      <option value="2">2 ⭐ (Cần rèn thêm)</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Ghi chú nhận xét cụ thể..."
                    value={(evalForm as any)[d.keyNote]}
                    onChange={(e) => setEvalForm({ ...evalForm, [d.keyNote]: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs"
                  />
                </div>
              ))}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nhận xét tổng hợp của giáo viên</label>
                <textarea
                  rows={2}
                  value={evalForm.generalRemark}
                  onChange={(e) => setEvalForm({ ...evalForm, generalRemark: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEvalModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700"
                >
                  Lưu bản đánh giá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
