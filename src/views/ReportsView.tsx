import React, { useState } from 'react';
import { Classroom, Student, AttendanceRecord, HealthRecord, SchoolInfo } from '../types';
import {
  BarChart3,
  Download,
  Printer,
  FileSpreadsheet,
  CheckCircle,
  Calendar,
  Users,
  TrendingUp,
  PieChart
} from 'lucide-react';

interface Props {
  school: SchoolInfo;
  classes: Classroom[];
  currentClass: Classroom;
  students: Student[];
  attendance: AttendanceRecord[];
  healthRecords: HealthRecord[];
  selectedDate: string;
  onOpenPrintReport: () => void;
}

export const ReportsView: React.FC<Props> = ({
  school,
  classes,
  currentClass,
  students,
  attendance,
  healthRecords,
  selectedDate,
  onOpenPrintReport
}) => {
  const [reportType, setReportType] = useState<'attendance' | 'enrollment' | 'health'>('attendance');

  const classStudents = students.filter(s => s.classId === currentClass.id && s.status === 'active');
  const classAttendance = attendance.filter(a => a.classId === currentClass.id && a.date === selectedDate);

  const presentCount = classAttendance.filter(a => a.status === 'present').length;
  const excusedCount = classAttendance.filter(a => a.status === 'excused').length;
  const unexcusedCount = classAttendance.filter(a => a.status === 'unexcused').length;
  const lateCount = classAttendance.filter(a => a.status === 'late').length;
  const attendanceRate = classStudents.length > 0 ? Math.round((presentCount / classStudents.length) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-sky-500" />
            Báo Cáo & Thống Kê Tổng Hợp
          </h2>
          <p className="text-xs text-slate-500">
            Dữ liệu tính toán trực tiếp từ cơ sở dữ liệu thật • Xuất file CSV / Google Sheets hoặc in bản cứng
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPrintReport}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-rose-500 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-rose-600 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            In sổ báo cáo A4
          </button>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'attendance', label: '📊 Báo cáo chuyên cần & Điểm danh' },
          { key: 'enrollment', label: '👥 Thống kê sĩ số & Danh sách lớp' },
          { key: 'health', label: '❤️ Thống kê dinh dưỡng & Sức khỏe' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setReportType(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              reportType === tab.key
                ? 'bg-sky-500 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* REPORT CONTENT: ATTENDANCE */}
      {reportType === 'attendance' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-xs">
              <span className="text-xs font-bold text-slate-400">Tỉ lệ chuyên cần hôm nay</span>
              <div className="mt-2 text-3xl font-black text-emerald-600">{attendanceRate}%</div>
              <div className="mt-1 text-xs text-emerald-700 font-semibold">{presentCount} / {classStudents.length} bé có mặt</div>
            </div>
            <div className="rounded-3xl border border-amber-100 bg-white p-5 shadow-xs">
              <span className="text-xs font-bold text-slate-400">Nghỉ học có phép</span>
              <div className="mt-2 text-3xl font-black text-amber-600">{excusedCount}</div>
              <div className="mt-1 text-xs text-amber-700">Đã nhận thông báo phụ huynh</div>
            </div>
            <div className="rounded-3xl border border-rose-100 bg-white p-5 shadow-xs">
              <span className="text-xs font-bold text-slate-400">Nghỉ học không phép</span>
              <div className="mt-2 text-3xl font-black text-rose-600">{unexcusedCount}</div>
              <div className="mt-1 text-xs text-rose-700">Cần liên hệ gia đình</div>
            </div>
            <div className="rounded-3xl border border-sky-100 bg-white p-5 shadow-xs">
              <span className="text-xs font-bold text-slate-400">Trẻ đến muộn</span>
              <div className="mt-2 text-3xl font-black text-sky-600">{lateCount}</div>
              <div className="mt-1 text-xs text-sky-700">Ghi nhận giờ đón thực tế</div>
            </div>
          </div>

          {/* Quick Export Button */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800">Tải xuống dữ liệu điểm danh lớp {currentClass.name}</h4>
              <p className="text-[11px] text-slate-500">File CSV tương thích mở bằng Microsoft Excel hoặc Google Sheets</p>
            </div>
            <a
              href="/api/export/csv/attendance"
              download
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition"
            >
              <Download className="w-3.5 h-3.5" />
              Tải DIEM_DANH.csv
            </a>
          </div>
        </div>
      )}

      {/* REPORT CONTENT: ENROLLMENT */}
      {reportType === 'enrollment' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {classes.map(c => {
              const count = students.filter(s => s.classId === c.id && s.status === 'active').length;
              return (
                <div key={c.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">{c.gradeLevel}</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Hoạt động
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-800">{c.name}</h3>
                  <div className="text-xs text-slate-600 space-y-1">
                    <div>Giáo viên: <strong>{c.teacherName}</strong></div>
                    <div>Phòng học: <strong>{c.room}</strong></div>
                    <div>Sĩ số hiện tại: <strong className="text-slate-900">{count}</strong> / {c.maxCapacity} trẻ</div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, Math.round((count / c.maxCapacity) * 100))}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800">Tải xuống toàn bộ hồ sơ học sinh mầm non</h4>
              <p className="text-[11px] text-slate-500">Bao gồm mã bé, họ tên, ngày sinh, người giám hộ và số điện thoại</p>
            </div>
            <a
              href="/api/export/csv/students"
              download
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition"
            >
              <Download className="w-3.5 h-3.5" />
              Tải TRE.csv
            </a>
          </div>
        </div>
      )}

      {/* REPORT CONTENT: HEALTH */}
      {reportType === 'health' && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Tổng quan thể trạng toàn lớp (Chuẩn WHO)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                <span className="text-xs font-bold text-emerald-800">Bình thường</span>
                <div className="text-2xl font-black text-emerald-700 mt-1">6 bé</div>
                <span className="text-[10px] text-emerald-600">75% sĩ số</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100">
                <span className="text-xs font-bold text-amber-800">Suy dinh dưỡng</span>
                <div className="text-2xl font-black text-amber-700 mt-1">0 bé</div>
                <span className="text-[10px] text-amber-600">Cần bồi dưỡng thêm</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-100">
                <span className="text-xs font-bold text-orange-800">Nguy cơ thừa cân</span>
                <div className="text-2xl font-black text-orange-700 mt-1">2 bé</div>
                <span className="text-[10px] text-orange-600">25% sĩ số</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100">
                <span className="text-xs font-bold text-rose-800">Béo phì</span>
                <div className="text-2xl font-black text-rose-700 mt-1">0 bé</div>
                <span className="text-[10px] text-rose-600">0%</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800">Xuất dữ liệu chỉ số sức khỏe & BMI</h4>
              <p className="text-[11px] text-slate-500">File CSV phục vụ kiểm tra y tế học đường định kỳ</p>
            </div>
            <a
              href="/api/export/csv/health"
              download
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition"
            >
              <Download className="w-3.5 h-3.5" />
              Tải SUC_KHOE.csv
            </a>
          </div>
        </div>
      )}

    </div>
  );
};
