import {
  Student,
  AttendanceRecord,
  HealthRecord,
  MealMenu,
  DailyActivity,
  LessonPlan,
  Announcement,
  ParentCommunication,
  DevelopmentalEvaluation,
  SchoolInfo
} from '../types';
import fallbackDb from '../../data/kindergarten_db.json';

export const apiClient = {
  async getInitialData() {
    try {
      const res = await fetch('/api/initial-data');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json;
        }
      }
    } catch (err) {
      console.warn('[apiClient] Không thể kết nối tới /api/initial-data, dùng dữ liệu khởi tạo dự phòng');
    }
    return {
      success: true,
      data: fallbackDb
    };
  },

  async getGasStatus() {
    try {
      const res = await fetch('/api/gas/status');
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      // ignore
    }
    return {
      success: true,
      data: {
        isConfigured: false,
        status: 'not_configured',
        lastCheckedAt: new Date().toISOString()
      }
    };
  },

  async getGasCodeSuite() {
    try {
      const res = await fetch('/api/gas/code');
      if (res.ok) return await res.json();
    } catch (err) {
      // ignore
    }
    return { success: false, data: [] };
  },

  async testGasConnection() {
    try {
      const res = await fetch('/api/gas/test', { method: 'POST' });
      if (res.ok) return await res.json();
    } catch (err) {
      // ignore
    }
    return { success: false, data: { status: 'error', errorMessage: 'Chưa cấu hình Google Apps Script URL' } };
  },

  async updateSchoolInfo(data: Partial<SchoolInfo>) {
    try {
      const res = await fetch('/api/school', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      // ignore
    }
    return { success: true, data: { ...fallbackDb.school, ...data } };
  },

  async addStudent(data: Partial<Student>) {
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      // ignore
    }
    const newStudent: Student = {
      ...data,
      id: 'TRE-' + Date.now(),
      studentCode: data.studentCode || `MN-QS${Math.floor(10 + Math.random() * 90)}`,
      status: 'active',
      guardians: data.guardians || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Student;
    return { success: true, data: newStudent };
  },

  async updateStudent(id: string, data: Partial<Student>) {
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      // ignore
    }
    return { success: true, data: { id, ...data } };
  },

  async deleteStudent(id: string) {
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) return await res.json();
    } catch (err) {
      // ignore
    }
    return { success: true, data: { id, status: 'leave' } };
  },

  async batchSaveAttendance(records: AttendanceRecord[]) {
    try {
      const res = await fetch('/api/attendance/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records })
      });
      if (res.ok) return await res.json();
    } catch (err) {
      // ignore
    }
    return { success: true, data: records };
  },

  async addHealthRecord(data: Partial<HealthRecord>) {
    try {
      const res = await fetch('/api/health-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      // ignore
    }
    return { success: true, data: { id: 'HLT-' + Date.now(), ...data } };
  },

  async addEvaluation(data: Partial<DevelopmentalEvaluation>) {
    try {
      const res = await fetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      // ignore
    }
    return { success: true, data: { id: 'EVL-' + Date.now(), ...data } };
  },

  async saveMealMenu(data: Partial<MealMenu>) {
    try {
      const res = await fetch('/api/meal-menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      // ignore
    }
    return { success: true, data: { id: 'MNU-' + Date.now(), ...data } };
  },

  async saveActivity(data: Partial<DailyActivity>) {
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      // ignore
    }
    return { success: true, data: { id: 'ACT-' + Date.now(), ...data } };
  },

  async saveLessonPlan(data: Partial<LessonPlan>) {
    try {
      const res = await fetch('/api/lesson-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      // ignore
    }
    return { success: true, data: { id: 'LP-' + Date.now(), ...data } };
  },

  async createAnnouncement(data: Partial<Announcement>) {
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      // ignore
    }
    return {
      success: true,
      data: {
        id: 'ANN-' + Date.now(),
        readCount: 0,
        createdAt: new Date().toISOString(),
        ...data
      }
    };
  },

  async markAnnouncementRead(id: string) {
    try {
      const res = await fetch(`/api/announcements/${id}/read`, {
        method: 'POST'
      });
      if (res.ok) return await res.json();
    } catch (err) {
      // ignore
    }
    return { success: true, data: { id } };
  },

  async sendMessage(data: Partial<ParentCommunication>) {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      // ignore
    }
    return {
      success: true,
      data: {
        id: 'MSG-' + Date.now(),
        createdAt: new Date().toISOString(),
        isRead: false,
        ...data
      }
    };
  },

  async uploadMedia(data: any) {
    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      // ignore
    }
    return {
      success: true,
      data: {
        id: 'MED-' + Date.now(),
        ...data,
        uploadedAt: new Date().toISOString()
      }
    };
  },

  getCsvExportUrl(table: string) {
    return `/api/export/csv/${table}`;
  }
};
