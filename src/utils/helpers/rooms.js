export const formatMoney = (value, currency = "USD") => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "-";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
  } catch {
    return `$${Math.round(n)}`;
  }
};



export const pickType = (type, checkIn, checkOut, guestsParam, setSearchParams) => {
  const next = {};
  if (checkIn) next.checkIn = checkIn;
  if (checkOut) next.checkOut = checkOut;
  if (guestsParam) next.guests = guestsParam;

  if (type && type !== "any") next.roomType = type;
  setSearchParams(next);
};