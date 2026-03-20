const toDate = (iso) => new Date(`${iso}T00:00:00`);

export const isValidISODate = (iso) => {
  if (!iso || typeof iso !== "string") return false;
  const d = toDate(iso);
  return d instanceof Date && !Number.isNaN(d.getTime()) && iso === d.toISOString().slice(0, 10);
};

export const rangesOverlap = (aStart, aEnd, bStart, bEnd) => {
  return aStart < bEnd && aEnd > bStart;
};

export const isRoomAvailable = (room, checkIn, checkOut) => {
  if (!isValidISODate(checkIn) || !isValidISODate(checkOut)) return true;

  const start = toDate(checkIn);
  const end = toDate(checkOut);
  if (end <= start) return false;

  const booked = Array.isArray(room.booked) ? room.booked : [];
  for (const range of booked) {
    if (!range?.from || !range?.to) continue;
    if (!isValidISODate(range.from) || !isValidISODate(range.to)) continue;

    const bStart = toDate(range.from);
    const bEnd = toDate(range.to);
    if (rangesOverlap(start, end, bStart, bEnd)) return false;
  }

  return true;
};
