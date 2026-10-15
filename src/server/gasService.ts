import { GAS_SUITE } from './gasScriptFiles';
import { loadDatabase, DatabaseState } from './storage';

export interface GasConnectionStatus {
  isConfigured: boolean;
  appsScriptUrl: string;
  spreadsheetId: string;
  driveRootFolderId: string;
  hasSharedSecret: boolean;
  status: 'connected' | 'not_configured' | 'error';
  errorMessage?: string;
  lastCheckedAt: string;
}

export class GasService {
  private static getEnv() {
    return {
      appsScriptUrl: process.env.APPS_SCRIPT_URL || '',
      spreadsheetId: process.env.SPREADSHEET_ID || '',
      driveFolderId: process.env.DRIVE_ROOT_FOLDER_ID || '',
      sharedSecret: process.env.APPS_SCRIPT_SHARED_SECRET || 'cohanh_secret_key_2026'
    };
  }

  // Get current connection status
  static async checkStatus(): Promise<GasConnectionStatus> {
    const env = this.getEnv();
    const isConfigured = Boolean(env.appsScriptUrl && env.appsScriptUrl.startsWith('https://script.google.com'));

    if (!isConfigured) {
      return {
        isConfigured: false,
        appsScriptUrl: env.appsScriptUrl,
        spreadsheetId: env.spreadsheetId,
        driveRootFolderId: env.driveFolderId,
        hasSharedSecret: Boolean(env.sharedSecret),
        status: 'not_configured',
        lastCheckedAt: new Date().toISOString()
      };
    }

    try {
      // Test ping to Apps Script Web App
      const targetUrl = `${env.appsScriptUrl}?action=ping&secret=${encodeURIComponent(env.sharedSecret)}`;
      const response = await fetch(targetUrl, { method: 'GET', redirect: 'follow' });
      if (!response.ok) {
        throw new Error(`Google Apps Script trả về mã lỗi HTTP: ${response.status}`);
      }
      const data = await response.json();
      if (!data.success) {
        return {
          isConfigured: true,
          appsScriptUrl: env.appsScriptUrl,
          spreadsheetId: env.spreadsheetId,
          driveRootFolderId: env.driveFolderId,
          hasSharedSecret: true,
          status: 'error',
          errorMessage: data.error || 'Xác thực không thành công với Apps Script',
          lastCheckedAt: new Date().toISOString()
        };
      }

      return {
        isConfigured: true,
        appsScriptUrl: env.appsScriptUrl,
        spreadsheetId: env.spreadsheetId,
        driveRootFolderId: env.driveFolderId,
        hasSharedSecret: true,
        status: 'connected',
        lastCheckedAt: new Date().toISOString()
      };
    } catch (err: any) {
      return {
        isConfigured: true,
        appsScriptUrl: env.appsScriptUrl,
        spreadsheetId: env.spreadsheetId,
        driveRootFolderId: env.driveFolderId,
        hasSharedSecret: true,
        status: 'error',
        errorMessage: err.message || 'Không thể kết nối đến URL Google Apps Script',
        lastCheckedAt: new Date().toISOString()
      };
    }
  }

  // Send request to Google Apps Script
  static async forwardRequest(action: string, payload: any = {}): Promise<any> {
    const env = this.getEnv();
    if (!env.appsScriptUrl) {
      throw new Error('Chưa cấu hình APPS_SCRIPT_URL trong môi trường máy chủ');
    }

    const postBody = {
      action,
      secret: env.sharedSecret,
      ...payload
    };

    const response = await fetch(env.appsScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postBody),
      redirect: 'follow'
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script request failed with HTTP ${response.status}`);
    }

    return await response.json();
  }

  // Helper to generate CSV text for any table
  static generateCsv(tableName: string, data: any[]): string {
    if (!data || data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const headerRow = headers.map(h => `"${h}"`).join(',');
    const rows = data.map(item => {
      return headers.map(h => {
        let val = item[h];
        if (typeof val === 'object' && val !== null) {
          val = JSON.stringify(val);
        }
        val = String(val ?? '').replace(/"/g, '""');
        return `"${val}"`;
      }).join(',');
    });
    return [headerRow, ...rows].join('\n');
  }

  // Get GAS code bundle for display and download
  static getCodeBundle() {
    return GAS_SUITE;
  }
}
