"use client";
import { useLocalStorage } from "usehooks-ts";
import { FbCache } from "@/app/_firebase/types";
const themes: string[] = ["default", "green"];
const getDate = (dateString?: number) =>
  dateString && new Date(dateString).toString();

export default function Page() {
  const [settings, setSettings] = useLocalStorage<{ theme: number | null }>(
    "userSettings",
    { theme: null },
  );

  const [fbCache] = useLocalStorage<FbCache | { updatedAt: undefined }>(
    "fbCache",
    {
      updatedAt: undefined,
    },
  );

  const setTheme = (idx: number) => {
    setSettings({ ...settings, theme: idx });
  };

  const clearCache = () => {
    console.log("clear caches");
  };

  return (
    <main>
      <h1 className="Margin--b">Settings</h1>
      <section className="Section">
        <h2>Add to homescreen</h2>
        <p>To add this app to your homescreen:</p>
        <p>
          <strong>On IOS</strong> click the share button and find the 'add to
          homescreen' grey icon.
        </p>
        <p>
          <strong>On Android</strong> click the chrome menu button and then 'add
          to homescreen'.
        </p>
      </section>
      <section className="Section">
        <h2>Theme</h2>
        <ul>
          {themes.map((theme, idx) => (
            <li key={idx}>
              <button onClick={() => setTheme(idx)}>{theme}</button>
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
          if you're a nerd. You can also message me on{" "}
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
        <h2>Version number</h2>
        {/* <p>{version}</p> */}
      </section>
      <section className="Section">
        <button onClick={clearCache} className="Btn__flex">
          Clear local cache
          <span className="material-icons">sync</span>
        </button>
      </section>
    </main>
  );
}
