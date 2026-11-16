/** Small shared helpers for unit tests. */
export const readLocal = (key: string) => JSON.parse(localStorage.getItem(key) ?? "null");
export const seedLocal = (key: string, value: unknown) =>
  localStorage.setItem(key, JSON.stringify(value));

/** Icon-only buttons have no text, so find them by their feather icon. */
export const iconButton = (container: HTMLElement, icon: string) =>
  container.querySelector(`.feather-${icon}`)?.closest("button") ?? null;
