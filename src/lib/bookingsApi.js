import { supabase } from "./supabaseClient";

const isoDateToUtcMs = (iso) => {
  if (!iso || typeof iso !== "string") return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split("-").map((x) => Number(x));
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;
  const ms = Date.UTC(y, m - 1, d);
  if (!Number.isFinite(ms)) return null;
  return ms;
};

const diffNights = (checkIn, checkOut) => {
  const a = isoDateToUtcMs(checkIn);
  const b = isoDateToUtcMs(checkOut);
  if (a == null || b == null) return 0;
  const ms = b - a;
  const days = Math.floor(ms / 86400000);
  return days > 0 ? days : 0;
};

export const createBookingRequest = async ({
  room,
  user,
  checkIn,
  checkOut,
  guests,
  specialRequests,
}) => {
  if (!user?.id) throw new Error("You must be logged in.");
  if (!user?.profile?.id) throw new Error("Profile is not loaded yet.");
  if (!room?.id) throw new Error("Room is missing.");

  const nights = diffNights(checkIn, checkOut);
  if (!nights) throw new Error("Please select valid check-in and check-out dates.");

  const g = Number(guests);
  if (!Number.isFinite(g) || g < 1) throw new Error("Guests must be 1 or more.");

  const pricePerNight = Number(room.base_price_per_night);
  if (!Number.isFinite(pricePerNight) || pricePerNight < 0) throw new Error("Room price is invalid.");

  const total = pricePerNight * nights;

  const payload = {
    room_id: room.id,
    user_id: user.profile.id,
    auth_id: user.id,
    status: "pending",
    check_in: checkIn,
    check_out: checkOut,
    guests: g,
    price_per_night: pricePerNight,
    total_amount: total,
    currency: room.currency || "USD",
    customer_first_name: user.profile.first_name || null,
    customer_last_name: user.profile.last_name || null,
    customer_email: user.email || null,
    customer_phone: user.profile.phone || null,
    special_requests: specialRequests?.trim() || null,
  };

  const { data, error } = await supabase
    .from("Bookings")
    .insert(payload)
    .select("id")
    .single();

  if (error) throw error;
  return data;
};
