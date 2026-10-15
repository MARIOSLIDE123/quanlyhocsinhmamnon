import React, { useState } from 'react';
import { Student, Classroom, AttendanceRecord, AttendanceStatus, SchoolInfo } from '../types';
import { StudentAvatarBadge } from '../components/StudentAvatarBadge';
import {
  CheckCircle,
  Calendar,
  Clock,
  Printer,
  Save,
  Users,
  AlertCircle,
  UserCheck,
  Thermometer,
  FileSpreadsheet,
  Download
} from 'lucide-react';

interface Props {
  students: Student[];
  currentClass: Classroom;
  classes: Classroom[];
  attendance: AttendanceRecord[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  onClassChange: (classId: string) => void;
  onSaveAttendance: (records: AttendanceRecord[]) => Promise<void>;
  onOpenPrintReport: () => void;
}

export const AttendanceView: React.FC<Props> = ({
  students,
  currentClass,
  classes,
  attendance,
  selectedDate,
  onDateChange,
  onClassChange,
  onSaveAttendance,
  onOpenPrintReport
}) => {
  const classStudents = students.filter(s => s.classId === currentClass.id && s.status === 'active');

  // Local state for batch editing before saving
  const [localRecords, setLocalRecords] = useState<{ [studentId: string]: Partial<AttendanceRecord> }>(() => {
    const map: { [studentId: string]: Partial<AttendanceRecord> } = {};
    for (const student of classStudents) {
      const existing = attendance.find(a => a.studentId === student.id && a.date === selectedDate);
      if (existing) {
        map[student.id] = { ...existing };
      } else {
        map[student.id] = {
          date: selectedDate,
          studentId: student.id,
          studentName: student.fullName,
          classId: currentClass.id,
          status: 'present', // Default to present for quick workflow
          arrivalTime: '07:35',
          temperature: 36.5,
          pickupNote: ''
        };
      }
    }
    return map;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Update a single student field in local records
  const updateStudentField = (studentId: string, field: keyof AttendanceRecord, value: any) => {
    setLocalRecords(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {
          date: selectedDate,
          studentId,
          classId: currentClass.id,
          status: 'present'
        }),
        [field]: value
      }
    }));
  };

  // Mark all students present with one click
  const handleMarkAllPresent = () => {
    const updated: { [studentId: string]: Partial<AttendanceRecord> } = {};
    for (const student of classStudents) {
      updated[student.id] = {
        ...(localRecords[student.id] || {}),
        date: selectedDate,
        studentId: student.id,
        studentName: student.fullName,
        classId: currentClass.id,
        status: 'present',
        arrivalTime: localRecords[student.id]?.arrivalTime || '07:30',
        temperature: localRecords[student.id]?.temperature || 36.5
      };
    }
    setLocalRecords(updated);
  };

  // Save all records to backend / Google Sheets
  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccessMsg('');
    try {
      const recordsToSave: AttendanceRecord[] = classStudents.map(student => {
        const item = localRecords[student.id] || {};
        return {
          id: item.id || `ATT-${Date.now()}-${student.id}`,
          date: selectedDate,
          studentId: student.id,
          studentName: student.fullName,
          classId: currentClass.id,
          status: (item.status as AttendanceStatus) || 'present',
          arrivalTime: item.arrivalTime || '',
          pickupTime: item.pickupTime || '',
          pickupPersonName: item.pickupPersonName || '',
          pickupNote: item.pickupNote || '',
          temperature: Number(item.temperature) || 36.5,
          updatedBy: currentClass.teacherName || 'Giáo viên',
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      });

      await onSaveAttendance(recordsToSave);
      setSaveSuccessMsg('Đã lưu điểm danh thành công!');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    } catch (err: any) {
      alert('Không thể lưu điểm danh: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate live counts
  const presentCount = classStudents.filter(s => localRecords[s.id]?.status === 'present').length;
  const excusedCount = classStudents.filter(s => localRecords[s.id]?.status === 'excused').length;
  const unexcusedCount = classStudents.filter(s => localRecords[s.id]?.status === 'unexcused').length;
  const lateCount = classStudents.filter(s => localRecords[s.id]?.status === 'late').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Date Picker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-emerald-500" />
            Sổ Điểm Danh & Theo Dõi Trẻ Hằng Ngày
          </h2>
          <p className="text-xs text-slate-500">
            Lớp {currentClass.name} • Giáo viên: {currentClass.teacherName}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Class Switcher */}
          <select
            value={currentClass.id}
            onChange={(e) => onClassChange(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs focus:outline-none"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Date Selector */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-rose-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="bg-transparent focus:outline-none"
            />
          </div>

          <button
            onClick={onOpenPrintReport}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            In sổ điểm danh
          </button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
          <span className="text-xs font-bold text-emerald-800">Có mặt</span>
          <div className="mt-1 text-2xl font-black text-emerald-700">{presentCount}</div>
          <div className="text-[11px] text-emerald-600">Đầy đủ sức khỏe</div>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
          <span className="text-xs font-bold text-amber-800">Nghỉ có phép</span>
          <div className="mt-1 text-2xl font-black text-amber-700">{excusedCount}</div>
          <div className="text-[11px] text-amber-600">Có phụ huynh báo trước</div>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
          <span className="text-xs font-bold text-rose-800">Nghỉ không phép</span>
          <div className="mt-1 text-2xl font-black text-rose-700">{unexcusedCount}</div>
          <div className="text-[11px] text-rose-600">Cần liên hệ phụ huynh</div>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
          <span className="text-xs font-bold text-sky-800">Đi muộn</span>
          <div className="mt-1 text-2xl font-black text-sky-700">{lateCount}</div>
          <div className="text-[11px] text-sky-600">Sau 08:15 sáng</div>
        </div>
      </div>

      {/* Fast Batch Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-white p-4 border border-rose-100 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllPresent}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Có mặt tất cả ({classStudents.length} bé)
          </button>
          {saveSuccessMsg && (
            <span className="text-xs font-bold text-emerald-600 animate-fade-in flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              {saveSuccessMsg}
            </span>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:from-rose-600 hover:to-pink-600 transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Đang lưu vào hệ thống...' : 'Lưu Sổ Điểm Danh'}
        </button>
      </div>

      {/* Attendance Matrix Table */}
      <div className="rounded-3xl border border-rose-100 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-rose-50/60 text-slate-700 border-b border-rose-100 uppercase tracking-wider font-extrabold text-[11px]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">STT</th>
                <th className="py-3 px-4">Học sinh</th>
                <th className="py-3 px-4">Trạng thái điểm danh</th>
                <th className="py-3 px-4 w-28 text-center">Giờ đến</th>
                <th className="py-3 px-4 w-24 text-center">Thân nhiệt</th>
                <th className="py-3 px-4">Người đón / Ghi chú của cô</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((student, idx) => {
                const rec = localRecords[student.id] || {};
                const status = rec.status || 'present';

                return (
                  <tr key={student.id} className="hover:bg-rose-50/20 transition">
                    <td className="py-3 px-4 text-center text-slate-400 font-bold">
                      {idx + 1}
                    </td>

                    {/* Student Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <StudentAvatarBadge
                          name={student.fullName}
                          initials={student.avatarInitials}
                          colorName={student.avatarColor}
                          size="md"
                        />
                        <div>
                          <div className="font-bold text-slate-800 text-xs">
                            {student.fullName}
                            {student.nickname && (
                              <span className="text-[11px] text-rose-500 font-normal ml-1">
                                ({student.nickname})
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">
                            {student.studentCode}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Attendance Status Buttons */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {[
                          { key: 'present', label: 'Có mặt', color: 'bg-emerald-500 text-white', inactive: 'bg-slate-100 text-slate-700 hover:bg-emerald-50' },
                          { key: 'excused', label: 'Có phép', color: 'bg-amber-500 text-white', inactive: 'bg-slate-100 text-slate-700 hover:bg-amber-50' },
                          { key: 'unexcused', label: 'Không phép', color: 'bg-rose-500 text-white', inactive: 'bg-slate-100 text-slate-700 hover:bg-rose-50' },
                          { key: 'late', label: 'Đi muộn', color: 'bg-sky-500 text-white', inactive: 'bg-slate-100 text-slate-700 hover:bg-sky-50' }
                        ].map(opt => (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => updateStudentField(student.id, 'status', opt.key)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                              status === opt.key ? opt.color : opt.inactive
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </td>

                    {/* Arrival Time */}
                    <td className="py-3 px-4 text-center">
                      <input
                        type="time"
                        value={rec.arrivalTime || ''}
                        onChange={(e) => updateStudentField(student.id, 'arrivalTime', e.target.value)}
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-center font-mono focus:border-rose-400 focus:outline-none"
                      />
                    </td>

                    {/* Temperature */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center rounded-lg border border-slate-200 px-2 py-1 text-xs">
                        <Thermometer className="w-3 h-3 text-rose-400 mr-1" />
                        <input
                          type="number"
                          step="0.1"
                          min="35"
                          max="40"
                          value={rec.temperature || 36.5}
                          onChange={(e) => updateStudentField(student.id, 'temperature', parseFloat(e.target.value))}
                          className="w-12 bg-transparent text-center font-mono focus:outline-none"
                        />
                        <span className="text-[10px] text-slate-400">°C</span>
                      </div>
                    </td>

                    {/* Note / Pickup person */}
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        placeholder="Ghi chú người đón hoặc lý do nghỉ..."
                        value={rec.pickupNote || ''}
                        onChange={(e) => updateStudentField(student.id, 'pickupNote', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-1 text-xs focus:border-rose-400 focus:outline-none"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
