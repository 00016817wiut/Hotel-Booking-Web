import { supabase } from "./supabaseClient";
import { cacheGet, cacheSet } from "./cache";

const roomByIdCache = new Map();

const ROOMS_ACTIVE_KEY = "cache:rooms:active:v1";
const ROOM_KEY = (id) => `cache:room:${id}:v1`;

export const fetchActiveRooms = async () => {
  const cached = cacheGet(ROOMS_ACTIVE_KEY, { maxAgeMs: 5 * 60 * 1000, storage: localStorage });
  if (cached) return cached;

  const { data, error } = await supabase
    .from("Rooms")
    .select(
      "id,name,room_number,type,description,capacity,beds,bathrooms,size_sqm,base_price_per_night,currency,images,videos,is_active,created_at,updated_at"
    )
    .eq("is_active", true)
    .order("id", { ascending: true });

  if (error) throw error;
  const rows = Array.isArray(data) ? data : [];
  cacheSet(ROOMS_ACTIVE_KEY, rows, { storage: localStorage });
  return rows;
};

export const fetchAvailableRooms = async ({ checkIn, checkOut, guests, type }) => {
  const payload = {
    p_check_in: checkIn,
    p_check_out: checkOut,
    p_guests: guests,
    p_type: type ?? null,
  };

  const { data, error } = await supabase.rpc("available_rooms", payload);
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const fetchRoomById = async (id) => {
  const key = String(id);
  if (roomByIdCache.has(key)) return roomByIdCache.get(key);

  const cached = cacheGet(ROOM_KEY(key), { maxAgeMs: 10 * 60 * 1000, storage: localStorage });
  if (cached) {
    roomByIdCache.set(key, cached);
    return cached;
  }

  const { data, error } = await supabase
    .from("Rooms")
    .select(
      "id,name,room_number,type,description,capacity,beds,bathrooms,size_sqm,base_price_per_night,currency,images,videos,is_active,created_at,updated_at"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  const room = data ?? null;
  roomByIdCache.set(key, room);
  cacheSet(ROOM_KEY(key), room, { storage: localStorage });
  return room;
};
