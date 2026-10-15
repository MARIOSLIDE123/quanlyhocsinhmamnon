import React, { useState } from 'react';
import { GAS_SUITE } from '../server/gasScriptFiles';
import { apiClient } from '../services/api';
import {
  FileSpreadsheet,
  FolderGit2,
  Code2,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  RefreshCw,
  X,
  Layers,
  ChevronRight,
  ShieldCheck,
  Download
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  gasStatus: any;
  onRefreshStatus: () => void;
}

export const GoogleIntegrationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  gasStatus,
  onRefreshStatus
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sheets' | 'drive' | 'gas_code' | 'guide'>('overview');
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleCopyCode = (code: string, filename: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2500);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await apiClient.testGasConnection();
      setTestResult(res.data);
      onRefreshStatus();
    } catch (err: any) {
      setTestResult({ status: 'error', errorMessage: err.message });
    } finally {
      setIsTesting(false);
    }
  };

  const sheetsList = [
    { name: 'TRUONG', desc: 'Thông tin trường, ban giám hiệu, nhận diện' },
    { name: 'NAM_HOC', desc: 'Danh mục niên khóa và năm học' },
    { name: 'LOP', desc: 'Danh sách lớp mầm, chồi, lá, sĩ số' },
    { name: 'TAI_KHOAN', desc: 'Tài khoản xác thực và vai trò RBAC' },
    { name: 'GIAO_VIEN', desc: 'Hồ sơ giáo viên, chuyên môn phụ trách' },
    { name: 'TRE', desc: 'Hồ sơ học sinh mầm non đầy đủ' },
    { name: 'PHU_HUYNH', desc: 'Hồ sơ người giám hộ và liên hệ' },
    { name: 'LIEN_KET_GIA_DINH', desc: 'Quan hệ cha mẹ - con và quyền đón' },
    { name: 'DIEM_DANH', desc: 'Dữ liệu điểm danh ngày, giờ đến, giờ về' },
    { name: 'SUC_KHOE', desc: 'Chỉ số chiều cao, cân nặng, BMI, mắt, răng' },
    { name: 'PHAT_TRIEN', desc: 'Đánh giá 5 lĩnh vực phát triển theo chuẩn MN' },
    { name: 'THUC_DON', desc: 'Thực đơn dinh dưỡng tuần (Sáng, Trưa, Xế)' },
    { name: 'HOAT_DONG', desc: 'Lịch hoạt động, thời khóa biểu sinh hoạt' },
    { name: 'KE_HOACH_GIAO_DUC', desc: 'Giáo án, kế hoạch tháng/tuần/ngày' },
    { name: 'THONG_BAO', desc: 'Bảng tin và thông báo tới phụ huynh' },
    { name: 'DA_DOC_THONG_BAO', desc: 'Trạng thái theo dõi phụ huynh đã đọc' },
    { name: 'TEP_TIN', desc: 'Metadata tệp Google Drive (ảnh, video, hồ sơ)' },
    { name: 'TRAO_DOI', desc: 'Tin nhắn trao đổi riêng tư cô giáo - phụ huynh' },
    { name: 'NHAT_KY_HE_THONG', desc: 'Nhật ký kiểm toán thao tác hệ thống' },
    { name: 'CAU_HINH', desc: 'Tham số cấu hình vận hành nhà trường' }
  ];

  const driveFolders = [
    { code: '01_HO_SO_TRE', desc: 'Ảnh thẻ, giấy khai sinh, hồ sơ sức khỏe đầu vào' },
    { code: '02_GIAO_AN_KE_HOACH', desc: 'File Word, PDF giáo án, kế hoạch chuyên môn' },
    { code: '03_HINH_ANH_HOAT_DONG', desc: 'Ảnh chụp hoạt động học tập, vui chơi, lễ hội' },
    { code: '04_VIDEO_HOAT_DONG', desc: 'Video hoạt động văn nghệ, thể dục, kỹ năng sống' },
    { code: '05_TAI_LIEU_HOC_LIEU', desc: 'Học liệu điện tử, tranh ảnh giáo cụ mầm non' },
    { code: '06_BAO_CAO', desc: 'Báo cáo tổng kết chuyên cần, dinh dưỡng' },
    { code: '07_TEP_DINH_KEM', desc: 'Tài liệu đính kèm thông báo phụ huynh' },
    { code: '08_LUU_TRU_THEO_NAM_HOC', desc: 'Kho lưu trữ dữ liệu các năm học trước' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl bg-white shadow-2xl border border-rose-100 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rose-100 bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-md">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                Trung Tâm Kết Nối Google Workspace
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-3 h-3" />
                  Bảo mật cao
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Google Sheets (CSDL_QUAN_LY_MAM_NON_CO_HANH) & Google Drive (KHO_DU_LIEU_QUAN_LY_MAM_NON)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-white hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-rose-100 bg-rose-50/50 px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'border-rose-500 text-rose-600 bg-white/70'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Trạng thái & Kiểm tra
          </button>
          <button
            onClick={() => setActiveTab('sheets')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'sheets'
                ? 'border-rose-500 text-rose-600 bg-white/70'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            Cấu trúc 20 Bảng Sheets
          </button>
          <button
            onClick={() => setActiveTab('drive')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'drive'
                ? 'border-rose-500 text-rose-600 bg-white/70'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            Cấu trúc Google Drive
          </button>
          <button
            onClick={() => setActiveTab('gas_code')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'gas_code'
                ? 'border-rose-500 text-rose-600 bg-white/70'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4" />
            Bộ mã Google Apps Script (.gs)
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'guide'
                ? 'border-rose-500 text-rose-600 bg-white/70'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
            Hướng dẫn 12 Bước Triển Khai
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: OVERVIEW & STATUS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Connection Status Card */}
              <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-white to-rose-50/40 p-5 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      gasStatus?.status === 'connected'
                        ? 'bg-emerald-500 text-white'
                        : gasStatus?.isConfigured
                        ? 'bg-amber-500 text-white'
                        : 'bg-rose-500 text-white'
                    }`}>
                      {gasStatus?.status === 'connected' ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <AlertCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-800">
                        {gasStatus?.status === 'connected'
                          ? 'Đã kết nối trực tiếp với Google Apps Script'
                          : gasStatus?.isConfigured
                          ? 'Đã cấu hình URL nhưng cần kiểm tra quyền truy cập'
                          : 'Đang vận hành với Bộ nhớ lưu trữ an toàn trên máy chủ'}
                      </h3>
                      <p className="mt-1 text-xs text-slate-600">
                        {gasStatus?.status === 'connected'
                          ? 'Mọi thay đổi dữ liệu được đồng bộ trực tiếp hai chiều với Google Sheets.'
                          : 'Dữ liệu được lưu trữ thật trên máy chủ (survives reload), bạn có thể kết nối Google Apps Script bất cứ lúc nào qua file .env để đồng bộ Google Sheets!'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleTestConnection}
                      disabled={isTesting}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3.5 py-2 text-xs font-semibold text-rose-700 shadow-xs hover:bg-rose-50 transition cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                      {isTesting ? 'Đang kiểm tra...' : 'Kiểm tra kết nối'}
                    </button>
                  </div>
                </div>

                {testResult && (
                  <div className={`mt-4 rounded-xl p-3 text-xs ${
                    testResult.status === 'connected'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    <strong>Kết quả kiểm tra:</strong> {testResult.errorMessage || 'Kết nối thành công đến Google Apps Script Web App!'}
                  </div>
                )}
              </div>

              {/* Architecture Blueprint Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
                  <span className="text-2xl">📊</span>
                  <h4 className="mt-2 font-bold text-slate-800 text-sm">Kho Google Sheets</h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Tên file: <code>CSDL_QUAN_LY_MAM_NON_CO_HANH</code>. Bao gồm 20 bảng chuẩn hóa có UUID và LockService.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
                  <span className="text-2xl">📁</span>
                  <h4 className="mt-2 font-bold text-slate-800 text-sm">Kho Google Drive</h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Thư mục gốc: <code>KHO_DU_LIEU_QUAN_LY_MAM_NON</code>. Lưu trữ ảnh, giáo án, video với 8 danh mục bảo mật.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
                  <span className="text-2xl">⚡</span>
                  <h4 className="mt-2 font-bold text-slate-800 text-sm">Google Apps Script</h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Web App xử lý nghiệp vụ, tự động tạo 20 sheet bằng hàm <code>initDatabase()</code>, xác thực Shared Secret.
                  </p>
                </div>
              </div>

              {/* Data Export Center */}
              <div className="rounded-2xl border border-rose-100 bg-white p-5">
                <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Download className="w-4 h-4 text-rose-500" />
                  Xuất dữ liệu chuẩn bị nạp vào Google Sheets (CSV)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['TRE', 'DIEM_DANH', 'SUC_KHOE', 'THUC_DON', 'HOAT_DONG'].map((tbl) => (
                    <a
                      key={tbl}
                      href={`/api/export/csv/${tbl}`}
                      download
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 text-xs font-medium text-slate-700 transition"
                    >
                      <Download className="w-3 h-3 text-slate-500" />
                      Bảng {tbl}.csv
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 20 SHEETS STRUCTURE */}
          {activeTab === 'sheets' && (
            <div className="space-y-4">
              <div className="rounded-xl bg-rose-50 p-3.5 text-xs text-rose-900 border border-rose-200">
                💡 <strong>Tự động tạo:</strong> Khi bạn dán mã Apps Script và chạy hàm <code>initDatabase()</code>, Google Apps Script sẽ tự động tạo đủ 20 trang tính này cùng hàng tiêu đề được định dạng màu sắc chuyên nghiệp.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sheetsList.map((s, idx) => (
                  <div key={s.name} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-rose-200/80 text-[11px] font-bold text-rose-800">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-mono text-xs font-bold text-slate-800">{s.name}</div>
                      <div className="text-xs text-slate-500">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DRIVE STRUCTURE */}
          {activeTab === 'drive' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-3">
                  <FolderGit2 className="w-4 h-4 text-amber-500" />
                  Cấu trúc thư mục Google Drive: <code>KHO_DU_LIEU_QUAN_LY_MAM_NON</code>
                </h4>
                <p className="text-xs text-slate-600 mb-4">
                  Không lưu trực tiếp tệp lớn trong ô Google Sheets. Toàn bộ ảnh, video và học liệu được lưu trữ phân cấp trên Drive, chỉ lưu File ID và liên kết xem bảo mật trong Google Sheets.
                </p>
                <div className="space-y-2">
                  {driveFolders.map((f) => (
                    <div key={f.code} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-xs">
                      <div className="flex items-center gap-2 font-mono font-semibold text-slate-800">
                        📁 {f.code}
                      </div>
                      <div className="text-slate-500 text-right">{f.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GAS CODE SUITE */}
          {activeTab === 'gas_code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {GAS_SUITE.map((file, idx) => (
                    <button
                      key={file.filename}
                      onClick={() => setSelectedFileIdx(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition cursor-pointer whitespace-nowrap ${
                        selectedFileIdx === idx
                          ? 'bg-rose-500 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {file.filename}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleCopyCode(GAS_SUITE[selectedFileIdx].code, GAS_SUITE[selectedFileIdx].filename)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-900 transition cursor-pointer shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedFile === GAS_SUITE[selectedFileIdx].filename ? 'Đã sao chép!' : 'Sao chép mã'}
                </button>
              </div>

              <div className="text-xs text-slate-500 italic">
                {GAS_SUITE[selectedFileIdx].description}
              </div>

              <div className="relative rounded-2xl bg-slate-900 p-4 text-xs font-mono text-slate-100 max-h-[380px] overflow-y-auto shadow-inner border border-slate-800">
                <pre>{GAS_SUITE[selectedFileIdx].code}</pre>
              </div>
            </div>
          )}

          {/* TAB 5: 12 STEPS SETUP GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-3">
              {[
                { step: 1, title: 'Tạo Google Spreadsheet', desc: 'Mở Google Sheets, tạo bảng tính mới đặt tên: CSDL_QUAN_LY_MAM_NON_CO_HANH và sao chép Spreadsheet ID từ thanh địa chỉ URL.' },
                { step: 2, title: 'Tạo Thư mục Google Drive', desc: 'Mở Google Drive, tạo thư mục gốc: KHO_DU_LIEU_QUAN_LY_MAM_NON để chứa tài liệu và ảnh của các bé.' },
                { step: 3, title: 'Tạo Google Apps Script', desc: 'Trên Google Sheets, vào Tiện ích mở rộng -> Apps Script (Extensions -> Apps Script).' },
                { step: 4, title: 'Dán mã các tệp .gs', desc: 'Tạo các tệp Code.gs, Config.gs, Database.gs, DriveService.gs, InitSetup.gs từ tab "Bộ mã Google Apps Script" ở trên.' },
                { step: 5, title: 'Cài đặt Script Properties', desc: 'Trong Apps Script, vào Cài đặt dự án (Project Settings) -> Thuộc tính tập lệnh (Script Properties), thêm: SPREADSHEET_ID, DRIVE_ROOT_FOLDER_ID, APP_SHARED_SECRET.' },
                { step: 6, title: 'Chạy hàm initDatabase()', desc: 'Chọn hàm initDatabase() và bấm Chạy (Run). Cấp quyền truy cập Google. Hàm sẽ tự động tạo đủ 20 sheet cùng tiêu đề màu sắc.' },
                { step: 7, title: 'Triển khai Web App (Deploy)', desc: 'Bấm Triển khai (Deploy) -> Triển khai mới (New deployment) -> Loại: Ứng dụng web (Web app). Thực thi dưới quyền: Tôi (Me). Quyền truy cập: Bất kỳ ai (Anyone).' },
                { step: 8, title: 'Sao chép Web App URL', desc: 'Sao chép URL có dạng: https://script.google.com/macros/s/.../exec.' },
                { step: 9, title: 'Cấu hình vào ứng dụng', desc: 'Dán URL vào biến APPS_SCRIPT_URL trong file .env hoặc tab Cài đặt của ứng dụng.' },
                { step: 10, title: 'Kiểm tra kết nối', desc: 'Bấm nút "Kiểm tra kết nối" trong tab Trạng thái để xác nhận luồng dữ liệu thông suốt.' },
                { step: 11, title: 'Nhập dữ liệu trường & lớp', desc: 'Thiết lập tên trường, danh sách lớp mầm non, năm học và giáo viên phụ trách.' },
                { step: 12, title: 'Bắt đầu sử dụng thực tế', desc: 'Điểm danh hằng ngày, theo dõi thực đơn, ghi nhận sức khỏe và gửi thông báo cho phụ huynh!' }
              ].map(item => (
                <div key={item.step} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-2xs">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
                    {item.step}
                  </span>
                  <div>
                    <h5 className="font-bold text-slate-800 text-xs">{item.title}</h5>
                    <p className="mt-0.5 text-xs text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-rose-100 bg-rose-50/30 px-6 py-3.5">
          <div className="text-xs text-slate-500">
            Hệ thống Cô Hạnh Mầm Non • Phiên bản 1.0.0
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-rose-500 px-5 py-2 text-xs font-bold text-white hover:bg-rose-600 transition cursor-pointer"
          >
            Đóng bảng hướng dẫn
          </button>
        </div>

      </div>
    </div>
  );
};
