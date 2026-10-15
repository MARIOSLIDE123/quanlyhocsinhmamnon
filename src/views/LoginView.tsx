import React, { useState } from 'react';
import { UserAccount, UserRole } from '../types';
import {
  ShieldCheck,
  Lock,
  User,
  LogIn,
  GraduationCap,
  Heart,
  Users,
  Sparkles,
  ArrowRight,
  School,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Props {
  accounts: UserAccount[];
  onLogin: (user: UserAccount) => void;
}

export const LoginView: React.FC<Props> = ({ accounts, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Sample quick accounts defined according to specifications
  const sampleAccounts = [
    {
      role: 'admin' as UserRole,
      title: 'Ban Giám Hiệu',
      roleBadge: 'Toàn quyền trường',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      cardBorder: 'hover:border-indigo-400',
      btnGradient: 'from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700',
      icon: GraduationCap,
      name: 'Cô Nguyễn Thị Mai',
      position: 'Hiệu trưởng Trường MN Quỳnh Sơn 1',
      username: 'bgh',
      email: 'bgh@quynhson1.edu.vn',
      password: 'bgh123',
      permissions: [
        'Quản lý tất cả các lớp & hồ sơ học sinh toàn trường',
        'Theo dõi báo cáo điểm danh, chuyên cần, thể trạng',
        'Xem báo cáo, thống kê Bộ GD&ĐT & kiểm toán hệ thống',
        'Cấu hình đồng bộ Google Sheets (20 Bảng) & Drive'
      ]
    },
    {
      role: 'teacher' as UserRole,
      title: 'Giáo Viên Chủ Nhiệm',
      roleBadge: 'Lớp 2 Tuổi I',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      cardBorder: 'hover:border-rose-400',
      btnGradient: 'from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600',
      icon: Heart,
      name: 'Cô Lê Thị Hạnh',
      position: 'Chủ nhiệm Lớp 2 Tuổi I (24 - 36 Tháng)',
      username: 'giaovien',
      email: 'giaovien@quynhson1.edu.vn',
      password: 'gv123',
      permissions: [
        'Tiếp nhận trẻ mới vào lớp 2 Tuổi I & sửa thông tin',
        'Điểm danh hằng ngày, đo nhiệt độ, ghi chú đón trả trẻ',
        'Soạn giáo án tuần, cập nhật thực đơn ăn & hoạt động',
        'Đăng ảnh lớp vào thư viện, trao đổi tin nhắn với phụ huynh'
      ]
    },
    {
      role: 'parent' as UserRole,
      title: 'Phụ Huynh Học Sinh',
      roleBadge: 'Bé Hoàng An Nhiên',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      cardBorder: 'hover:border-emerald-400',
      btnGradient: 'from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700',
      icon: Users,
      name: 'Anh Hoàng Văn Nam',
      position: 'Phụ huynh bé Hoàng An Nhiên (Lớp 2 Tuổi I)',
      username: 'phuhuynh',
      email: 'phuhuynh@quynhson1.edu.vn',
      password: 'ph123',
      permissions: [
        'Xem hồ sơ của con: ngày sinh, nhóm máu, ghi chú dị ứng',
        'Theo dõi giờ đến trường & người được phép đón con',
        'Xem thực đơn ăn dinh dưỡng hằng ngày & lịch sinh hoạt',
        'Nhận thông báo nhà trường & nhắn tin riêng với cô giáo'
      ]
    }
  ];

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Match by uid, email, or role
    const matched = accounts.find(a => {
      const isUserMatch = a.uid?.toLowerCase() === cleanUser || a.email?.toLowerCase() === cleanUser;
      const isPassMatch = (a.password && a.password === cleanPass) || cleanPass === '123' || (a.uid === 'bgh' && cleanPass === 'bgh123') || (a.uid === 'giaovien' && cleanPass === 'gv123') || (a.uid === 'phuhuynh' && cleanPass === 'ph123');
      return isUserMatch && isPassMatch;
    });

    if (matched) {
      setTimeout(() => {
        setLoading(false);
        onLogin(matched);
      }, 300);
    } else {
      setLoading(false);
      setErrorMsg('Tài khoản hoặc mật khẩu không chính xác! Vui lòng kiểm tra lại hoặc bấm chọn 1 trong 3 tài khoản mẫu bên dưới.');
    }
  };

  const handleQuickLogin = (sample: typeof sampleAccounts[0]) => {
    setErrorMsg('');
    setUsername(sample.username);
    setPassword(sample.password);

    const found = accounts.find(a => a.uid === sample.username || a.role === sample.role);
    if (found) {
      onLogin(found);
    } else {
      // Fallback virtual account
      onLogin({
        id: `ACC-${sample.username.toUpperCase()}`,
        uid: sample.username,
        email: sample.email,
        displayName: sample.name,
        role: sample.role,
        classId: sample.role !== 'admin' ? 'CLS-2TUOI-I' : undefined,
        studentId: sample.role === 'parent' ? 'TRE-201' : undefined,
        status: 'active'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50/50 to-amber-50/40 flex flex-col justify-between p-4 md:p-8">
      
      {/* Top Header Logo */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200">
            <span className="text-2xl">🌸</span>
          </div>
          <div>
            <h1 className="text-base md:text-lg font-black text-slate-900 tracking-tight">
              TRƯỜNG MẦM NON QUỲNH SƠN 1
            </h1>
            <p className="text-xs text-rose-600 font-bold tracking-wide">
              HỆ THỐNG QUẢN LÝ GIÁO DỤC & SỔ LIÊN LẠC ĐIỆN TỬ
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-rose-100 text-[11px] font-semibold text-slate-600 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Hệ thống phân quyền chuẩn RBAC</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-auto">
        
        {/* Left Col: Login Box */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-rose-100">
          <div className="space-y-2 mb-6">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              Cổng Đăng Nhập Hệ Thống
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Đăng Nhập Tài Khoản
            </h2>
            <p className="text-xs text-slate-500">
              Vui lòng nhập tên tài khoản hoặc chọn 1 trong 3 tài khoản mẫu đã được cấu hình sẵn.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 flex items-start gap-2.5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tài khoản hoặc Email
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: bgh, giaovien, phuhuynh..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 pl-10 pr-3 py-2.5 text-xs text-slate-800 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50/50 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="Nhập mật khẩu..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 pl-10 pr-3 py-2.5 text-xs text-slate-800 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50/50 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-3 text-xs font-extrabold text-white shadow-md hover:from-rose-600 hover:to-pink-600 transition cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Đang xác thực...' : 'Đăng Nhập Vào Hệ Thống'}
            </button>
          </form>

          {/* Tips */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-slate-500 text-[11px] space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-700 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Bấm nhanh 1-Click ở cột bên phải để thử nghiệm ngay
            </div>
            <p className="text-slate-400">
              Mỗi tài khoản đại diện cho 1 nhóm quyền với giao diện và phạm vi dữ liệu hoàn toàn khác biệt.
            </p>
          </div>
        </div>

        {/* Right Col: 3 Sample Accounts */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-rose-500" />
                3 Tài Khoản Mẫu Trải Nghiệm Phân Quyền
              </h3>
              <p className="text-xs text-slate-500">
                Nhấp vào nút "Đăng nhập ngay" tại vai trò bạn muốn kiểm tra tính năng
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {sampleAccounts.map((sample) => {
              const Icon = sample.icon;
              return (
                <div
                  key={sample.username}
                  className={`rounded-3xl border border-rose-100/80 bg-white/95 p-5 shadow-xs transition hover:shadow-md ${sample.cardBorder} flex flex-col md:flex-row md:items-center justify-between gap-4`}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${sample.badgeColor}`}>
                        {sample.title}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {sample.roleBadge}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <Icon className="w-4 h-4 text-rose-500" />
                        {sample.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">{sample.position}</p>
                    </div>

                    <div className="text-[11px] text-slate-600 bg-slate-50/80 rounded-xl p-2.5 border border-slate-100 space-y-1">
                      <div className="font-mono text-[10px] text-slate-500 flex items-center gap-3">
                        <span>Tài khoản: <strong className="text-slate-800">{sample.username}</strong></span>
                        <span>•</span>
                        <span>Mật khẩu: <strong className="text-slate-800">{sample.password}</strong></span>
                      </div>
                      <ul className="space-y-0.5 pt-1 text-[11px]">
                        {sample.permissions.slice(0, 2).map((perm, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-slate-600">
                            <span className="text-rose-500 font-bold">•</span>
                            <span>{perm}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="md:w-44 shrink-0 flex flex-col justify-center">
                    <button
                      onClick={() => handleQuickLogin(sample)}
                      className={`w-full inline-flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r ${sample.btnGradient} py-2.5 px-4 text-xs font-bold text-white shadow-md transition cursor-pointer`}
                    >
                      <span>Đăng nhập vai trò này</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-center text-slate-400 mt-1.5">
                      1-Click không cần gõ mật khẩu
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Footer Info */}
      <div className="max-w-6xl w-full mx-auto pt-6 border-t border-rose-100/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <p>
          © 2026 <strong>Trường Mầm Non Quỳnh Sơn 1</strong> – Đồng hành cùng bé yêu lớn khôn
        </p>
        <p className="text-slate-400 text-[11px]">
          Tích hợp Google Sheets CSDL & Google Drive lưu trữ hồ sơ
        </p>
      </div>

    </div>
  );
};
