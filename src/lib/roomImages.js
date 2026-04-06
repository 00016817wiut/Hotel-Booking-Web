import { supabase } from "./supabaseClient";

const BUCKET = "room-images";
const PREFIX = "rooms";

const safeName = (name) => {
  const base = String(name || "image")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9._-]/g, "");
  return base || "image";
};

const uniqueId = () => {
  try {
    if (crypto?.randomUUID) return crypto.randomUUID();
  } catch {
    // ignore
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const uploadRoomImage = async ({ roomId, file }) => {
  if (!roomId) throw new Error("roomId is required");
  if (!file) throw new Error("file is required");

  const fileName = safeName(file.name);
  const path = `${PREFIX}/${roomId}/${uniqueId()}-${fileName}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "application/octet-stream",
  });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const url = data?.publicUrl;
  if (!url) throw new Error("Failed to build public URL");

  return { url, path };
};

export const uploadRoomMedia = async ({ roomId, kind, file }) => {
  if (!roomId) throw new Error("roomId is required");
  if (!file) throw new Error("file is required");

  const k = kind === "video" ? "video" : "image";
  const fileName = safeName(file.name);
  const path = `${PREFIX}/${roomId}/${k}/${uniqueId()}-${fileName}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "application/octet-stream",
  });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const url = data?.publicUrl;
  if (!url) throw new Error("Failed to build public URL");

  return { url, path };
};
