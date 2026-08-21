"use client";
import { useLocalStorage } from "usehooks-ts";
import { setCookie, deleteCookie } from "cookies-next";
import { FbCache } from "@/app/_firebase/types";
import ThemeSelector from "./_components/ThemeSelector";
import TimeFormatSelector, {
  TimeFormat,
} from "./_components/TimeFormatSelector";
import ShareButton from "./_components/ShareButton";
import ClearCacheButton from "./_components/ClearCacheButton";
import styles from "./page.module.sass";

const getDate = (dateString?: number) =>
  dateString && new Date(dateString).toString();

export default function Page() {
  const [settings, setSettings] = useLocalStorage<{
    theme: number;
    timeFormat: TimeFormat;
  }>(
    "userSettings",
    { theme: 1, timeFormat: "24h" },
    { initializeWithValue: false },
  );

  const [fbCache] = useLocalStorage<FbCache | { updatedAt: undefined }>(
    "fbCache",
    {
      updatedAt: undefined,
    },
    { initializeWithValue: false },
  );

  const updateSetting = <K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K],
  ) => {
    const expires = new Date(Date.now() + 86400 * 1000 * 365 * 5);
    setCookie(key, value, { expires });
    setSettings({ ...settings, [key]: value });
  };

  const setTheme = (idx: number) => updateSetting("theme", idx);
  const setTimeFormat = (format: TimeFormat) =>
    updateSetting("timeFormat", format);

  return (
    <main className={styles.root}>
      <h1 className="util-margin--b">Settings</h1>
      <section>
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
      <section>
        <h2>Theme</h2>
        <ThemeSelector
          selectedTheme={settings.theme}
          onThemeChange={setTheme}
        />
      </section>
      <section>
        <h2>Time format</h2>
        <TimeFormatSelector
          selectedFormat={settings.timeFormat}
          onFormatChange={setTimeFormat}
        />
      </section>
      <section>
        <h2>Share this app</h2>
        <ShareButton />
      </section>
      <section>
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
      <section>
        <h2>Latest database update</h2>
        <p>{getDate(fbCache.updatedAt)}</p>
      </section>
      <section>
        <h2>
          Version number: <span>{process.env.version}</span>
        </h2>
        <ClearCacheButton />
      </section>
    </main>
  );
}
