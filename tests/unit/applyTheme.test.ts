import { describe, it, expect } from "vitest";
import { applyTheme, THEME_SCRIPT } from "@/app/settings/_utils/applyTheme";
import { seedLocal } from "./testUtils";

const runScript = () => new Function(THEME_SCRIPT)();

describe("THEME_SCRIPT", () => {
  it("defaults to theme 1 when nothing is saved", () => {
    runScript();
    expect(document.documentElement).toHaveClass("Theme--1");
  });

  it("applies the saved theme", () => {
    seedLocal("userSettings", { theme: 4, timeFormat: "24h" });
    runScript();
    expect(document.documentElement).toHaveClass("Theme--4");
  });

  it("falls back to theme 1 on corrupt storage", () => {
    localStorage.setItem("userSettings", "{not json");
    runScript();
    expect(document.documentElement).toHaveClass("Theme--1");
  });
});

describe("applyTheme", () => {
  it("replaces the existing theme class and keeps others", () => {
    document.documentElement.classList.add("Theme--3", "other");
    applyTheme(6);
    expect(document.documentElement.className.split(" ").sort()).toEqual(["Theme--6", "other"]);
  });
});
