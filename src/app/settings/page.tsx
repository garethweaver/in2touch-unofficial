"use client";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { setCookie, deleteCookie } from "cookies-next";
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
  "High-contrast",
];

const getDate = (dateString?: number) =>
  dateString && new Date(dateString).toString();

export default function Page() {
  const [decached, setDecached] = useState<boolean>(false);

  const [settings, setSettings] = useLocalStorage<{
    theme: number;
  }>("userSettings", { theme: 1 }, { initializeWithValue: false });

  const [fbCache] = useLocalStorage<FbCache | { updatedAt: undefined }>(
    "fbCache",
    {
      updatedAt: undefined,
    },
    { initializeWithValue: false },
  );

  const setTheme = (idx: number) => {
    const expires = new Date(Date.now() + 86400 * 1000 * 365 * 5);
    setCookie("theme", idx, { expires });
    setSettings({ ...settings, theme: idx });
  };

  const clearCache = () => {
    setDecached(true);
    localStorage.removeItem("userTeams");
    localStorage.removeItem("userLeagues");
    localStorage.removeItem("allTeams");
    localStorage.removeItem("allLeagues");
    setSettings({ theme: 1 });
    deleteCookie("theme");
    setTimeout(() => {
      setDecached(false);
    }, 2000);
  };

  return (
    <main>
      <h1 className="Margin--b">Settings</h1>
      <section className="Section">
        <h2>Add to homescreen</h2>
        <p>
          You can follow{" "}
          <a
            rel="noreferrer"
            href="https://www.androidauthority.com/add-website-android-iphone-home-screen-3181682/"
            target="_blank"
          >
            this guide
          </a>{" "}
          to add this app to your homescreen or follow the short descriptions
          below.
        </p>
        <p>
          <strong>On IOS:</strong>
          <br />
          click the share button and find the &lsquo;add to homescreen&rsquo;
          grey icon.
        </p>
        <p>
          <strong>On Android Chrome:</strong>
          <br />
          click the chrome menu button and then &lsquo;add to homescreen&rsquo;.
        </p>
        <p>
          <strong>On Samsung Mobile:</strong>
          <br />
          click the browser menu button and then &lsquo;add to&rsquo; then
          &lsquo;home screen&rsquo;.
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
