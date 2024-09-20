"use client";
import { useLocalStorage } from "usehooks-ts";
const themes: string[] = ["default", "green"];

export default function Page() {
  const [settings, setSettings] = useLocalStorage<{ theme: number | null }>(
    "userSettings",
    { theme: null },
  );

  const setTheme = (idx: number) => {
    setSettings({ ...settings, theme: idx });
  };

  return (
    <main>
      <h1>Settings</h1>
      <ul>
        {themes.map((theme, idx) => (
          <li key={idx}>
            <button onClick={() => setTheme(idx)}>{theme}</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
