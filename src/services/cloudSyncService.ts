// ============================================================================
// saludvalpa 3.0 - CLOUD SYNC SERVICE (Fase 1: MVP Sincronización Manual)
// Integración con Google Drive API v3 para respaldo/restauración manual
// ============================================================================

import type { RespaldoCompleto } from '../types';

// Declaraciones globales para Google APIs
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

// Configuración de Google Drive API
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';
const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/drive.file';
const APP_FOLDER_NAME = 'SaludValpa';
const BACKUP_FOLDER_NAME = 'Backups';

// Tipos para sincronización en la nube
export interface CloudBackupMetadata {
  version: string;
  createdAt: string;
  deviceId: string;
  appVersion: string;
  hash: string;
  dataSize: number;
  recordCounts: {
    pacientes: number;
    sesiones: number;
    citas: number;
    documentos: number;
    servicios: number;
    cotizaciones: number;
    recibos: number;
    biblioteca: number;
  };
}

export interface CloudBackup {
  metadata: CloudBackupMetadata;
  data: RespaldoCompleto;
}

export interface SyncStatus {
  isConnected: boolean;
  accountEmail?: string;
  lastSync?: Date;
  pendingChanges: number;
  storageUsed: number;
  storageQuota?: number;
}

export interface BackupVersion {
  id: string;
  name: string;
  createdTime: string;
  modifiedTime: string;
  size: number;
  metadata: CloudBackupMetadata;
}

// Estado global del servicio
let gapiLoaded = false;
let gisLoaded = false;
let tokenClient: any = null;
let accessToken: string | null = null;

/**
 * Cargar Google API Client y Google Identity Services
 */
export async function initializeGoogleApis(): Promise<boolean> {
  try {
    // Cargar Google API Client
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        gapiLoaded = true;
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });

    // Cargar Google Identity Services
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => {
        gisLoaded = true;
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });

    // Inicializar gapi client
    await new Promise<void>((resolve, reject) => {
      window.gapi.load('client', {
        callback: () => resolve(),
        onerror: reject,
        timeout: 10000,
        ontimeout: () => reject(new Error('Timeout loading gapi client'))
      });
    });

    // Inicializar cliente de Drive API
    await window.gapi.client.init({
      apiKey: GOOGLE_API_KEY,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
    });

    // Configurar cliente OAuth2
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: GOOGLE_SCOPES,
      callback: (response: any) => {
        if (response.access_token) {
          accessToken = response.access_token;
          window.gapi.client.setToken({ access_token: accessToken });
          console.log('✅ Autenticación exitosa con Google Drive');
        }
      },
      error_callback: (error: any) => {
        console.error('❌ Error en autenticación OAuth:', error);
        accessToken = null;
      }
    });

    return true;
  } catch (error) {
    console.error('Error inicializando Google APIs:', error);
    return false;
  }
}

/**
 * Iniciar flujo de autenticación OAuth con Google Drive
 */
export async function authenticateWithGoogleDrive(): Promise<boolean> {
  try {
    if (!gisLoaded || !tokenClient) {
      const initialized = await initializeGoogleApis();
      if (!initialized) return false;
    }

    // Verificar si ya tenemos token válido
    if (accessToken) {
      const isValid = await validateAccessToken();
      if (isValid) return true;
    }

    // Solicitar nuevo token
    return new Promise((resolve) => {
      tokenClient.callback = (response: any) => {
        if (response.access_token) {
          accessToken = response.access_token;
          window.gapi.client.setToken({ access_token: accessToken });
          resolve(true);
        } else {
          console.error('No se obtuvo token de acceso:', response);
          resolve(false);
        }
      };

      tokenClient.requestAccessToken();
    });
  } catch (error) {
    console.error('Error en autenticación:', error);
    return false;
  }
}

/**
 * Validar token de acceso actual
 */
async function validateAccessToken(): Promise<boolean> {
  if (!accessToken) return false;

  try {
    // Verificar token llamando a una API simple
    await window.gapi.client.drive.about.get({ fields: 'user' });
    return true;
  } catch (error) {
    console.log('Token inválido o expirado:', error);
    accessToken = null;
    return false;
  }
}

/**
 * Obtener información del usuario autenticado
 */
export async function getUserInfo(): Promise<{ email: string; name?: string; picture?: string } | null> {
  try {
    if (!accessToken) return null;

    const response = await window.gapi.client.drive.about.get({ fields: 'user' });
    const user = response.result.user;
    return {
      email: user.emailAddress,
      name: user.displayName,
      picture: user.photoLink
    };
  } catch (error) {
    console.error('Error obteniendo información del usuario:', error);
    return null;
  }
}

/**
 * Cerrar sesión y limpiar tokens
 */
export function disconnectFromGoogleDrive(): void {
  if (accessToken) {
    window.google.accounts.oauth2.revoke(accessToken, () => {
      console.log('Token revocado');
    });
  }
  accessToken = null;
  window.gapi.client.setToken(null);
  localStorage.removeItem('valpa_google_drive_token');
}

/**
 * Obtener o crear la carpeta de SaludValpa en Google Drive
 */
async function getOrCreateValpaFolder(): Promise<string | null> {
  try {
    // Buscar carpeta existente
    const response = await window.gapi.client.drive.files.list({
      q: `name='${APP_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
      spaces: 'drive'
    });

    if (response.result.files && response.result.files.length > 0) {
      return response.result.files[0].id;
    }

    // Crear nueva carpeta
    const createResponse = await window.gapi.client.drive.files.create({
      resource: {
        name: APP_FOLDER_NAME,
        mimeType: 'application/vnd.google-apps.folder'
      },
      fields: 'id'
    });

    return createResponse.result.id;
  } catch (error) {
    console.error('Error creando/obteniendo carpeta de SaludValpa:', error);
    return null;
  }
}

/**
 * Obtener o crear carpeta de backups dentro de SaludValpa
 */
async function getOrCreateBackupFolder(parentFolderId: string): Promise<string | null> {
  try {
    // Buscar carpeta existente
    const response = await window.gapi.client.drive.files.list({
      q: `name='${BACKUP_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and '${parentFolderId}' in parents and trashed=false`,
      fields: 'files(id, name)',
      spaces: 'drive'
    });

    if (response.result.files && response.result.files.length > 0) {
      return response.result.files[0].id;
    }

    // Crear nueva carpeta
    const createResponse = await window.gapi.client.drive.files.create({
      resource: {
        name: BACKUP_FOLDER_NAME,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentFolderId]
      },
      fields: 'id'
    });

    return createResponse.result.id;
  } catch (error) {
    console.error('Error creando/obteniendo carpeta de backups:', error);
    return null;
  }
}

/**
 * Generar metadatos para un respaldo
 */
function generateBackupMetadata(data: RespaldoCompleto): CloudBackupMetadata {
  const deviceId = localStorage.getItem('valpa_device_id') || 
                   `device-${Math.random().toString(36).substr(2, 9)}`;
  
  if (!localStorage.getItem('valpa_device_id')) {
    localStorage.setItem('valpa_device_id', deviceId);
  }

  // Calcular hash simple (para Fase 1)
  const dataString = JSON.stringify(data);
  const hash = btoa(String.fromCharCode(...new TextEncoder().encode(dataString).slice(0, 32)));

  return {
    version: '1.0',
    createdAt: new Date().toISOString(),
    deviceId,
    appVersion: '3.0',
    hash,
    dataSize: new Blob([dataString]).size,
    recordCounts: {
      pacientes: data.pacientes.length,
      sesiones: data.sesiones.length,
      citas: data.citas.length,
      documentos: data.documentos.length,
      servicios: data.servicios?.length || 0,
      cotizaciones: data.cotizaciones?.length || 0,
      recibos: data.recibos?.length || 0,
      biblioteca: data.biblioteca?.length || 0,
    }
  };
}

/**
 * Subir respaldo a Google Drive
 */
export async function uploadBackupToCloud(backupData: RespaldoCompleto): Promise<{ success: boolean; message: string; backupId?: string }> {
  try {
    // Verificar autenticación
    const isAuthenticated = await authenticateWithGoogleDrive();
    if (!isAuthenticated) {
      return {
        success: false,
        message: 'No se pudo autenticar con Google Drive. Por favor, conecta tu cuenta primero.'
      };
    }

    // Generar metadatos
    const metadata = generateBackupMetadata(backupData);
    const cloudBackup: CloudBackup = {
      metadata,
      data: backupData
    };

    // Obtener carpetas
    const valpaFolderId = await getOrCreateValpaFolder();
    if (!valpaFolderId) {
      return {
        success: false,
        message: 'No se pudo crear la carpeta de SaludValpa en Google Drive.'
      };
    }

    const backupFolderId = await getOrCreateBackupFolder(valpaFolderId);
    if (!backupFolderId) {
      return {
        success: false,
        message: 'No se pudo crear la carpeta de backups en Google Drive.'
      };
    }

    // Crear nombre de archivo con timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `saludvalpa-backup-${timestamp}.json`;

    // Convertir a JSON
    const jsonContent = JSON.stringify(cloudBackup, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });

    // Crear metadata del archivo
    const fileMetadata = {
      name: fileName,
      mimeType: 'application/json',
      parents: [backupFolderId],
      description: `Respaldo de SaludValpa - ${metadata.createdAt} - ${metadata.recordCounts.pacientes} pacientes`
    };

    // Crear FormData para upload multipart
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(fileMetadata)], { type: 'application/json' }));
    form.append('file', blob);

    // Subir archivo usando fetch con token de acceso
    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: form
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Error subiendo archivo');
    }

    const result = await response.json();

    return {
      success: true,
      message: `✅ Respaldo subido exitosamente a Google Drive: ${fileName}`,
      backupId: result.id
    };

  } catch (error: any) {
    console.error('Error subiendo respaldo a Google Drive:', error);
    return {
      success: false,
      message: `❌ Error subiendo respaldo: ${error.message || 'Error desconocido'}`
    };
  }
}

/**
 * Listar respaldos disponibles en Google Drive
 */
export async function listAvailableBackups(): Promise<{ success: boolean; backups: BackupVersion[]; message?: string }> {
  try {
    // Verificar autenticación
    const isAuthenticated = await authenticateWithGoogleDrive();
    if (!isAuthenticated) {
      return {
        success: false,
        backups: [],
        message: 'No se pudo autenticar con Google Drive.'
      };
    }

    // Obtener carpetas
    const valpaFolderId = await getOrCreateValpaFolder();
    if (!valpaFolderId) {
      return {
        success: false,
        backups: [],
        message: 'No se encontró la carpeta de SaludValpa en Google Drive.'
      };
    }

    const backupFolderId = await getOrCreateBackupFolder(valpaFolderId);
    if (!backupFolderId) {
      return {
        success: false,
        backups: [],
        message: 'No se encontró la carpeta de backups en Google Drive.'
      };
    }

    // Listar archivos en la carpeta de backups
    const response = await window.gapi.client.drive.files.list({
      q: `'${backupFolderId}' in parents and mimeType='application/json' and trashed=false and name contains 'saludvalpa-backup-'`,
      fields: 'files(id, name, createdTime, modifiedTime, size, description)',
      orderBy: 'createdTime desc',
      pageSize: 50
    });

    const files = response.result.files || [];
    const backups: BackupVersion[] = [];

    // Procesar cada archivo para extraer metadatos básicos
    for (const file of files) {
      try {
        // Obtener contenido para extraer metadatos
        const fileResponse = await window.gapi.client.drive.files.get({
          fileId: file.id!,
          alt: 'media'
        });

        const backupData = fileResponse.result as CloudBackup;
        
        backups.push({
          id: file.id!,
          name: file.name!,
          createdTime: file.createdTime!,
          modifiedTime: file.modifiedTime!,
          size: parseInt(file.size || '0'),
          metadata: backupData.metadata
        });
      } catch (error) {
        console.warn(`No se pudo procesar archivo ${file.name}:`, error);
        // Agregar versión básica sin metadatos completos
        backups.push({
          id: file.id!,
          name: file.name!,
          createdTime: file.createdTime!,
          modifiedTime: file.modifiedTime!,
          size: parseInt(file.size || '0'),
          metadata: {
            version: '1.0',
            createdAt: file.createdTime!,
            deviceId: 'desconocido',
            appVersion: '3.0',
            hash: '',
            dataSize: parseInt(file.size || '0'),
            recordCounts: {
              pacientes: 0,
              sesiones: 0,
              citas: 0,
              documentos: 0,
              servicios: 0,
              cotizaciones: 0,
              recibos: 0,
              biblioteca: 0
            }
          }
        });
      }
    }

    return {
      success: true,
      backups
    };

  } catch (error: any) {
    console.error('Error listando respaldos:', error);
    return {
      success: false,
      backups: [],
      message: `❌ Error listando respaldos: ${error.message || 'Error desconocido'}`
    };
  }
}

/**
 * Descargar respaldo específico desde Google Drive
 */
export async function downloadBackupFromCloud(backupId: string): Promise<{ success: boolean; data?: CloudBackup; message: string }> {
  try {
    // Verificar autenticación
    const isAuthenticated = await authenticateWithGoogleDrive();
    if (!isAuthenticated) {
      return {
        success: false,
        message: 'No se pudo autenticar con Google Drive.'
      };
    }

    // Descargar archivo
    const response = await window.gapi.client.drive.files.get({
      fileId: backupId,
      alt: 'media'
    });

    const backupData = response.result as CloudBackup;

    // Validar estructura básica
    if (!backupData.metadata || !backupData.data) {
      throw new Error('El archivo de respaldo no tiene el formato correcto.');
    }

    return {
      success: true,
      data: backupData,
      message: '✅ Respaldo descargado exitosamente'
    };

  } catch (error: any) {
    console.error('Error descargando respaldo:', error);
    return {
      success: false,
      message: `❌ Error descargando respaldo: ${error.message || 'Error desconocido'}`
    };
  }
}