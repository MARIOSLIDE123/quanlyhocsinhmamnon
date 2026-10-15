import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { loadDatabase, saveDatabase, logSystemAction, DatabaseState } from './src/server/storage';
import { GasService } from './src/server/gasService';
import { GAS_SUITE } from './src/server/gasScriptFiles';
import { Student, AttendanceRecord, HealthRecord, MealMenu, DailyActivity, LessonPlan, Announcement, ParentCommunication, DevelopmentalEvaluation, SchoolInfo } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ----------------- API ROUTES -----------------

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'CÔ HẠNH – MẦM NON',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Initial Data Bundle
app.get('/api/initial-data', (req: Request, res: Response) => {
  try {
    const db = loadDatabase();
    res.json({
      success: true,
      data: db
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Google Apps Script Integration Status
app.get('/api/gas/status', async (req: Request, res: Response) => {
  try {
    const status = await GasService.checkStatus();
    res.json({ success: true, data: status });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Google Apps Script Code Suite
app.get('/api/gas/code', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: GAS_SUITE
  });
});

// Test GAS Connection
app.post('/api/gas/test', async (req: Request, res: Response) => {
  try {
    const status = await GasService.checkStatus();
    res.json({ success: true, data: status });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update School Info
app.put('/api/school', (req: Request, res: Response) => {
  try {
    const updates: Partial<SchoolInfo> = req.body;
    const db = loadDatabase();
    db.school = { ...db.school, ...updates };
    saveDatabase(db);
    logSystemAction('CAP_NHAT_TRUONG', 'TRUONG', db.school.id, updates.principalName || 'BGH', 'Cập nhật thông tin nhận diện trường mầm non');
    res.json({ success: true, data: db.school });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add Student
app.post('/api/students', (req: Request, res: Response) => {
  try {
    const newStudentData = req.body;
    const db = loadDatabase();

    const id = 'TRE-' + String(db.students.length + 1).padStart(3, '0');
    const studentCode = newStudentData.studentCode || `MN-${new Date().getFullYear().toString().slice(-2)}${String(db.students.length + 1).padStart(2, '0')}`;
    
    // Find class name
    const cls = db.classes.find(c => c.id === newStudentData.classId);

    const newStudent: Student = {
      ...newStudentData,
      id,
      studentCode,
      className: cls ? cls.name : 'Chưa phân lớp',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active'
    };

    db.students.unshift(newStudent);

    // Update classroom student count
    if (cls) {
      cls.currentCount = db.students.filter(s => s.classId === cls.id && s.status === 'active').length;
    }

    saveDatabase(db);
    logSystemAction('THEM_HOC_SINH', 'TRE', id, 'Giáo viên', `Thêm mới hồ sơ bé ${newStudent.fullName} (${studentCode})`);

    res.json({ success: true, data: newStudent });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update Student
app.put('/api/students/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const db = loadDatabase();

    const idx = db.students.findIndex(s => s.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy hồ sơ học sinh' });
    }

    const cls = db.classes.find(c => c.id === updates.classId);
    db.students[idx] = {
      ...db.students[idx],
      ...updates,
      className: cls ? cls.name : db.students[idx].className,
      updatedAt: new Date().toISOString()
    };

    saveDatabase(db);
    logSystemAction('CAP_NHAT_HOC_SINH', 'TRE', id, 'Giáo viên', `Cập nhật thông tin hồ sơ bé ${db.students[idx].fullName}`);

    res.json({ success: true, data: db.students[idx] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Soft Delete / Suspend Student
app.delete('/api/students/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = loadDatabase();
    const student = db.students.find(s => s.id === id);
    if (!student) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy hồ sơ học sinh' });
    }

    // Soft delete: Change status to 'leave'
    student.status = 'leave';
    student.updatedAt = new Date().toISOString();

    const cls = db.classes.find(c => c.id === student.classId);
    if (cls) {
      cls.currentCount = db.students.filter(s => s.classId === cls.id && s.status === 'active').length;
    }

    saveDatabase(db);
    logSystemAction('NGHI_HOC_HOC_SINH', 'TRE', id, 'BGH', `Chuyển trạng thái nghỉ học cho bé ${student.fullName}`);

    res.json({ success: true, message: 'Đã cập nhật trạng thái nghỉ học thành công', data: student });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Batch Save Attendance
app.post('/api/attendance/batch', (req: Request, res: Response) => {
  try {
    const { records } = req.body as { records: AttendanceRecord[] };
    if (!records || !Array.isArray(records)) {
      return res.status(400).json({ success: false, error: 'Danh sách bản ghi không hợp lệ' });
    }

    const db = loadDatabase();
    const updatedRecords: AttendanceRecord[] = [];

    for (const rec of records) {
      const existingIdx = db.attendance.findIndex(
        a => a.date === rec.date && a.studentId === rec.studentId
      );

      const recordToSave: AttendanceRecord = {
        ...rec,
        id: rec.id || `ATT-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: rec.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (existingIdx !== -1) {
        db.attendance[existingIdx] = recordToSave;
      } else {
        db.attendance.push(recordToSave);
      }
      updatedRecords.push(recordToSave);
    }

    saveDatabase(db);
    logSystemAction('DIEM_DANH_HANG_LOAT', 'DIEM_DANH', records[0]?.date || '', records[0]?.updatedBy || 'Giáo viên', `Điểm danh ${records.length} học sinh ngày ${records[0]?.date}`);

    res.json({ success: true, data: updatedRecords, count: updatedRecords.length });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add Health Record
app.post('/api/health-records', (req: Request, res: Response) => {
  try {
    const data = req.body;
    const db = loadDatabase();
    const id = 'HLT-' + Date.now();
    const newRecord: HealthRecord = {
      ...data,
      id
    };
    db.healthRecords.unshift(newRecord);
    saveDatabase(db);
    logSystemAction('THEM_SUC_KHOE', 'SUC_KHOE', id, data.checkedBy || 'Y tế', `Ghi nhận chỉ số sức khỏe bé ${data.studentName}`);
    res.json({ success: true, data: newRecord });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add Developmental Evaluation
app.post('/api/evaluations', (req: Request, res: Response) => {
  try {
    const data = req.body;
    const db = loadDatabase();
    const id = 'EVL-' + Date.now();
    const newRecord: DevelopmentalEvaluation = {
      ...data,
      id,
      createdAt: new Date().toISOString()
    };
    db.evaluations.unshift(newRecord);
    saveDatabase(db);
    logSystemAction('DANH_GIA_PHAT_TRIEN', 'PHAT_TRIEN', id, data.teacherName || 'Giáo viên', `Đánh giá sự phát triển bé ${data.studentName}`);
    res.json({ success: true, data: newRecord });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add / Update Meal Menu
app.post('/api/meal-menus', (req: Request, res: Response) => {
  try {
    const menuData = req.body;
    const db = loadDatabase();
    const id = menuData.id || 'MNU-' + Date.now();
    const idx = db.mealMenus.findIndex(m => m.id === id);
    if (idx !== -1) {
      db.mealMenus[idx] = { ...db.mealMenus[idx], ...menuData };
    } else {
      db.mealMenus.push({ ...menuData, id });
    }
    saveDatabase(db);
    logSystemAction('CAP_NHAT_THUC_DON', 'THUC_DON', id, 'Nhà bếp', `Cập nhật thực đơn món ${menuData.dishName}`);
    res.json({ success: true, data: menuData });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add Daily Activity
app.post('/api/activities', (req: Request, res: Response) => {
  try {
    const activityData = req.body;
    const db = loadDatabase();
    const id = activityData.id || 'ACT-' + Date.now();
    const idx = db.activities.findIndex(a => a.id === id);
    if (idx !== -1) {
      db.activities[idx] = { ...db.activities[idx], ...activityData };
    } else {
      db.activities.push({ ...activityData, id });
    }
    saveDatabase(db);
    logSystemAction('CAP_NHAT_HOAT_DONG', 'HOAT_DONG', id, activityData.teacherInCharge || 'Giáo viên', `Cập nhật hoạt động: ${activityData.title}`);
    res.json({ success: true, data: activityData });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add / Update Lesson Plan
app.post('/api/lesson-plans', (req: Request, res: Response) => {
  try {
    const planData = req.body;
    const db = loadDatabase();
    const id = planData.id || 'LP-' + Date.now();
    const idx = db.lessonPlans.findIndex(p => p.id === id);
    if (idx !== -1) {
      db.lessonPlans[idx] = { ...db.lessonPlans[idx], ...planData };
    } else {
      db.lessonPlans.unshift({ ...planData, id, createdAt: new Date().toISOString() });
    }
    saveDatabase(db);
    logSystemAction('GIAO_AN', 'KE_HOACH_GIAO_DUC', id, planData.teacherName || 'Giáo viên', `Lưu giáo án: ${planData.title}`);
    res.json({ success: true, data: planData });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create Announcement
app.post('/api/announcements', (req: Request, res: Response) => {
  try {
    const announcementData = req.body;
    const db = loadDatabase();
    const id = 'ANC-' + Date.now();
    const newAnnouncement: Announcement = {
      ...announcementData,
      id,
      createdAt: new Date().toISOString(),
      readCount: 1,
      totalTarget: db.students.length
    };
    db.announcements.unshift(newAnnouncement);
    saveDatabase(db);
    logSystemAction('DANG_THONG_BAO', 'THONG_BAO', id, announcementData.authorName || 'BGH', `Đăng thông báo: ${newAnnouncement.title}`);
    res.json({ success: true, data: newAnnouncement });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Mark Announcement Read
app.post('/api/announcements/:id/read', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = loadDatabase();
    const anc = db.announcements.find(a => a.id === id);
    if (anc) {
      anc.readCount = (anc.readCount || 0) + 1;
      saveDatabase(db);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Send Message
app.post('/api/messages', (req: Request, res: Response) => {
  try {
    const messageData = req.body;
    const db = loadDatabase();
    const id = 'MSG-' + Date.now();
    const newMessage: ParentCommunication = {
      ...messageData,
      id,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    db.messages.push(newMessage);
    saveDatabase(db);
    res.json({ success: true, data: newMessage });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Upload Media
app.post('/api/media/upload', (req: Request, res: Response) => {
  try {
    const { title, fileName, category, categoryLabel, classId, webViewLink, thumbnailLink, uploadedBy } = req.body;
    const db = loadDatabase();
    const id = 'MED-' + Date.now();
    const newMedia = {
      id,
      fileId: 'DRIVE-FILE-' + Date.now(),
      fileName: fileName || `${title.toLowerCase().replace(/\s+/g, '_')}.jpg`,
      mimeType: 'image/jpeg',
      sizeBytes: 1850000,
      category: category || '03_HINH_ANH_HOAT_DONG',
      categoryLabel: categoryLabel || 'Ảnh hoạt động của trẻ',
      classId: classId || 'CLS-CHOI-1',
      activityDate: new Date().toISOString().split('T')[0],
      title: title || 'Ảnh hoạt động mới',
      webViewLink: webViewLink || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      thumbnailLink: thumbnailLink || webViewLink || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
      uploadedBy: uploadedBy || 'Cô Hồng Hạnh',
      uploadedAt: new Date().toISOString()
    };
    db.mediaFiles.unshift(newMedia);
    saveDatabase(db);
    logSystemAction('TAI_LEN_TEP', 'TEP_TIN', id, uploadedBy || 'Giáo viên', `Tải lên tệp Google Drive: ${newMedia.title}`);
    res.json({ success: true, data: newMedia });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CSV Export for any table
app.get('/api/export/csv/:table', (req: Request, res: Response) => {
  try {
    const { table } = req.params;
    const db = loadDatabase();
    let records: any[] = [];

    switch (table) {
      case 'TRE':
      case 'students':
        records = db.students;
        break;
      case 'DIEM_DANH':
      case 'attendance':
        records = db.attendance;
        break;
      case 'SUC_KHOE':
      case 'health':
        records = db.healthRecords;
        break;
      case 'THUC_DON':
      case 'meals':
        records = db.mealMenus;
        break;
      case 'HOAT_DONG':
      case 'activities':
        records = db.activities;
        break;
      default:
        return res.status(400).json({ success: false, error: 'Bảng không hợp lệ' });
    }

    const csvContent = GasService.generateCsv(table, records);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${table}_${new Date().toISOString().split('T')[0]}.csv"`);
    res.send('\uFEFF' + csvContent); // Add UTF-8 BOM for Excel compatibility
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------- VITE MIDDLEWARE SETUP -----------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[CÔ HẠNH – MẦM NON] Máy chủ đang lắng nghe tại http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer().catch(err => {
    console.error('Không thể khởi động máy chủ:', err);
  });
}

export default app;
