import React from 'react';
import { SchoolInfo, Classroom, Student, AttendanceRecord } from '../types';
import { Printer, X, Download } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  school: SchoolInfo;
  currentClass: Classroom;
  students: Student[];
  attendance: AttendanceRecord[];
  selectedDate: string;
}

export const PrintableReportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  school,
  currentClass,
  students,
  attendance,
  selectedDate
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const presentCount = attendance.filter(a => a.status === 'present').length;
  const excusedCount = attendance.filter(a => a.status === 'excused').length;
  const unexcusedCount = attendance.filter(a => a.status === 'unexcused').length;
  const lateCount = attendance.filter(a => a.status === 'late').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl border border-slate-200 flex flex-col max-h-[94vh] overflow-hidden">
        
        {/* Action Header - Hidden when printing */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-3 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800">Xem trước bản in báo cáo chuyên cần</span>
            <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-medium">Khổ A4</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-600 transition shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              In Báo Cáo / Xuất PDF
            </button>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-white print:p-0 text-slate-900">
          
          {/* Header of Report */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-600">
                  {school.name}
                </h4>
                <p className="text-xs text-slate-500">{school.address}</p>
                <p className="text-xs text-slate-500">Điện thoại: {school.phone} • Email: {school.email}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-600">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</span>
                <p className="text-[11px] italic text-slate-500">Độc lập - Tự do - Hạnh phúc</p>
                <div className="w-24 h-0.5 bg-slate-400 mx-auto mt-1 mr-0"></div>
              </div>
            </div>

            <div className="text-center mt-6">
              <h1 className="text-xl font-black uppercase text-slate-900 tracking-wide">
                BÁO CÁO TỔNG HỢP CHUYÊN CẦN & ĐIỂM DANH HÀNG NGÀY
              </h1>
              <p className="text-xs font-medium text-slate-600 mt-1">
                Lớp: <strong>{currentClass.name}</strong> • Giáo viên phụ trách: <strong>{currentClass.teacherName}</strong>
              </p>
              <p className="text-xs italic text-slate-500">
                Ngày: {new Date(selectedDate).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Summary Box */}
          <div className="grid grid-cols-5 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center mb-6">
            <div>
              <div className="text-[11px] text-slate-500">Tổng sĩ số</div>
              <div className="text-base font-bold text-slate-800">{students.length}</div>
            </div>
            <div>
              <div className="text-[11px] text-emerald-600 font-medium">Có mặt</div>
              <div className="text-base font-bold text-emerald-700">{presentCount}</div>
            </div>
            <div>
              <div className="text-[11px] text-amber-600 font-medium">Nghỉ phép</div>
              <div className="text-base font-bold text-amber-700">{excusedCount}</div>
            </div>
            <div>
              <div className="text-[11px] text-rose-600 font-medium">Không phép</div>
              <div className="text-base font-bold text-rose-700">{unexcusedCount}</div>
            </div>
            <div>
              <div className="text-[11px] text-sky-600 font-medium">Đi muộn</div>
              <div className="text-base font-bold text-sky-700">{lateCount}</div>
            </div>
          </div>

          {/* Attendance Table */}
          <table className="w-full text-left text-xs border border-slate-300 border-collapse mb-8">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300">
                <th className="p-2 border-r border-slate-300 w-8 text-center font-bold">STT</th>
                <th className="p-2 border-r border-slate-300 w-20 font-bold">Mã bé</th>
                <th className="p-2 border-r border-slate-300 font-bold">Họ và tên trẻ</th>
                <th className="p-2 border-r border-slate-300 w-24 text-center font-bold">Trạng thái</th>
                <th className="p-2 border-r border-slate-300 w-20 text-center font-bold">Giờ đến</th>
                <th className="p-2 border-r border-slate-300 w-20 text-center font-bold">Nhiệt độ</th>
                <th className="p-2 font-bold">Ghi chú & Lý do</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => {
                const rec = attendance.find(a => a.studentId === student.id);
                const status = rec?.status || 'unmarked';
                const statusText = {
                  present: 'Có mặt',
                  excused: 'Nghỉ phép',
                  unexcused: 'Không phép',
                  late: 'Đi muộn',
                  early: 'Về sớm',
                  unmarked: 'Chưa điểm danh'
                }[status];

                return (
                  <tr key={student.id} className="border-b border-slate-200 hover:bg-slate-50/50">
                    <td className="p-2 border-r border-slate-300 text-center">{idx + 1}</td>
                    <td className="p-2 border-r border-slate-300 font-mono text-[11px]">{student.studentCode}</td>
                    <td className="p-2 border-r border-slate-300 font-medium">{student.fullName}</td>
                    <td className="p-2 border-r border-slate-300 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        status === 'present' ? 'text-emerald-700' :
                        status === 'excused' ? 'text-amber-700' :
                        status === 'unexcused' ? 'text-rose-700' : 'text-slate-600'
                      }`}>
                        {statusText}
                      </span>
                    </td>
                    <td className="p-2 border-r border-slate-300 text-center">{rec?.arrivalTime || '-'}</td>
                    <td className="p-2 border-r border-slate-300 text-center">{rec?.temperature ? `${rec.temperature}°C` : '-'}</td>
                    <td className="p-2 italic text-slate-600">{rec?.pickupNote || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Signatures */}
          <div className="grid grid-cols-2 text-center text-xs mt-10 pt-4">
            <div>
              <p className="font-bold text-slate-800">GIÁO VIÊN CHỦ NHIỆM</p>
              <p className="text-[11px] italic text-slate-500">(Ký và ghi rõ họ tên)</p>
              <div className="h-16"></div>
              <p className="font-semibold text-slate-900">{currentClass.teacherName}</p>
            </div>
            <div>
              <p className="font-bold text-slate-800">BAN GIÁM HIỆU PHÊ DUYỆT</p>
              <p className="text-[11px] italic text-slate-500">(Ký và đóng dấu)</p>
              <div className="h-16"></div>
              <p className="font-semibold text-slate-900">{school.principalName}</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
