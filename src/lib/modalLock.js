let openCount = 0;

const getBody = () => {
  if (typeof document === "undefined") return null;
  return document.body || null;
};

export const acquireModalLock = () => {
  const body = getBody();
  if (!body) return;

  openCount += 1;
  if (openCount === 1) body.classList.add("modal-open");
};

export const releaseModalLock = () => {
  const body = getBody();
  if (!body) return;

  openCount = Math.max(0, openCount - 1);
  if (openCount === 0) body.classList.remove("modal-open");
};
