const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

if (!CLOUD_NAME || !UPLOAD_PRESET) {
  throw new Error("Missing Cloudinary environment variables. Check your .env file.");
}

/**
 * Upload a file to Cloudinary using an unsigned upload preset.
 * Returns the secure URL of the uploaded asset.
 */
export async function uploadToCloudinary(
  file: File,
  folder = "solo-english"
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message ?? "Cloudinary upload failed");
  }

  const data = await res.json();
  return data.secure_url as string;
}

/**
 * Build a Cloudinary image URL with optional transformations.
 * Example: cloudinaryUrl("sample.jpg", "w_400,h_400,c_fill")
 */
export function cloudinaryUrl(publicId: string, transforms = ""): string {
  const t = transforms ? `${transforms}/` : "";
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${t}${publicId}`;
}
