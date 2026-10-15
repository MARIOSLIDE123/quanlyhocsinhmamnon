import React, { useState } from 'react';
import { Student, Classroom, Guardian } from '../types';
import { StudentAvatarBadge, getStudentInitials } from '../components/StudentAvatarBadge';
import {
  Users,
  Search,
  Filter,
  Plus,
  Phone,
  ShieldCheck,
  Heart,
  AlertCircle,
  Edit2,
  Trash2,
  X,
  Eye,
  Calendar,
  CheckCircle,
  MapPin,
  Sparkles
} from 'lucide-react';

interface Props {
  students: Student[];
  classes: Classroom[];
  currentClass: Classroom;
  onAddStudent: (student: Partial<Student>) => Promise<void>;
  onUpdateStudent: (id: string, student: Partial<Student>) => Promise<void>;
  onDeleteStudent: (id: string) => Promise<void>;
}

export const StudentsView: React.FC<Props> = ({
  students,
  classes,
  currentClass,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>(currentClass.id);
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('active');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState<Partial<Student>>({
    fullName: '',
    nickname: '',
    dateOfBirth: '2021-01-01',
    gender: 'Nam',
    classId: currentClass.id,
    admissionDate: new Date().toISOString().split('T')[0],
    healthNotes: '',
    allergies: [],
    bloodGroup: 'O',
    address: '',
    guardians: [
      {
        id: 'GD-1',
        fullName: '',
        phone: '',
        relationship: 'Bố',
        occupation: '',
        isPrimaryContact: true,
        canPickup: true
      }
    ]
  });

  const [allergyInput, setAllergyInput] = useState('');

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchClass = selectedClassFilter === 'all' || s.classId === selectedClassFilter;
    const matchSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.nickname && s.nickname.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchGender = genderFilter === 'all' || s.gender === genderFilter;
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchClass && matchSearch && matchGender && matchStatus;
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      fullName: '',
      nickname: '',
      dateOfBirth: '2021-05-15',
      gender: 'Nam',
      classId: currentClass.id,
      admissionDate: new Date().toISOString().split('T')[0],
      healthNotes: '',
      allergies: [],
      bloodGroup: 'O',
      address: '',
      guardians: [
        {
          id: 'GD-' + Date.now(),
          fullName: '',
          phone: '',
          relationship: 'Bố',
          occupation: '',
          isPrimaryContact: true,
          canPickup: true
        }
      ]
    });
    setAllergyInput('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      ...student,
      guardians: student.guardians && student.guardians.length > 0 ? student.guardians : [
        {
          id: 'GD-' + Date.now(),
          fullName: '',
          phone: '',
          relationship: 'Bố',
          occupation: '',
          isPrimaryContact: true,
          canPickup: true
        }
      ]
    });
    setAllergyInput((student.allergies || []).join(', '));
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName?.trim()) {
      alert('Vui lòng nhập họ và tên của trẻ');
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedAllergies = allergyInput
        .split(',')
        .map(a => a.trim())
        .filter(Boolean);

      const initials = (formData.avatarInitials?.trim() || getStudentInitials(formData.fullName || '')).toUpperCase();
      const payload = {
        ...formData,
        avatarInitials: initials,
        avatarColor: formData.avatarColor || 'rose',
        allergies: parsedAllergies
      };

      if (editingStudent) {
        await onUpdateStudent(editingStudent.id, payload);
      } else {
        await onAddStudent(payload);
      }
      setIsFormOpen(false);
    } catch (err: any) {
      alert('Có lỗi xảy ra: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (student: Student) => {
    if (confirm(`Bạn có chắc chắn muốn chuyển trạng thái nghỉ học cho bé "${student.fullName}"?`)) {
      try {
        await onDeleteStudent(student.id);
      } catch (err: any) {
        alert('Lỗi: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-rose-500" />
            Hồ Sơ Học Sinh Mầm Non
          </h2>
          <p className="text-xs text-slate-500">
            Quản lý danh sách trẻ, người giám hộ, quyền đưa đón và lưu ý sức khỏe
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:from-rose-600 hover:to-pink-600 transition cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Tiếp nhận trẻ mới
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl border border-rose-100 bg-white p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, mã bé, nickname..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
            />
          </div>

          {/* Class Filter */}
          <div>
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-rose-400 focus:outline-none"
            >
              <option value="all">Tất cả các lớp trong trường</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Gender Filter */}
          <div>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-rose-400 focus:outline-none"
            >
              <option value="all">Tất cả giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-rose-400 focus:outline-none"
            >
              <option value="active">Đang theo học</option>
              <option value="leave">Đã nghỉ học</option>
              <option value="all">Tất cả trạng thái</option>
            </select>
          </div>

        </div>
      </div>

      {/* Students Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student) => {
          const primaryGuardian = student.guardians?.find(g => g.isPrimaryContact) || student.guardians?.[0];

          return (
            <div
              key={student.id}
              className="group rounded-3xl border border-rose-100/80 bg-white p-5 shadow-xs transition hover:shadow-md hover:border-rose-200 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Top Row: Avatar, Code, Status */}
                <div className="flex items-start gap-3.5">
                  <StudentAvatarBadge
                    name={student.fullName}
                    initials={student.avatarInitials}
                    colorName={student.avatarColor}
                    size="lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                        {student.studentCode}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        student.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {student.status === 'active' ? 'Đang học' : 'Nghỉ học'}
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-slate-800 mt-1 truncate">
                      {student.fullName}
                      {student.nickname && (
                        <span className="text-xs font-normal text-rose-500 ml-1">
                          ({student.nickname})
                        </span>
                      )}
                    </h3>

                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{student.gender}</span>
                      <span>•</span>
                      <span>Sinh: {new Date(student.dateOfBirth).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>

                {/* Class & Health Notes */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                  <div className="text-slate-600 font-medium">
                    🏫 Lớp: <span className="text-slate-800 font-semibold">{student.className || currentClass.name}</span>
                  </div>
                  {student.allergies && student.allergies.length > 0 && (
                    <div className="rounded-xl bg-amber-50 p-2 text-[11px] text-amber-900 border border-amber-100">
                      ⚠️ <strong>Dị ứng:</strong> {student.allergies.join(', ')}
                    </div>
                  )}
                  {student.healthNotes && (
                    <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                      "{student.healthNotes}"
                    </p>
                  )}
                </div>

                {/* Primary Guardian Contact */}
                {primaryGuardian && (
                  <div className="rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">
                        {primaryGuardian.relationship}: {primaryGuardian.fullName}
                      </span>
                      {primaryGuardian.canPickup && (
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/80 px-1.5 py-0.2 rounded">
                          Được đón
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                      <Phone className="w-3 h-3 text-rose-400" />
                      <span>{primaryGuardian.phone}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setViewingStudent(student)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-50 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Chi tiết
                </button>
                <button
                  onClick={() => handleOpenEdit(student)}
                  className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  title="Chỉnh sửa hồ sơ"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(student)}
                  className="p-1.5 rounded-xl border border-slate-200 text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                  title="Chuyển trạng thái nghỉ học"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <div className="rounded-3xl border border-dashed border-rose-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
            <Users className="h-7 w-7" />
          </div>
          <h3 className="mt-3 text-sm font-bold text-slate-800">Không tìm thấy hồ sơ học sinh</h3>
          <p className="mt-1 text-xs text-slate-500">
            Hãy thử thay đổi từ khóa tìm kiếm hoặc bấm nút "Tiếp nhận trẻ mới" để thêm bé vào danh sách.
          </p>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-rose-100 p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-rose-500" />
                {editingStudent ? 'Cập Nhật Hồ Sơ Trẻ' : 'Tiếp Nhận Trẻ Mới Vào Lớp'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Row 1: Full name & Nickname */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên trẻ *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Trần Bảo Nam"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tên thường gọi ở nhà (Nickname)</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Bắp, Tin Tin, Dâu Tây"
                    value={formData.nickname || ''}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 2: DOB, Gender, Class */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ngày sinh *</label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Giới tính</label>
                  <select
                    value={formData.gender}
                    onChange={(e: any) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-400 focus:outline-none"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Xếp vào lớp</label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-400 focus:outline-none"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Địa chỉ thường trú</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Thôn Quỳnh Sơn, Xã Quỳnh Sơn, Yên Dũng, Bắc Giang..."
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-rose-400 focus:outline-none"
                />
              </div>

              {/* Avatar as Initials Section */}
              <div className="rounded-2xl bg-gradient-to-r from-rose-50/70 via-pink-50/40 to-amber-50/40 p-4 border border-rose-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-rose-500" />
                    Ảnh đại diện chữ viết tắt (Initials Badge)
                  </h4>
                  <span className="text-[10px] font-bold text-rose-600 bg-white px-2 py-0.5 rounded-full border border-rose-200">
                    Tự động tạo từ tên trẻ
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3.5 rounded-xl border border-rose-100">
                  <StudentAvatarBadge
                    name={formData.fullName || 'Bé'}
                    initials={formData.avatarInitials || (formData.fullName ? getStudentInitials(formData.fullName) : 'BÉ')}
                    colorName={formData.avatarColor || 'rose'}
                    size="xl"
                  />
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div>
                      <span className="text-xs font-extrabold text-slate-800">
                        Chữ viết tắt hiển thị: <strong className="text-rose-600 font-mono text-sm">{formData.avatarInitials || (formData.fullName ? getStudentInitials(formData.fullName) : 'BÉ')}</strong>
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Ảnh đại diện thay bằng chữ viết tắt giúp nhận diện nhanh, tối ưu tốc độ và bảo vệ tối đa hình ảnh riêng tư của trẻ.
                      </p>
                    </div>

                    {/* Color selection pills */}
                    <div className="flex items-center gap-2 justify-center sm:justify-start pt-1">
                      <span className="text-[11px] font-semibold text-slate-600">Tông màu:</span>
                      {[
                        { id: 'rose', label: 'Hồng', color: 'bg-rose-500' },
                        { id: 'sky', label: 'Xanh dương', color: 'bg-sky-500' },
                        { id: 'emerald', label: 'Xanh ngọc', color: 'bg-emerald-500' },
                        { id: 'amber', label: 'Cam đào', color: 'bg-amber-500' },
                        { id: 'indigo', label: 'Chàm', color: 'bg-indigo-500' },
                        { id: 'violet', label: 'Tím', color: 'bg-violet-500' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, avatarColor: item.id })}
                          className={`h-5 w-5 rounded-full ${item.color} transition cursor-pointer transform ${
                            (formData.avatarColor || 'rose') === item.id ? 'ring-2 ring-offset-2 ring-rose-500 scale-110' : 'opacity-70 hover:opacity-100'
                          }`}
                          title={`Chọn màu ${item.label}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Notes & Allergies */}
              <div className="rounded-2xl bg-amber-50/60 p-4 border border-amber-100 space-y-3">
                <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-amber-600" />
                  Ghi chú sức khỏe & Dị ứng thực phẩm
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Các chất / món dị ứng (cách nhau dấu phẩy)
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Đậu phộng, Tôm, Sữa bò tươi..."
                      value={allergyInput}
                      onChange={(e) => setAllergyInput(e.target.value)}
                      className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Lưu ý chăm sóc sức khỏe
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Dễ ho khi nằm máy lạnh, uống nhiều nước..."
                      value={formData.healthNotes || ''}
                      onChange={(e) => setFormData({ ...formData, healthNotes: e.target.value })}
                      className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Primary Guardian Section */}
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-rose-500" />
                  Thông tin người giám hộ chính (Đưa đón & liên lạc)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Quan hệ với trẻ</label>
                    <select
                      value={formData.guardians?.[0]?.relationship || 'Bố'}
                      onChange={(e: any) => {
                        const updated = [...(formData.guardians || [])];
                        updated[0] = { ...updated[0], relationship: e.target.value };
                        setFormData({ ...formData, guardians: updated });
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none"
                    >
                      <option value="Bố">Bố</option>
                      <option value="Mẹ">Mẹ</option>
                      <option value="Ông">Ông</option>
                      <option value="Bà">Bà</option>
                      <option value="Người giám hộ">Người giám hộ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Họ tên phụ huynh</label>
                    <input
                      type="text"
                      required
                      placeholder="Họ tên người giám hộ"
                      value={formData.guardians?.[0]?.fullName || ''}
                      onChange={(e) => {
                        const updated = [...(formData.guardians || [])];
                        updated[0] = { ...updated[0], fullName: e.target.value };
                        setFormData({ ...formData, guardians: updated });
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Số điện thoại liên hệ</label>
                    <input
                      type="tel"
                      required
                      placeholder="09xx xxx xxx"
                      value={formData.guardians?.[0]?.phone || ''}
                      onChange={(e) => {
                        const updated = [...(formData.guardians || [])];
                        updated[0] = { ...updated[0], phone: e.target.value };
                        setFormData({ ...formData, guardians: updated });
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-2 text-xs font-bold text-white shadow-md hover:from-rose-600 hover:to-pink-600 transition cursor-pointer"
                >
                  {isSubmitting ? 'Đang lưu...' : editingStudent ? 'Lưu thay đổi' : 'Tạo hồ sơ trẻ'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-rose-100 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-rose-500" />
                Hồ Sơ Chi Tiết Học Sinh
              </h3>
              <button
                onClick={() => setViewingStudent(null)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <StudentAvatarBadge
                  name={viewingStudent.fullName}
                  initials={viewingStudent.avatarInitials}
                  colorName={viewingStudent.avatarColor}
                  size="xl"
                />
                <div>
                  <span className="font-mono text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    {viewingStudent.studentCode}
                  </span>
                  <h2 className="text-lg font-black text-slate-900 mt-1">
                    {viewingStudent.fullName}
                    {viewingStudent.nickname && (
                      <span className="text-sm font-normal text-rose-500 ml-1.5">
                        ({viewingStudent.nickname})
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Lớp: <strong>{viewingStudent.className || currentClass.name}</strong> • Giới tính: <strong>{viewingStudent.gender}</strong>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400">Ngày sinh:</span>
                  <p className="font-bold text-slate-800 mt-0.5">
                    {new Date(viewingStudent.dateOfBirth).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Ngày nhập học:</span>
                  <p className="font-bold text-slate-800 mt-0.5">
                    {new Date(viewingStudent.admissionDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Nhóm máu:</span>
                  <p className="font-bold text-slate-800 mt-0.5">{viewingStudent.bloodGroup || 'Chưa rõ'}</p>
                </div>
                <div>
                  <span className="text-slate-400">Trạng thái:</span>
                  <p className="font-bold text-emerald-600 mt-0.5">
                    {viewingStudent.status === 'active' ? 'Đang học' : 'Nghỉ học'}
                  </p>
                </div>
              </div>

              {/* Guardians List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Người giám hộ & Đưa đón</h4>
                {viewingStudent.guardians?.map((g, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 text-xs">
                    <div>
                      <div className="font-bold text-slate-800">{g.relationship}: {g.fullName}</div>
                      <div className="text-slate-500 font-mono text-[11px]">{g.phone}</div>
                    </div>
                    {g.canPickup && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Được phép đón trẻ
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Health and Allergies */}
              {viewingStudent.allergies && viewingStudent.allergies.length > 0 && (
                <div className="rounded-2xl bg-amber-50 p-3.5 border border-amber-200 text-xs text-amber-900">
                  <strong>⚠️ Dị ứng:</strong> {viewingStudent.allergies.join(', ')}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setViewingStudent(null)}
                className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-bold text-white hover:bg-slate-900 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
