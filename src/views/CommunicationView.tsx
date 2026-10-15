import React, { useState } from 'react';
import { Announcement, ParentCommunication, Classroom, UserAccount, UserRole, Student } from '../types';
import {
  Bell,
  MessageCircle,
  Plus,
  Send,
  Eye,
  CheckCheck,
  AlertTriangle,
  Pin,
  Calendar,
  X
} from 'lucide-react';

interface Props {
  announcements: Announcement[];
  messages: ParentCommunication[];
  currentClass: Classroom;
  currentUser: UserAccount;
  currentRole: UserRole;
  students: Student[];
  onAddAnnouncement: (announcement: Partial<Announcement>) => Promise<void>;
  onMarkRead: (id: string) => Promise<void>;
  onSendMessage: (msg: Partial<ParentCommunication>) => Promise<void>;
}

export const CommunicationView: React.FC<Props> = ({
  announcements,
  messages,
  currentClass,
  currentUser,
  currentRole,
  students,
  onAddAnnouncement,
  onMarkRead,
  onSendMessage
}) => {
  const [activeTab, setActiveTab] = useState<'announcements' | 'messages'>('announcements');
  const [isAnnounceModalOpen, setIsAnnounceModalOpen] = useState(false);

  // Announcement Form State
  const [annForm, setAnnForm] = useState<{
    title: string;
    content: string;
    type: Announcement['type'];
    targetType: Announcement['targetType'];
    isPinned: boolean;
  }>({
    title: '',
    content: '',
    type: 'general',
    targetType: 'all',
    isPinned: false
  });

  // Message Input State
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'TRE-001');
  const [messageText, setMessageText] = useState('');

  const classStudents = students.filter(s => s.classId === currentClass.id && s.status === 'active');
  const selectedStudent = students.find(s => s.id === selectedStudentId);

  // Filter messages for current thread
  const threadMessages = messages.filter(m => m.studentId === selectedStudentId);

  const handleAnnounceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annForm.title.trim() || !annForm.content.trim()) {
      alert('Vui lòng điền đủ tiêu đề và nội dung');
      return;
    }

    try {
      await onAddAnnouncement({
        ...annForm,
        targetClassId: currentClass.id,
        targetClassName: currentClass.name,
        authorName: currentUser.displayName,
        authorRole: currentRole === 'admin' ? 'Ban Giám Hiệu' : 'Giáo viên chủ nhiệm'
      });
      setIsAnnounceModalOpen(false);
      setAnnForm({
        title: '',
        content: '',
        type: 'general',
        targetType: 'all',
        isPinned: false
      });
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    try {
      await onSendMessage({
        studentId: selectedStudentId,
        studentName: selectedStudent?.fullName || 'Học sinh',
        classId: currentClass.id,
        senderId: currentUser.id,
        senderName: currentUser.displayName,
        senderRole: currentRole,
        recipientId: 'PARENT',
        content: messageText
      });
      setMessageText('');
    } catch (err: any) {
      alert('Lỗi gửi tin nhắn: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-rose-500" />
            Bảng Tin & Kênh Kết Nối Phụ Huynh
          </h2>
          <p className="text-xs text-slate-500">
            Thông báo nhà trường, lịch sinh hoạt và trao đổi riêng tư hai chiều giữa cô giáo và phụ huynh
          </p>
        </div>

        {currentRole !== 'parent' && (
          <button
            onClick={() => setIsAnnounceModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:from-rose-600 hover:to-pink-600 transition cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Tạo thông báo mới
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition cursor-pointer px-4 ${
            activeTab === 'announcements'
              ? 'border-rose-500 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="w-4 h-4" />
          Thông báo lớp & trường ({announcements.length})
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition cursor-pointer px-4 ${
            activeTab === 'messages'
              ? 'border-rose-500 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Trao đổi riêng với phụ huynh
        </button>
      </div>

      {/* TAB 1: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          {announcements.map((anc) => (
            <div
              key={anc.id}
              className={`rounded-3xl border p-6 shadow-xs space-y-3 transition hover:shadow-md ${
                anc.isPinned ? 'border-amber-200 bg-amber-50/20' : 'border-slate-100 bg-white'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {anc.isPinned && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      <Pin className="w-3 h-3" /> Đã ghim
                    </span>
                  )}
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    anc.type === 'urgent' ? 'bg-rose-100 text-rose-700' :
                    anc.type === 'event' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {anc.type === 'urgent' ? '🚨 Khẩn cấp' : anc.type === 'event' ? '🎉 Sự kiện' : '📢 Thông báo'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(anc.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <strong>{anc.readCount}</strong>/{anc.totalTarget} phụ huynh đã đọc
                  </span>
                </div>
              </div>

              <h3 className="text-base font-black text-slate-900">{anc.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{anc.content}</p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Người đăng: <strong>{anc.authorName}</strong> ({anc.authorRole})</span>
                <button
                  onClick={() => onMarkRead(anc.id)}
                  className="font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                >
                  Đánh dấu đã đọc
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: 1-ON-1 MESSAGING */}
      {activeTab === 'messages' && (
        <div className="rounded-3xl border border-rose-100 bg-white overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-3 min-h-[480px]">
          
          {/* Student Selector Sidebar */}
          <div className="border-r border-slate-100 bg-slate-50/50 p-4 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Danh sách bé ({classStudents.length})
            </span>
            <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
              {classStudents.map((student) => {
                const isSelected = student.id === selectedStudentId;
                const studentMsgCount = messages.filter(m => m.studentId === student.id).length;

                return (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudentId(student.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition cursor-pointer ${
                      isSelected ? 'bg-rose-500 text-white shadow-xs' : 'hover:bg-rose-50/60 bg-white border border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={student.avatarUrl || 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80'}
                        alt={student.fullName}
                        className="h-8 w-8 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                          {student.fullName}
                        </div>
                        <div className={`text-[10px] truncate ${isSelected ? 'text-rose-100' : 'text-slate-400'}`}>
                          Phụ huynh bé {student.nickname || ''}
                        </div>
                      </div>
                    </div>
                    {studentMsgCount > 0 && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isSelected ? 'bg-white text-rose-600' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {studentMsgCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Messages Panel */}
          <div className="md:col-span-2 flex flex-col justify-between bg-white">
            
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-rose-50/20">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">💬</span>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-xs">
                    Kênh trao đổi: Bé {selectedStudent?.fullName}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Phụ huynh: {selectedStudent?.guardians?.[0]?.fullName} ({selectedStudent?.guardians?.[0]?.phone})
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[340px]">
              {threadMessages.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Chưa có tin nhắn nào. Hãy gửi lời chào hoặc nhắn tin tình hình hôm nay của bé tới phụ huynh!
                </div>
              ) : (
                threadMessages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl p-3 text-xs shadow-2xs ${
                        isMe
                          ? 'bg-rose-500 text-white rounded-br-xs'
                          : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                      }`}>
                        <div className={`text-[10px] font-bold mb-1 ${isMe ? 'text-rose-100' : 'text-slate-500'}`}>
                          {msg.senderName}
                        </div>
                        <p className="leading-relaxed">{msg.content}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 flex items-center gap-2 bg-slate-50/50">
              <input
                type="text"
                placeholder={`Nhắn tin cho phụ huynh bé ${selectedStudent?.fullName || ''}...`}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs focus:border-rose-400 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-rose-500 p-2 text-white hover:bg-rose-600 transition shadow-xs cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

        </div>
      )}

      {/* CREATE ANNOUNCEMENT MODAL */}
      {isAnnounceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-rose-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Đăng Thông Báo Mới</h3>
              <button onClick={() => setIsAnnounceModalOpen(false)} className="rounded-full p-1.5 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAnnounceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề thông báo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Kế hoạch dã ngoại & Lưu ý trang phục ngày mai"
                  value={annForm.title}
                  onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Loại thông báo</label>
                  <select
                    value={annForm.type}
                    onChange={(e: any) => setAnnForm({ ...annForm, type: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2"
                  >
                    <option value="general">Thông báo chung</option>
                    <option value="urgent">Khẩn cấp</option>
                    <option value="event">Sự kiện & Dã ngoại</option>
                    <option value="nutrition">Dinh dưỡng & Thực đơn</option>
                    <option value="fee">Học phí & Bán trú</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Đối tượng nhận</label>
                  <select
                    value={annForm.targetType}
                    onChange={(e: any) => setAnnForm({ ...annForm, targetType: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2"
                  >
                    <option value="all">Toàn trường</option>
                    <option value="class">Chỉ lớp {currentClass.name}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nội dung chi tiết *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Kính gửi Quý Phụ huynh..."
                  value={annForm.content}
                  onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pinNotice"
                  checked={annForm.isPinned}
                  onChange={(e) => setAnnForm({ ...annForm, isPinned: e.target.checked })}
                  className="rounded text-rose-500"
                />
                <label htmlFor="pinNotice" className="text-slate-700 font-medium">
                  Ghim thông báo này lên đầu bảng tin
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAnnounceModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600"
                >
                  Phát hành thông báo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
