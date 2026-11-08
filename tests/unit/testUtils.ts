/** Small shared helpers for unit tests. */
export const readLocal = (key: string) => JSON.parse(localStorage.getItem(key) ?? "null");
export const seedLocal = (key: string, value: unknown) =>
  localStorage.setItem(key, JSON.stringify(value));

export const cookies = (): Record<string, string> =>
  Object.fromEntries(
    document.cookie
      .split(";")
      .map((c) => c.trim())
      .filter(Boolean)
      .map((c) => {
        const [k, ...v] = c.split("=");
        return [k, decodeURIComponent(v.join("="))];
      }),
  );

/** Icon-only buttons have no text, so find them by their feather icon. */
export const iconButton = (container: HTMLElement, icon: string) =>
  container.querySelector(`.feather-${icon}`)?.closest("button") ?? null;
