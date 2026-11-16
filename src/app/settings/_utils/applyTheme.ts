// The theme class lives on <html> so the inline script in layout.tsx can set it
// before first paint (no flash of the default theme). Keep THEME_SCRIPT and
// applyTheme in sync with the "userSettings" localStorage key and defaultUserSettings.

export const THEME_SCRIPT = `(function(){var t=1;try{var s=JSON.parse(localStorage.getItem("userSettings"));if(s&&typeof s.theme==="number")t=s.theme}catch(e){}document.documentElement.classList.add("Theme--"+t)})()`;

export function applyTheme(theme: number) {
  const cl = document.documentElement.classList;
  Array.from(cl).filter((c) => c.startsWith("Theme--")).forEach((c) => cl.remove(c));
  cl.add(`Theme--${theme}`);
}
