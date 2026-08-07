import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { storage } from "@/lib/firebase";

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

export async function uploadReportImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please select an image file.");
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("Images must be smaller than 10 MB.");
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const imageRef = ref(
    storage,
    `reports/${Date.now()}-${crypto.randomUUID()}-${safeName}`
  );

  await uploadBytes(imageRef, file, { contentType: file.type });
  return getDownloadURL(imageRef);
}
