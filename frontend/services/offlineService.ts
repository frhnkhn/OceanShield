"use client";

import { createReport } from "./reportService";
import { ReportDraft } from "@/types/report";

export interface QueuedReport {
  id: string;
  report: ReportDraft;
  timestamp: string;
  localImage?: string; // base64 representation of the image
}

const DB_NAME = "OceanShieldOfflineDB";
const DB_VERSION = 1;
const STORE_NAME = "reports";

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
}

export function isOnline(): boolean {
  if (typeof window === "undefined") return true;
  return window.navigator.onLine;
}

export async function getQueuedReports(): Promise<QueuedReport[]> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  } catch (err) {
    console.error("IndexedDB error:", err);
    return [];
  }
}

export async function saveQueuedReports(queue: QueuedReport[]): Promise<void> {
  try {
    const db = await getDB();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    
    // Clear all first to sync state
    store.clear();
    for (const item of queue) {
      store.put(item);
    }
  } catch (err) {
    console.error("IndexedDB error:", err);
  }
}

// Client side image compression
async function compressImage(file: File, maxWidth = 1024, maxHeight = 1024, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("Image load failed"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function queueOfflineReport(report: ReportDraft, file?: File | null): Promise<void> {
  let localImage: string | undefined;
  if (file) {
    try {
      localImage = await compressImage(file);
    } catch (e) {
      // Fallback to base64 conversion if compression fails
      localImage = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  }

  const queuedItem: QueuedReport = {
    id: `offline-${Date.now()}-${crypto.randomUUID()}`,
    report,
    timestamp: new Date().toISOString(),
    localImage
  };

  try {
    const db = await getDB();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.put(queuedItem);
  } catch (err) {
    console.error("Failed to store queued report in IndexedDB", err);
  }
  
  // Register sync listeners
  setupAutoSync();
}

let isSyncing = false;

export async function syncOfflineReports(): Promise<number> {
  if (isSyncing || !isOnline()) return 0;
  isSyncing = true;
  
  const queue = await getQueuedReports();
  if (queue.length === 0) {
    isSyncing = false;
    return 0;
  }

  console.log(`Starting synchronization of ${queue.length} offline report(s)...`);
  let syncedCount = 0;
  const remaining: QueuedReport[] = [];

  for (const item of queue) {
    try {
      // Re-submit the report to FastAPI
      await createReport(item.report);
      syncedCount++;
    } catch (err) {
      console.error(`Failed to sync report ${item.id}, keeping in queue:`, err);
      remaining.push(item);
    }
  }

  await saveQueuedReports(remaining);
  isSyncing = false;
  return syncedCount;
}

export function setupAutoSync() {
  if (typeof window === "undefined") return;
  
  // Synchronize on online event
  window.addEventListener("online", () => {
    void syncOfflineReports();
  });

  // Periodically check every 30 seconds
  setInterval(() => {
    void syncOfflineReports();
  }, 30000);
}
