import React, { useState } from 'react';
import { MealMenu, Classroom } from '../types';
import {
  Utensils,
  Plus,
  Edit2,
  AlertTriangle,
  Flame,
  Check,
  X,
  Calendar,
  Apple
} from 'lucide-react';

interface Props {
  mealMenus: MealMenu[];
  currentClass: Classroom;
  onSaveMeal: (meal: Partial<MealMenu>) => Promise<void>;
}

export const MealsView: React.FC<Props> = ({
  mealMenus,
  currentClass,
  onSaveMeal
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealMenu | null>(null);

  const [formData, setFormData] = useState<Partial<MealMenu>>({
    date: new Date().toISOString().split('T')[0],
    dayOfWeek: 'Hôm nay',
    mealType: 'lunch',
    mealTypeName: 'Bữa Trưa (11:15 - 11:50)',
    dishName: '',
    dishComponents: [],
    calorieKcal: 420,
    allergyNotice: '',
    notes: ''
  });

  const [componentsInput, setComponentsInput] = useState('');

  const mealTypeOptions = [
    { type: 'breakfast', name: 'Bữa Sáng (07:45 - 08:15)' },
    { type: 'snack_morning', name: 'Bữa Phụ Sáng (09:30)' },
    { type: 'lunch', name: 'Bữa Trưa (11:15 - 11:50)' },
    { type: 'snack_afternoon', name: 'Bữa Xế Chiều (14:30)' }
  ];

  const handleOpenAdd = () => {
    setEditingMeal(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      dayOfWeek: 'Hôm nay',
      mealType: 'lunch',
      mealTypeName: 'Bữa Trưa (11:15 - 11:50)',
      dishName: '',
      dishComponents: [],
      calorieKcal: 420,
      allergyNotice: '',
      notes: ''
    });
    setComponentsInput('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (meal: MealMenu) => {
    setEditingMeal(meal);
    setFormData(meal);
    setComponentsInput((meal.dishComponents || []).join('\n'));
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.dishName?.trim()) {
      alert('Vui lòng nhập tên món ăn');
      return;
    }

    try {
      const components = componentsInput
        .split('\n')
        .map(c => c.trim())
        .filter(Boolean);

      await onSaveMeal({
        ...formData,
        dishComponents: components,
        id: editingMeal?.id
      });

      setIsFormOpen(false);
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Utensils className="w-6 h-6 text-amber-500" />
            Thực Đơn Dinh Dưỡng Mầm Non
          </h2>
          <p className="text-xs text-slate-500">
            Chế độ ăn cân đối 4 nhóm chất, thực đơn chuẩn và cảnh báo dị ứng thực phẩm của trẻ
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:from-amber-600 hover:to-orange-600 transition cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Thêm món vào thực đơn
        </button>
      </div>

      {/* Class Allergy Notice Alert */}
      <div className="rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-amber-900">
              Lưu ý đặc biệt về dị ứng thực phẩm tại {currentClass.name}
            </h3>
            <p className="text-xs text-amber-800 mt-1">
              Bé Trần Bảo Nam dị ứng tôm và đậu phộng. Bé Phạm Minh Khôi không uống sữa bò tươi (nhà trường đã thay thế bằng sữa chua hạt đậu nành). Nhà bếp luôn kiểm tra kỹ khay ăn riêng trước khi chuyển lên lớp.
            </p>
          </div>
        </div>
      </div>

      {/* Meal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mealMenus.map((meal) => (
          <div
            key={meal.id}
            className="rounded-3xl border border-amber-100 bg-white p-5 shadow-xs transition hover:shadow-md flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-900 bg-amber-100 px-3 py-1 rounded-xl">
                  {meal.mealTypeName}
                </span>
                <div className="flex items-center gap-2">
                  {meal.calorieKcal && (
                    <span className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      {meal.calorieKcal} kcal
                    </span>
                  )}
                  <button
                    onClick={() => handleOpenEdit(meal)}
                    className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900">{meal.dishName}</h3>
                <div className="mt-2 text-xs text-slate-600 space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="font-semibold text-slate-700 block">Thành phần món ăn:</span>
                  <ul className="list-disc list-inside space-y-0.5 pl-1">
                    {meal.dishComponents.map((comp, idx) => (
                      <li key={idx} className="text-slate-600">{comp}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {meal.allergyNotice && (
                <div className="rounded-xl bg-rose-50 p-2.5 text-xs text-rose-800 border border-rose-100 flex items-start gap-1.5">
                  <span className="font-bold shrink-0">⚠️ Lưu ý:</span>
                  <span>{meal.allergyNotice}</span>
                </div>
              )}

              {meal.notes && (
                <p className="text-xs text-slate-500 italic">
                  "{meal.notes}"
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT MEAL MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-amber-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">
                {editingMeal ? 'Cập Nhật Món Ăn Thực Đơn' : 'Thêm Món Ăn Vào Thực Đơn'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Bữa ăn</label>
                <select
                  value={formData.mealType}
                  onChange={(e: any) => {
                    const selected = mealTypeOptions.find(o => o.type === e.target.value);
                    setFormData({
                      ...formData,
                      mealType: e.target.value,
                      mealTypeName: selected?.name || ''
                    });
                  }}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-amber-400 focus:outline-none"
                >
                  {mealTypeOptions.map(opt => (
                    <option key={opt.type} value={opt.type}>{opt.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên món chính *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Cơm tấm sườn nạc + Canh bí đao nấu tôm thịt"
                  value={formData.dishName}
                  onChange={(e) => setFormData({ ...formData, dishName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Các món thành phần (mỗi dòng 1 món)
                </label>
                <textarea
                  rows={4}
                  placeholder="Cơm tám dẻo thơm&#10;Thịt nạc vai rim tôm&#10;Canh cải cúc nấu cá hồi&#10;Tráng miệng: Đu đủ ngọt"
                  value={componentsInput}
                  onChange={(e) => setComponentsInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Năng lượng ước tính (kcal)</label>
                  <input
                    type="number"
                    value={formData.calorieKcal || 400}
                    onChange={(e) => setFormData({ ...formData, calorieKcal: parseInt(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cảnh báo dị ứng thay thế</label>
                  <input
                    type="text"
                    placeholder="Thay tôm bằng trứng cút cho bé dị ứng"
                    value={formData.allergyNotice || ''}
                    onChange={(e) => setFormData({ ...formData, allergyNotice: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 shadow-xs"
                >
                  Lưu vào thực đơn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
