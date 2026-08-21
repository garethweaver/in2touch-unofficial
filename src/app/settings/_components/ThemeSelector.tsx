import styles from "./ThemeSelector.module.sass";

const themes = [
  "Default",
  "Midnight",
  "Candyfloss",
  "Eagles",
  "Synthwave",
  "Triple-threat",
  "High-contrast",
] as const;

export default function ThemeSelector({
  selectedTheme,
  onThemeChange,
}: {
  readonly selectedTheme: number;
  readonly onThemeChange: (theme: number) => void;
}) {
  return (
    <ul className={styles.themeButtons}>
      {themes.map((theme, idx) => (
        <li key={idx}>
          <button
            className={`themeButton--${idx + 1} ${
              selectedTheme === idx + 1 ? styles.themeButtonSelected : ""
            }`}
            onClick={() => onThemeChange(idx + 1)}
          >
            <span />
            {theme}
          </button>
        </li>
      ))}
    </ul>
  );
}
