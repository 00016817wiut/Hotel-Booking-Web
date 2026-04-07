const now = () => Date.now();

const mem = new Map();

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const cacheGet = (key, { maxAgeMs = 0, storage = null } = {}) => {
  const hit = mem.get(key);
  if (hit && (!maxAgeMs || now() - hit.t <= maxAgeMs)) return hit.v;

  if (!storage) return null;
  const raw = storage.getItem(key);
  if (!raw) return null;
  const parsed = safeParse(raw);
  if (!parsed || typeof parsed !== "object") return null;
  if (typeof parsed.t !== "number") return null;
  if (maxAgeMs && now() - parsed.t > maxAgeMs) return null;
  mem.set(key, parsed);
  return parsed.v ?? null;
};

export const cacheSet = (key, value, { storage = null } = {}) => {
  const payload = { t: now(), v: value };
  mem.set(key, payload);
  if (!storage) return;
  try {
    storage.setItem(key, JSON.stringify(payload));
  } catch {
    // ignore quota/errors
  }
};
