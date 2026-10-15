import React, { useState } from 'react';
import { DriveMediaItem, Classroom } from '../types';
import {
  Image as ImageIcon,
  Video,
  Upload,
  Calendar,
  Filter,
  Eye,
  ExternalLink,
  X,
  FileSpreadsheet,
  FolderGit2
} from 'lucide-react';

interface Props {
  mediaFiles: DriveMediaItem[];
  currentClass: Classroom;
  onUploadMedia: (data: any) => Promise<void>;
}

export const GalleryView: React.FC<Props> = ({
  mediaFiles,
  currentClass,
  onUploadMedia
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewMedia, setPreviewMedia] = useState<DriveMediaItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Upload Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DriveMediaItem['category']>('03_HINH_ANH_HOAT_DONG');
  const [categoryLabel, setCategoryLabel] = useState('Ảnh hoạt động của trẻ');
  const [imgUrl, setImgUrl] = useState('');

  const filteredMedia = mediaFiles.filter(m => {
    return selectedCategory === 'all' || m.category === selectedCategory;
  });

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề cho hình ảnh/tài liệu');
      return;
    }

    setIsSubmitting(true);
    try {
      await onUploadMedia({
        title,
        category,
        categoryLabel,
        classId: currentClass.id,
        webViewLink: imgUrl || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
        thumbnailLink: imgUrl || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=200&auto=format&fit=crop&q=80',
        uploadedBy: currentClass.teacherName || 'Giáo viên'
      });
      setIsUploadOpen(false);
      setTitle('');
      setImgUrl('');
    } catch (err: any) {
      alert('Lỗi tải tệp: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-pink-500" />
            Thư Viện Kho Ảnh, Video & Học Liệu Google Drive
          </h2>
          <p className="text-xs text-slate-500">
            Lưu trữ trên thư mục <code>KHO_DU_LIEU_QUAN_LY_MAM_NON</code> • Quản lý metadata trong bảng <code>TEP_TIN</code>
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:from-pink-600 hover:to-rose-600 transition cursor-pointer self-start md:self-auto"
        >
          <Upload className="w-4 h-4" />
          Tải ảnh hoạt động lên Drive
        </button>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'Tất cả tài liệu' },
          { key: '03_HINH_ANH_HOAT_DONG', label: '📸 Ảnh hoạt động của bé' },
          { key: '04_VIDEO_HOAT_DONG', label: '🎥 Video văn nghệ & thể dục' },
          { key: '02_GIAO_AN_KE_HOACH', label: '📄 Giáo án & Kế hoạch' },
          { key: '05_TAI_LIEU_HOC_LIEU', label: '📚 Học liệu điện tử' }
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              selectedCategory === cat.key
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMedia.map((media) => (
          <div
            key={media.id}
            className="group rounded-3xl border border-rose-100 bg-white overflow-hidden shadow-xs hover:shadow-lg transition flex flex-col justify-between"
          >
            <div>
              {/* Media Preview Box */}
              <div className="relative aspect-video bg-slate-100 overflow-hidden cursor-pointer" onClick={() => setPreviewMedia(media)}>
                <img
                  src={media.webViewLink}
                  alt={media.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                  <Eye className="w-6 h-6" />
                </div>
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                  {media.categoryLabel}
                </span>
              </div>

              {/* Content info */}
              <div className="p-4 space-y-1.5">
                <h3 className="font-extrabold text-slate-800 text-xs line-clamp-1">{media.title}</h3>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{new Date(media.activityDate || media.uploadedAt).toLocaleDateString('vi-VN')}</span>
                  <span>{media.uploadedBy}</span>
                </div>
              </div>
            </div>

            {/* Drive Metadata Bar */}
            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span className="truncate max-w-[140px]">{media.fileName}</span>
              <a
                href={media.webViewLink}
                target="_blank"
                rel="noreferrer"
                className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 font-sans"
              >
                Mở link <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>
        ))}
      </div>

      {/* LIGHTBOX PREVIEW MODAL */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 bg-slate-950/80 text-white">
              <span className="text-xs font-bold">{previewMedia.title}</span>
              <button
                onClick={() => setPreviewMedia(null)}
                className="rounded-full p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 flex items-center justify-center max-h-[70vh] bg-black">
              <img
                src={previewMedia.webViewLink}
                alt={previewMedia.title}
                className="max-h-[65vh] object-contain rounded-xl"
              />
            </div>
            <div className="p-4 text-xs text-slate-300 flex items-center justify-between">
              <span>Được lưu trên Google Drive: <code>{previewMedia.fileName}</code></span>
              <a
                href={previewMedia.webViewLink}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-1.5 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600"
              >
                Xem ảnh gốc
              </a>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD MEDIA MODAL */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl border border-pink-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Tải Ảnh Lên Google Drive</h3>
              <button onClick={() => setIsUploadOpen(false)} className="rounded-full p-1.5 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề ảnh / hoạt động *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Giờ vui chơi tô màu của các bé lớp Chồi 1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Thư mục Drive phân loại</label>
                <select
                  value={category}
                  onChange={(e: any) => {
                    setCategory(e.target.value);
                    const label = {
                      '03_HINH_ANH_HOAT_DONG': 'Ảnh hoạt động của trẻ',
                      '04_VIDEO_HOAT_DONG': 'Video hoạt động trong lớp',
                      '02_GIAO_AN_KE_HOACH': 'Giáo án và kế hoạch',
                      '05_TAI_LIEU_HOC_LIEU': 'Học liệu điện tử'
                    }[e.target.value as string] || 'Tài liệu khác';
                    setCategoryLabel(label);
                  }}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2"
                >
                  <option value="03_HINH_ANH_HOAT_DONG">03_HINH_ANH_HOAT_DONG (Ảnh hoạt động)</option>
                  <option value="04_VIDEO_HOAT_DONG">04_VIDEO_HOAT_DONG (Video hoạt động)</option>
                  <option value="02_GIAO_AN_KE_HOACH">02_GIAO_AN_KE_HOACH (Giáo án)</option>
                  <option value="05_TAI_LIEU_HOC_LIEU">05_TAI_LIEU_HOC_LIEU (Học liệu)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Đường dẫn hình ảnh (URL)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imgUrl}
                  onChange={(e) => setImgUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-pink-500 text-white font-bold hover:bg-pink-600 shadow-xs"
                >
                  {isSubmitting ? 'Đang tải lên...' : 'Lưu vào Thư viện'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
