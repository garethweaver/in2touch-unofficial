"use client";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { FbCache } from "@/app/_firebase/types";
import Button from "@/app/_components/Button";
import "./page.sass";

const themes: string[] = [
  "Default",
  "Midnight",
  "Candyfloss",
  "Eagles",
  "Synthwave",
  "Triple-threat",
  "Accsessible",
];

const getDate = (dateString?: number) =>
  dateString && new Date(dateString).toString();

export default function Page() {
  const [decached, setDecached] = useState<boolean>(false);

  const [settings, setSettings] = useLocalStorage<{
    theme: number;
  }>("userSettings", { theme: 0 }, { initializeWithValue: false });

  const [fbCache] = useLocalStorage<FbCache | { updatedAt: undefined }>(
    "fbCache",
    {
      updatedAt: undefined,
    },
    { initializeWithValue: false },
  );

  const setTheme = (idx: number) => {
    setSettings({ ...settings, theme: idx });
  };

  const clearCache = () => {
    setDecached(true);
    localStorage.removeItem("userTeams");
    localStorage.removeItem("userLeagues");
    localStorage.removeItem("allTeams");
    localStorage.removeItem("allLeagues");
    setSettings({ theme: 1 });
    setTimeout(() => {
      setDecached(false);
    }, 2000);
  };

  return (
    <main>
      <h1 className="Margin--b">Settings</h1>
      <section className="Section">
        <h2>Add to homescreen</h2>
        <p>To add this app to your homescreen:</p>
        <p>
          <strong>On IOS</strong> click the share button and find the &lsquo;add
          to homescreen&rsquo; grey icon.
        </p>
        <p>
          <strong>On Android</strong> click the chrome menu button and then
          &lsquo;add to homescreen&rsquo;.
        </p>
      </section>
      <section className="Section">
        <h2>Theme</h2>
        <ul className="ThemeButtons">
          {themes.map((theme, idx) => (
            <li key={idx}>
              <button
                className={`ThemeButton--${idx + 1} ${
                  settings.theme === idx + 1 ? "ThemeButton--selected" : ""
                }`}
                onClick={() => setTheme(idx + 1)}
              >
                <span />
                {theme}
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className="Section">
        <h2>Free to use!</h2>
        <p>
          This is a free to use app created by{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.garethweaver.com"
          >
            Gareth Weaver
          </a>
          . You can find me on{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/garethweaver"
          >
            github
          </a>{" "}
          if you&apos;re a nerd. You can also message me on{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.linkedin.com/in/garethweaver/"
          >
            linkedin
          </a>{" "}
          if you have any questions or comments.
        </p>
      </section>
      <section className="Section">
        <h2>Latest database update</h2>
        <p>{getDate(fbCache.updatedAt)}</p>
      </section>
      <section className="Section">
        <h2>
          Version number: <span>{process.env.version}</span>
        </h2>
        {decached ? (
          <Button icon="check" faux>
            Cache dropped!
          </Button>
        ) : (
          <Button icon="zap" onClick={clearCache}>
            Clear local cache
          </Button>
        )}
      </section>
    </main>
  );
}
