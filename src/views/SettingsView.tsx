import React, { useState } from 'react';
import { SchoolInfo, SystemAuditLog } from '../types';
import {
  Settings,
  Save,
  FileSpreadsheet,
  Building,
  Phone,
  Mail,
  User,
  ShieldCheck,
  CheckCircle,
  Clock,
  ExternalLink,
  History
} from 'lucide-react';

interface Props {
  school: SchoolInfo;
  auditLogs: SystemAuditLog[];
  gasStatus: any;
  onUpdateSchool: (data: Partial<SchoolInfo>) => Promise<void>;
  onOpenGoogleIntegration: () => void;
}

export const SettingsView: React.FC<Props> = ({
  school,
  auditLogs,
  gasStatus,
  onUpdateSchool,
  onOpenGoogleIntegration
}) => {
  const [formData, setFormData] = useState<SchoolInfo>({ ...school });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await onUpdateSchool(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-700" />
            Cài Đặt Hệ Thống & Thông Tin Nhận Diện
          </h2>
          <p className="text-xs text-slate-500">
            Tùy biến tên trường mầm non, ban giám hiệu, màu sắc thương hiệu và kết nối dịch vụ Google
          </p>
        </div>

        <button
          onClick={onOpenGoogleIntegration}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition cursor-pointer self-start md:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Mở cấu hình Google Workspace
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form: School Brand Info (2 Cols) */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Building className="w-5 h-5 text-rose-500" />
              Thông Tin Trường & Giáo Viên
            </h3>
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Đã lưu thành công!
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tên trường mầm non *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-rose-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Khẩu hiệu / Slogan trường</label>
              <input
                type="text"
                value={formData.slogan}
                onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-rose-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Hiệu trưởng / Đại diện BGH *</label>
                <input
                  type="text"
                  required
                  value={formData.principalName}
                  onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-rose-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Niên khóa hiện hành</label>
                <input
                  type="text"
                  value={formData.currentSchoolYearName}
                  onChange={(e) => setFormData({ ...formData, currentSchoolYearName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-rose-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Số điện thoại hotline</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-rose-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email liên hệ nhà trường</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-rose-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Địa chỉ trường</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-rose-400 focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Đang lưu...' : 'Lưu Cài Đặt'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Info: Google Integration Quick Card & Audit Logs */}
        <div className="space-y-6">
          
          {/* Quick Integration Card */}
          <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500 text-white">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-xs">Cơ sở dữ liệu Google Sheets</h4>
                <span className="text-[10px] font-semibold text-emerald-700">CSDL_QUAN_LY_MAM_NON_CO_HANH</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              Dữ liệu của 20 bảng tính được đồng bộ an toàn qua Google Apps Script API với cơ chế kiểm tra Shared Secret nội bộ và LockService.
            </p>

            <button
              onClick={onOpenGoogleIntegration}
              className="w-full py-2 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-xs font-bold transition cursor-pointer"
            >
              Xem chi tiết 12 bước cài đặt
            </button>
          </div>

          {/* Audit Logs Preview */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <History className="w-4 h-4 text-slate-500" />
              Nhật Ký Thao Tác Gần Đây (Audit Log)
            </h4>
            <div className="space-y-2 max-h-[220px] overflow-y-auto">
              {auditLogs.slice(0, 6).map((log) => (
                <div key={log.id} className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] space-y-0.5">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span className="font-bold text-slate-700">{log.performedBy}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-slate-600 line-clamp-1">{log.details}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
