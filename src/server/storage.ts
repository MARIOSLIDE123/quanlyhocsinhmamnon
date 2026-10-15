import fs from 'fs';
import path from 'path';
import {
  Student,
  AttendanceRecord,
  HealthRecord,
  MealMenu,
  DailyActivity,
  LessonPlan,
  Announcement,
  Classroom,
  SchoolInfo,
  SchoolYear,
  UserAccount,
  DriveMediaItem,
  ParentCommunication,
  SystemAuditLog,
  DevelopmentalEvaluation
} from '../types';
import defaultDbJson from '../../data/kindergarten_db.json';

export interface DatabaseState {
  school: SchoolInfo;
  schoolYears: SchoolYear[];
  classes: Classroom[];
  accounts: UserAccount[];
  students: Student[];
  attendance: AttendanceRecord[];
  healthRecords: HealthRecord[];
  evaluations: DevelopmentalEvaluation[];
  mealMenus: MealMenu[];
  activities: DailyActivity[];
  lessonPlans: LessonPlan[];
  announcements: Announcement[];
  mediaFiles: DriveMediaItem[];
  messages: ParentCommunication[];
  auditLogs: SystemAuditLog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'kindergarten_db.json');

const DEFAULT_INITIAL_STATE: DatabaseState = defaultDbJson as unknown as DatabaseState;

let memoryDb: DatabaseState | null = null;

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  // Read-only environment on Vercel
}

// Load database state from disk or initialize
export function loadDatabase(): DatabaseState {
  if (memoryDb) {
    return memoryDb;
  }
  try {
    if (fs.existsSync(DB_FILE)) {
      const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
      memoryDb = JSON.parse(fileContent);
      return memoryDb!;
    }
  } catch (error) {
    console.error('Lỗi khi đọc file database:', error);
  }
  memoryDb = JSON.parse(JSON.stringify(DEFAULT_INITIAL_STATE));
  saveDatabase(memoryDb!);
  return memoryDb!;
}

// Save database state to disk
export function saveDatabase(data: DatabaseState): void {
  memoryDb = data;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    try {
      const tmpPath = path.join('/tmp', 'kindergarten_db.json');
      fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      // In-memory fallback
    }
  }
}

// Helper to log audit actions
export function logSystemAction(action: string, entity: string, entityId: string, performedBy: string, details: string) {
  const db = loadDatabase();
  const log: SystemAuditLog = {
    id: 'LOG-' + Date.now(),
    timestamp: new Date().toISOString(),
    action,
    entity,
    entityId,
    performedBy,
    details
  };
  db.auditLogs.unshift(log);
  if (db.auditLogs.length > 200) {
    db.auditLogs = db.auditLogs.slice(0, 200);
  }
  saveDatabase(db);
}
