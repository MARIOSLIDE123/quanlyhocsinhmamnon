// Comprehensive Google Apps Script Code Suite for "CÔ HẠNH – MẦM NON"
// Ready to copy into Google Apps Script or deploy as Web App.

export interface GasFileCode {
  filename: string;
  description: string;
  code: string;
}

export const GAS_SUITE: GasFileCode[] = [
  {
    filename: 'Config.gs',
    description: 'Cấu hình hệ thống, đọc biến Script Properties và danh mục các bảng tính',
    code: `/**
 * Config.gs - Cấu hình hệ thống CÔ HẠNH - MẦM NON
 * Lưu trữ trong Google Apps Script Script Properties
 */

function getConfig() {
  var props = PropertiesService.getScriptProperties();
  return {
    SPREADSHEET_ID: props.getProperty('SPREADSHEET_ID') || '',
    DRIVE_ROOT_FOLDER_ID: props.getProperty('DRIVE_ROOT_FOLDER_ID') || '',
    APP_SHARED_SECRET: props.getProperty('APP_SHARED_SECRET') || 'cohanh_secret_key_2026'
  };
}

// Danh mục 20 Bảng dữ liệu chuẩn của hệ thống
var SHEET_NAMES = {
  TRUONG: 'TRUONG',
  NAM_HOC: 'NAM_HOC',
  LOP: 'LOP',
  TAI_KHOAN: 'TAI_KHOAN',
  GIAO_VIEN: 'GIAO_VIEN',
  TRE: 'TRE',
  PHU_HUYNH: 'PHU_HUYNH',
  LIEN_KET_GIA_DINH: 'LIEN_KET_GIA_DINH',
  DIEM_DANH: 'DIEM_DANH',
  SUC_KHOE: 'SUC_KHOE',
  PHAT_TRIEN: 'PHAT_TRIEN',
  THUC_DON: 'THUC_DON',
  HOAT_DONG: 'HOAT_DONG',
  KE_HOACH_GIAO_DUC: 'KE_HOACH_GIAO_DUC',
  THONG_BAO: 'THONG_BAO',
  DA_DOC_THONG_BAO: 'DA_DOC_THONG_BAO',
  TEP_TIN: 'TEP_TIN',
  TRAO_DOI: 'TRAO_DOI',
  NHAT_KY_HE_THONG: 'NHAT_KY_HE_THONG',
  CAU_HINH: 'CAU_HINH'
};

// Cấu trúc tiêu đề cột cho 20 bảng
var SHEET_HEADERS = {
  TRUONG: ['id', 'name', 'slogan', 'address', 'phone', 'email', 'principalName', 'logoUrl', 'currentSchoolYearId', 'updatedAt'],
  NAM_HOC: ['id', 'name', 'startDate', 'endDate', 'isCurrent', 'status'],
  LOP: ['id', 'name', 'gradeLevel', 'room', 'schoolYearId', 'teacherId', 'teacherName', 'maxCapacity', 'status', 'colorTheme'],
  TAI_KHOAN: ['id', 'uid', 'email', 'displayName', 'role', 'phone', 'classId', 'studentId', 'status', 'createdAt'],
  GIAO_VIEN: ['id', 'fullName', 'phone', 'email', 'dateOfBirth', 'qualification', 'classId', 'status', 'avatarUrl'],
  TRE: ['id', 'studentCode', 'fullName', 'nickname', 'dateOfBirth', 'gender', 'classId', 'admissionDate', 'avatarUrl', 'status', 'healthNotes', 'allergies', 'bloodGroup', 'address', 'createdAt', 'updatedAt'],
  PHU_HUYNH: ['id', 'fullName', 'phone', 'email', 'relationship', 'occupation', 'address', 'emergencyContact'],
  LIEN_KET_GIA_DINH: ['id', 'studentId', 'guardianId', 'isPrimaryContact', 'canPickup'],
  DIEM_DANH: ['id', 'date', 'studentId', 'classId', 'status', 'arrivalTime', 'pickupTime', 'pickupPersonName', 'pickupNote', 'temperature', 'updatedBy', 'createdAt', 'updatedAt'],
  SUC_KHOE: ['id', 'studentId', 'classId', 'recordDate', 'heightCm', 'weightKg', 'bmi', 'bmiStatus', 'eyesight', 'dentalHealth', 'temperature', 'healthNotes', 'checkedBy'],
  PHAT_TRIEN: ['id', 'studentId', 'classId', 'monthYear', 'domainPhysical', 'domainCognitive', 'domainLanguage', 'domainSocialEmotional', 'domainAesthetic', 'generalRemark', 'teacherId', 'createdAt'],
  THUC_DON: ['id', 'date', 'dayOfWeek', 'mealType', 'mealTypeName', 'dishName', 'dishComponents', 'calorieKcal', 'allergyNotice', 'notes'],
  HOAT_DONG: ['id', 'classId', 'date', 'timeStart', 'timeEnd', 'title', 'category', 'description', 'teacherInCharge', 'location'],
  KE_HOACH_GIAO_DUC: ['id', 'title', 'theme', 'gradeLevel', 'classId', 'weekNumber', 'month', 'year', 'startDate', 'endDate', 'objectives', 'activitiesDetail', 'teacherId', 'driveFileId', 'status', 'createdAt'],
  THONG_BAO: ['id', 'title', 'content', 'type', 'targetType', 'targetClassId', 'authorName', 'authorRole', 'isPinned', 'createdAt'],
  DA_DOC_THONG_BAO: ['id', 'announcementId', 'userId', 'readAt'],
  TEP_TIN: ['id', 'fileId', 'fileName', 'mimeType', 'sizeBytes', 'category', 'classId', 'studentId', 'activityDate', 'title', 'webViewLink', 'uploadedBy', 'uploadedAt'],
  TRAO_DOI: ['id', 'studentId', 'classId', 'senderId', 'senderName', 'senderRole', 'recipientId', 'content', 'isRead', 'createdAt'],
  NHAT_KY_HE_THONG: ['id', 'timestamp', 'action', 'entity', 'entityId', 'performedBy', 'details'],
  CAU_HINH: ['key', 'value', 'description', 'updatedAt']
};
`
  },
  {
    filename: 'InitSetup.gs',
    description: 'Hàm khởi tạo tự động toàn bộ 20 sheet và cột tiêu đề cho bảng tính CSDL_QUAN_LY_MAM_NON_CO_HANH',
    code: `/**
 * InitSetup.gs - Khởi tạo CSDL_QUAN_LY_MAM_NON_CO_HANH
 * Chạy hàm initDatabase() một lần khi thiết lập hệ thống!
 */

function initDatabase() {
  var config = getConfig();
  var ss;
  
  if (config.SPREADSHEET_ID) {
    try {
      ss = SpreadsheetApp.openById(config.SPREADSHEET_ID);
    } catch (e) {
      Logger.log('Không thể mở Spreadsheet bằng ID có sẵn, đang tạo mới...');
    }
  }
  
  if (!ss) {
    ss = SpreadsheetApp.create('CSDL_QUAN_LY_MAM_NON_CO_HANH');
    PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());
    Logger.log('Đã tạo Spreadsheet mới với ID: ' + ss.getId());
  }
  
  // Tạo hoặc chuẩn hóa 20 bảng tính
  for (var key in SHEET_NAMES) {
    var sheetName = SHEET_NAMES[key];
    var sheet = ss.getSheetByName(sheetName);
    var headers = SHEET_HEADERS[key];
    
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      Logger.log('Đã tạo sheet mới: ' + sheetName);
    }
    
    // Ghi tiêu đề nếu sheet còn trống
    if (sheet.getLastRow() === 0 && headers && headers.length > 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length)
           .setBackground('#FFE4E6')
           .setFontColor('#9F1239')
           .setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
  }
  
  // Xóa sheet mặc định "Sheet1" hoặc "Trang tính 1" nếu còn
  var defaultSheet = ss.getSheetByName('Sheet1') || ss.getSheetByName('Trang tính 1');
  if (defaultSheet && ss.getSheets().length > 1) {
    try {
      ss.deleteSheet(defaultSheet);
    } catch (e) {}
  }
  
  return {
    success: true,
    message: 'Khởi tạo thành công 20 bảng dữ liệu mầm non!',
    spreadsheetId: ss.getId(),
    spreadsheetUrl: ss.getUrl()
  };
}
`
  },
  {
    filename: 'Database.gs',
    description: 'Thao tác đọc, ghi, cập nhật, xóa theo lô sử dụng LockService an toàn',
    code: `/**
 * Database.gs - Lớp xử lý dữ liệu Google Sheets
 */

function getSpreadsheet() {
  var config = getConfig();
  if (!config.SPREADSHEET_ID) {
    throw new Error('Chưa cấu hình SPREADSHEET_ID trong Script Properties');
  }
  return SpreadsheetApp.openById(config.SPREADSHEET_ID);
}

function getSheet(sheetName) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error('Không tìm thấy bảng tính: ' + sheetName);
  }
  return sheet;
}

// Đọc toàn bộ dữ liệu thành mảng Object theo tiêu đề cột
function readAll(sheetName) {
  var sheet = getSheet(sheetName);
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  
  if (lastRow <= 1) return []; // Chỉ có header hoặc trống
  
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var dataValues = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  
  var result = [];
  for (var i = 0; i < dataValues.length; i++) {
    var row = dataValues[i];
    var item = {};
    for (var j = 0; j < headers.length; j++) {
      var header = headers[j];
      var val = row[j];
      // Xử lý ngày tháng thành chuỗi ISO/YYYY-MM-DD
      if (val instanceof Date) {
        val = Utilities.formatDate(val, Session.getScriptTimeZone(), 'yyyy-MM-dd');
      }
      item[header] = val;
    }
    result.push(item);
  }
  return result;
}

// Thêm một bản ghi mới với LockService để tránh xung đột
function insertRecord(sheetName, record) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // Đợi tối đa 10 giây
    var sheet = getSheet(sheetName);
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    if (!record.id) {
      record.id = Utilities.getUuid();
    }
    if (!record.createdAt) {
      record.createdAt = new Date().toISOString();
    }
    record.updatedAt = new Date().toISOString();
    
    var rowValues = headers.map(function(header) {
      var val = record[header];
      if (Array.isArray(val) || (typeof val === 'object' && val !== null && !(val instanceof Date))) {
        return JSON.stringify(val);
      }
      return val !== undefined ? val : '';
    });
    
    sheet.appendRow(rowValues);
    return record;
  } finally {
    lock.releaseLock();
  }
}

// Cập nhật bản ghi theo ID
function updateRecord(sheetName, id, updates) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var sheet = getSheet(sheetName);
    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();
    if (lastRow <= 1) throw new Error('Bảng không có dữ liệu để cập nhật');
    
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var idColIdx = headers.indexOf('id');
    if (idColIdx === -1) throw new Error('Không tìm thấy cột id trong bảng: ' + sheetName);
    
    var idValues = sheet.getRange(2, idColIdx + 1, lastRow - 1, 1).getValues();
    var targetRow = -1;
    for (var i = 0; i < idValues.length; i++) {
      if (String(idValues[i][0]) === String(id)) {
        targetRow = i + 2;
        break;
      }
    }
    
    if (targetRow === -1) throw new Error('Không tìm thấy bản ghi với ID: ' + id);
    
    var currentRowValues = sheet.getRange(targetRow, 1, 1, lastCol).getValues()[0];
    var updatedRow = [];
    
    for (var j = 0; j < headers.length; j++) {
      var header = headers[j];
      var val = updates[header] !== undefined ? updates[header] : currentRowValues[j];
      if (header === 'updatedAt') {
        val = new Date().toISOString();
      }
      if (Array.isArray(val) || (typeof val === 'object' && val !== null && !(val instanceof Date))) {
        val = JSON.stringify(val);
      }
      updatedRow.push(val !== undefined ? val : '');
    }
    
    sheet.getRange(targetRow, 1, 1, lastCol).setValues([updatedRow]);
    return updates;
  } finally {
    lock.releaseLock();
  }
}

// Ghi đè hoặc thêm nhiều bản ghi theo lô (Ví dụ: Điểm danh cả lớp)
function batchUpsertAttendance(records) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    var sheet = getSheet(SHEET_NAMES.DIEM_DANH);
    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    
    var dateIdx = headers.indexOf('date');
    var studentIdIdx = headers.indexOf('studentId');
    
    var existingMap = {};
    if (lastRow > 1) {
      var existingData = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
      for (var i = 0; i < existingData.length; i++) {
        var d = existingData[i][dateIdx];
        if (d instanceof Date) {
          d = Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
        }
        var sid = String(existingData[i][studentIdIdx]);
        var key = d + '_' + sid;
        existingMap[key] = i + 2; // hàng trong sheet
      }
    }
    
    var newRows = [];
    for (var k = 0; k < records.length; k++) {
      var rec = records[k];
      var key = rec.date + '_' + rec.studentId;
      var existingRow = existingMap[key];
      
      if (!rec.id) rec.id = Utilities.getUuid();
      rec.updatedAt = new Date().toISOString();
      
      var rowVals = headers.map(function(h) {
        return rec[h] !== undefined ? rec[h] : '';
      });
      
      if (existingRow) {
        // Cập nhật hàng đã có
        sheet.getRange(existingRow, 1, 1, lastCol).setValues([rowVals]);
      } else {
        newRows.push(rowVals);
      }
    }
    
    if (newRows.length > 0) {
      sheet.getRange(sheet.getLastRow() + 1, 1, newRows.length, lastCol).setValues(newRows);
    }
    
    return { success: true, count: records.length };
  } finally {
    lock.releaseLock();
  }
}
`
  },
  {
    filename: 'DriveService.gs',
    description: 'Xử lý tải lên và quản lý tệp trên Google Drive theo phân cấp thư mục',
    code: `/**
 * DriveService.gs - Quản lý tệp Google Drive
 */

function getRootDriveFolder() {
  var config = getConfig();
  if (config.DRIVE_ROOT_FOLDER_ID) {
    try {
      return DriveApp.getFolderById(config.DRIVE_ROOT_FOLDER_ID);
    } catch (e) {}
  }
  
  // Tìm hoặc tạo thư mục gốc
  var folders = DriveApp.getFoldersByName('KHO_DU_LIEU_QUAN_LY_MAM_NON');
  if (folders.hasNext()) {
    var folder = folders.next();
    PropertiesService.getScriptProperties().setProperty('DRIVE_ROOT_FOLDER_ID', folder.getId());
    return folder;
  }
  
  var newRoot = DriveApp.createFolder('KHO_DU_LIEU_QUAN_LY_MAM_NON');
  PropertiesService.getScriptProperties().setProperty('DRIVE_ROOT_FOLDER_ID', newRoot.getId());
  
  // Tạo các thư mục con phân loại
  var subfolders = [
    '01_HO_SO_TRE',
    '02_GIAO_AN_KE_HOACH',
    '03_HINH_ANH_HOAT_DONG',
    '04_VIDEO_HOAT_DONG',
    '05_TAI_LIEU_HOC_LIEU',
    '06_BAO_CAO',
    '07_TEP_DINH_KEM',
    '08_LUU_TRU_THEO_NAM_HOC'
  ];
  for (var i = 0; i < subfolders.length; i++) {
    newRoot.createFolder(subfolders[i]);
  }
  
  return newRoot;
}

// Lưu file từ base64 data
function uploadFileToDrive(fileData) {
  // fileData: { fileName, mimeType, base64Content, category, classId, title, uploadedBy }
  var root = getRootDriveFolder();
  var category = fileData.category || '03_HINH_ANH_HOAT_DONG';
  
  var targetFolder = root;
  var subfolders = root.getFoldersByName(category);
  if (subfolders.hasNext()) {
    targetFolder = subfolders.next();
  }
  
  var decodedBytes = Utilities.base64Decode(fileData.base64Content);
  var blob = Utilities.newBlob(decodedBytes, fileData.mimeType, fileData.fileName);
  var file = targetFolder.createFile(blob);
  
  // Ghi metadata vào bảng TEP_TIN
  var metadata = {
    id: Utilities.getUuid(),
    fileId: file.getId(),
    fileName: file.getName(),
    mimeType: file.getMimeType(),
    sizeBytes: file.getSize(),
    category: category,
    classId: fileData.classId || '',
    studentId: fileData.studentId || '',
    activityDate: fileData.activityDate || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'),
    title: fileData.title || file.getName(),
    webViewLink: file.getUrl(),
    uploadedBy: fileData.uploadedBy || 'Giáo viên',
    uploadedAt: new Date().toISOString()
  };
  
  insertRecord(SHEET_NAMES.TEP_TIN, metadata);
  return metadata;
}
`
  },
  {
    filename: 'Code.gs',
    description: 'Điểm vào API tiếp nhận yêu cầu doGet(e) và doPost(e), kiểm tra token bí mật nội bộ và chuyển tiếp',
    code: `/**
 * Code.gs - Điểm vào API Web App của Google Apps Script
 * Đón nhận yêu cầu từ Node.js Backend Server
 */

function doGet(e) {
  return handleRequest(e, 'GET');
}

function doPost(e) {
  return handleRequest(e, 'POST');
}

function handleRequest(e, method) {
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  try {
    var params = e.parameter || {};
    var payload = {};
    if (e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (err) {}
    }
    
    var action = params.action || payload.action || 'ping';
    var secret = params.secret || payload.secret || '';
    
    // Kiểm tra Shared Secret giữa Backend và Google Apps Script
    var config = getConfig();
    if (config.APP_SHARED_SECRET && secret !== config.APP_SHARED_SECRET) {
      output.setContent(JSON.stringify({
        success: false,
        error: 'Mã xác thực nội bộ (Shared Secret) không chính xác!',
        code: 'UNAUTHORIZED'
      }));
      return output;
    }
    
    var responseData = {};
    
    switch (action) {
      case 'ping':
        responseData = {
          status: 'online',
          message: 'Google Apps Script Cô Hạnh Mầm Non đang hoạt động!',
          spreadsheetId: config.SPREADSHEET_ID,
          time: new Date().toISOString()
        };
        break;
        
      case 'init':
        responseData = initDatabase();
        break;
        
      case 'readAll':
        var sheetName = params.sheet || payload.sheet;
        if (!sheetName) throw new Error('Thiếu tên bảng tính (sheet)');
        responseData = readAll(sheetName);
        break;
        
      case 'insert':
        var targetSheet = payload.sheet;
        var record = payload.data;
        responseData = insertRecord(targetSheet, record);
        break;
        
      case 'update':
        var updateSheet = payload.sheet;
        var updateId = payload.id;
        var updateData = payload.data;
        responseData = updateRecord(updateSheet, updateId, updateData);
        break;
        
      case 'batchAttendance':
        var records = payload.records || [];
        responseData = batchUpsertAttendance(records);
        break;
        
      case 'uploadFile':
        responseData = uploadFileToDrive(payload.fileData);
        break;
        
      default:
        throw new Error('Thao tác không được hỗ trợ: ' + action);
    }
    
    output.setContent(JSON.stringify({
      success: true,
      action: action,
      data: responseData,
      requestId: Utilities.getUuid()
    }));
    
  } catch (err) {
    output.setContent(JSON.stringify({
      success: false,
      error: err.message || String(err),
      code: 'SERVER_ERROR'
    }));
  }
  
  return output;
}
`
  }
];
