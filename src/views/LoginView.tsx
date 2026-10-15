import React, { useState } from 'react';
import { UserAccount } from '../types';
import {
  ShieldCheck,
  Lock,
  User,
  LogIn,
  Heart,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  KeyRound
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

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const cleanUser = username.trim().toLowerCase().replace(/\s+/g, '');
    const cleanPass = password.trim();

    // Match by uid or email
    const matched = accounts.find(a => {
      const u = (a.uid || '').toLowerCase().replace(/\s+/g, '');
      const e = (a.email || '').toLowerCase().replace(/\s+/g, '');
      const isUserMatch = u === cleanUser || e === cleanUser;
      
      // Default passwords accepted: user's configured pass, '123456', or '123'
      const isPassMatch = 
        cleanPass === '123456' || 
        cleanPass === '123' || 
        (a.password && a.password === cleanPass);

      return isUserMatch && isPassMatch;
    });

    if (matched) {
      setTimeout(() => {
        setLoading(false);
        onLogin(matched);
      }, 300);
    } else {
      setLoading(false);
      setErrorMsg('Tên đăng nhập hoặc mật khẩu không chính xác! Vui lòng kiểm tra lại (Mật khẩu mặc định: 123456).');
    }
  };

  // Quick 1-click test login for Teacher (Cô Hồ Thị Hạnh)
  const handleTeacherQuickLogin = () => {
    setErrorMsg('');
    const teacher = accounts.find(a => a.role === 'teacher' || a.uid === 'hothihanh');
    if (teacher) {
      onLogin(teacher);
    } else {
      onLogin({
        id: 'ACC-TEACHER',
        uid: 'hothihanh',
        email: 'hothihanh@quynhson1.edu.vn',
        displayName: 'Cô Hồ Thị Hạnh',
        role: 'teacher',
        classId: 'CLS-2TUOI-I',
        status: 'active'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50/50 to-amber-50/40 flex flex-col justify-between p-4 md:p-8">
      
      {/* Top Header Logo */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200">
            <span className="text-2xl">🌸</span>
          </div>
          <div>
            <h1 className="text-base md:text-xl font-black text-slate-900 tracking-tight">
              APP QUẢN LÝ LỚP 2 TUỔI I MNQS1
            </h1>
            <p className="text-xs text-rose-600 font-bold tracking-wide">
              TRƯỜNG MẦM NON QUỲNH SƠN 1 • GIÁO VIÊN: CÔ HỒ THỊ HẠNH
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-rose-100 text-[11px] font-semibold text-slate-600 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Hệ thống phân quyền Giáo viên & Phụ huynh</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center my-auto">
        
        {/* Left Column: Login Form */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-rose-100">
          <div className="space-y-2 mb-6">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              Cổng Đăng Nhập Hệ Thống
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Đăng Nhập Tài Khoản
            </h2>
            <p className="text-xs text-slate-500">
              Dành cho Giáo viên và Phụ huynh học sinh Lớp 2 Tuổi I
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
                Tên đăng nhập
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Nhập tên đăng nhập của bạn..."
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
                  placeholder="Mật khẩu mặc định: 123456"
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

          {/* Quick Notice */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-start gap-2">
            <KeyRound className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>
              Mật khẩu khởi tạo chung cho tất cả các tài khoản là <strong>123456</strong>.
            </span>
          </div>
        </div>

        {/* Right Column: Single Demo Teacher Account + Parent Guide */}
        <div className="md:col-span-5 space-y-4">
          
          {/* Quick Demo Card for Teacher */}
          <div className="rounded-3xl border-2 border-rose-300 bg-gradient-to-br from-rose-500 to-pink-600 p-6 text-white shadow-lg shadow-rose-200">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white border border-white/30">
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  Tài khoản dùng thử
                </span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">
                  Giáo viên
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-white">
                  Cô Hồ Thị Hạnh
                </h3>
                <p className="text-xs text-rose-100">
                  Chủ nhiệm Lớp 2 Tuổi I • Toàn quyền quản trị lớp
                </p>
              </div>

              <p className="text-xs text-rose-50/90 leading-relaxed">
                Nhấp nút bên dưới để đăng nhập ngay vào giao diện Giáo viên và trải nghiệm toàn bộ tính năng quản lý lớp, điểm danh, xin phép nghỉ và sổ liên lạc.
              </p>

              <button
                type="button"
                onClick={handleTeacherQuickLogin}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-rose-600 hover:bg-rose-50 py-3 px-4 text-xs font-black shadow-md transition cursor-pointer mt-2"
              >
                <span>Đăng nhập thử vai trò Giáo viên</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Guide Note for Parents */}
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-slate-800 font-extrabold text-xs">
              <HelpCircle className="w-4 h-4 text-emerald-500" />
              <span>Dành cho Phụ huynh học sinh</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Phụ huynh đăng nhập bằng <strong>tên học sinh viết liền không dấu</strong> (ví dụ: <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">luongduckhanh</code>, <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">lethuytrang</code>...) và mật khẩu <strong>123456</strong>.
            </p>
            <div className="text-[11px] text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Vào app để xem ảnh, theo dõi bữa ăn và tích xin phép nghỉ học cho bé hôm nay.</span>
            </div>
          </div>

        </div>

      </div>

      {/* Footer Info */}
      <div className="max-w-5xl w-full mx-auto pt-6 border-t border-rose-100/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <p>
          © 2026 <strong>Trường Mầm Non Quỳnh Sơn 1</strong> – Lớp 2 Tuổi I (Cô Hồ Thị Hạnh)
        </p>
        <p className="text-slate-400 text-[11px]">
          Tự động đồng bộ Google Sheets CSDL & Google Drive
        </p>
      </div>

    </div>
  );
};
