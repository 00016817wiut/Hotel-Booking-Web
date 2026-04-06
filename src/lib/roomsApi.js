import { supabase } from "./supabaseClient";

const roomByIdCache = new Map();

export const fetchActiveRooms = async () => {
  const { data, error } = await supabase
    .from("Rooms")
    .select(
      "id,name,room_number,type,description,capacity,beds,bathrooms,size_sqm,base_price_per_night,currency,images,videos,is_active,created_at,updated_at"
    )
    .eq("is_active", true)
    .order("id", { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
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
  return room;
};
