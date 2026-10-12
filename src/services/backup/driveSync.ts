import { db } from '../../db';

export interface BackupPayload {
  version: number;
  app: 'HoneyBudget';
  exportedAt: string;
  data: {
    accounts: any[];
    categories: any[];
    transactions: any[];
    currencies: any[];
    settings: any[];
  };
}

/**
 * Generate full JSON backup payload
 */
export const generateBackupData = async (): Promise<BackupPayload> => {
  const accounts = await db.accounts.toArray();
  const categories = await db.categories.toArray();
  const transactions = await db.transactions.toArray();
  const currencies = await db.currencies.toArray();
  const settings = await db.settings.toArray();

  return {
    version: 1,
    app: 'HoneyBudget',
    exportedAt: new Date().toISOString(),
    data: {
      accounts,
      categories,
      transactions,
      currencies,
      settings,
    },
  };
};

/**
 * Restore database from validated payload
 */
export const restoreBackupData = async (payload: BackupPayload): Promise<boolean> => {
  if (!payload || payload.app !== 'HoneyBudget' || !payload.data) {
    throw new Error('Format de fichier de sauvegarde invalide.');
  }

  await db.transaction('rw', [db.accounts, db.categories, db.transactions, db.currencies, db.settings], async () => {
    await db.accounts.clear();
    await db.categories.clear();
    await db.transactions.clear();
    await db.currencies.clear();
    await db.settings.clear();

    if (payload.data.accounts?.length) await db.accounts.bulkAdd(payload.data.accounts);
    if (payload.data.categories?.length) await db.categories.bulkAdd(payload.data.categories);
    if (payload.data.transactions?.length) await db.transactions.bulkAdd(payload.data.transactions);
    if (payload.data.currencies?.length) await db.currencies.bulkAdd(payload.data.currencies);
    if (payload.data.settings?.length) await db.settings.bulkAdd(payload.data.settings);
  });

  return true;
};

// --- Web Crypto AES-GCM helpers for client-side privacy ---

const stringToArrayBuffer = (str: string): Uint8Array => {
  return new TextEncoder().encode(str);
};

const arrayBufferToString = (buffer: ArrayBuffer): string => {
  return new TextDecoder().decode(buffer);
};

export const encryptData = async (plainText: string, passphrase: string): Promise<string> => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    stringToArrayBuffer(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const encryptedContent = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    stringToArrayBuffer(plainText)
  );

  const combined = new Uint8Array(salt.length + iv.length + encryptedContent.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encryptedContent), salt.length + iv.length);

  // Return base64 with marker
  let binary = '';
  for (let i = 0; i < combined.length; i++) {
    binary += String.fromCharCode(combined[i]);
  }
  return `HONEY_ENC:${btoa(binary)}`;
};

export const decryptData = async (cipherTextWithMarker: string, passphrase: string): Promise<string> => {
  if (!cipherTextWithMarker.startsWith('HONEY_ENC:')) {
    throw new Error('Fichier non chiffré ou format incompatible.');
  }

  const base64 = cipherTextWithMarker.slice('HONEY_ENC:'.length);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  const salt = bytes.slice(0, 16);
  const iv = bytes.slice(16, 28);
  const cipherData = bytes.slice(28);

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    stringToArrayBuffer(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    cipherData
  );

  return arrayBufferToString(decryptedBuffer);
};

// --- Local JSON File Export & Import ---

export interface SaveResult {
  method: 'file-system-picker' | 'web-share' | 'download';
  success: boolean;
}

/**
 * Export local data file:
 * 1. Desktop: File System Access API
 * 2. Mobile: Web Share API
 * 3. Fallback: Standard browser download
 */
export const exportLocalBackup = async (passphrase?: string): Promise<SaveResult> => {
  const data = await generateBackupData();
  let content = JSON.stringify(data, null, 2);
  let fileName = `HoneyBudget_Sauvegarde_${new Date().toISOString().split('T')[0]}.json`;

  if (passphrase && passphrase.trim().length > 0) {
    content = await encryptData(content, passphrase.trim());
    fileName = `HoneyBudget_Sauvegarde_${new Date().toISOString().split('T')[0]}.honey.enc`;
  }

  const blob = new Blob([content], { type: 'application/json' });
  const file = new File([blob], fileName, { type: 'application/json' });

  // 1. Try Web Share API (especially on mobile)
  if (typeof navigator !== 'undefined' && 'canShare' in navigator && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'HoneyBudget Sauvegarde',
        text: 'Sauvegarde de vos comptes et budgets HoneyBudget',
      });
      return { method: 'web-share', success: true };
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.warn('Web Share failed, fallback to file picker/download', err);
      } else {
        return { method: 'web-share', success: false };
      }
    }
  }

  // 2. Try File System Access API
  if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: fileName,
        types: [
          {
            description: 'Sauvegarde HoneyBudget (JSON)',
            accept: { 'application/json': ['.json', '.enc'] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(content);
      await writable.close();
      return { method: 'file-system-picker', success: true };
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.warn('showSaveFilePicker failed, fallback to download', err);
      } else {
        return { method: 'file-system-picker', success: false };
      }
    }
  }

  // 3. Fallback: Browser download trigger
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return { method: 'download', success: true };
};

// Backwards-compatibility alias
export const saveBackupWithoutGCP = exportLocalBackup;
