import { describe, it, expect, vi, afterEach } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SettingsPage from "@/app/settings/page";
import ClearCacheButton from "@/app/settings/_components/ClearCacheButton";
import { defaultUserSettings } from "@/app/settings/_utils/types";
import { cookies, readLocal, seedLocal } from "./testUtils";

afterEach(() => {
  vi.useRealTimers();
});

describe("Settings page", () => {
  it("saves the theme to a cookie and localStorage without losing other settings", async () => {
    seedLocal("userSettings", { theme: 1, timeFormat: "12h", teamDisplaySettings: { a: { spaced: true } } });
    render(<SettingsPage />);

    await userEvent.click(screen.getByRole("button", { name: "Midnight" }));

    expect(cookies().theme).toBe("2");
    expect(readLocal("userSettings")).toEqual({
      theme: 2,
      timeFormat: "12h",
      teamDisplaySettings: { a: { spaced: true } },
    });
  });

  it("saves the time format", async () => {
    render(<SettingsPage />);
    await userEvent.click(screen.getByRole("button", { name: /12-hour/ }));

    expect(cookies().timeFormat).toBe("12h");
    expect(readLocal("userSettings").timeFormat).toBe("12h");
  });

  it("highlights the saved theme", async () => {
    seedLocal("userSettings", { ...defaultUserSettings, theme: 5 });
    render(<SettingsPage />);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Synthwave" }).className).toMatch(/Selected/),
    );
    expect(screen.getByRole("button", { name: "Default" }).className).not.toMatch(/Selected/);
  });

  it("shows when the database was last updated", async () => {
    const updatedAt = Date.UTC(2026, 10, 1, 9, 30);
    seedLocal("fbCache", { updatedAt, leaguesHash: "", teamDataHash: "", teamsHash: "" });
    render(<SettingsPage />);

    const heading = screen.getByRole("heading", { name: "Latest database update" });
    await waitFor(() =>
      expect(heading.nextElementSibling).toHaveTextContent(new Date(updatedAt).toString()),
    );
  });

  it("shows nothing for the update date before the first sync", () => {
    render(<SettingsPage />);
    const heading = screen.getByRole("heading", { name: "Latest database update" });
    expect(heading.nextElementSibling).toBeEmptyDOMElement();
  });
});

describe("ClearCacheButton", () => {
  function seedEverything() {
    for (const key of ["userTeams", "userLeagues", "allTeams", "allLeagues"]) {
      seedLocal(key, [{ id: "x" }]);
    }
    seedLocal("fbCache", { updatedAt: 1 });
    seedLocal("somethingElse", "keep me");
    seedLocal("userSettings", { theme: 4, timeFormat: "12h", teamDisplaySettings: { a: { spaced: true } } });
    document.cookie = "theme=4; path=/";
    document.cookie = "timeFormat=12h; path=/";
  }

  it("removes saved teams, leagues and lists, and resets settings and cookies", async () => {
    seedEverything();
    render(<ClearCacheButton />);

    await userEvent.click(screen.getByRole("button", { name: "Clear local cache" }));

    for (const key of ["userTeams", "userLeagues", "allTeams", "allLeagues"]) {
      expect(localStorage.getItem(key), key).toBeNull();
    }
    expect(readLocal("userSettings")).toEqual(defaultUserSettings);
    expect(cookies()).not.toHaveProperty("theme");
    expect(cookies()).not.toHaveProperty("timeFormat");
  });

  it("leaves fbCache and unrelated keys alone", async () => {
    seedEverything();
    render(<ClearCacheButton />);
    await userEvent.click(screen.getByRole("button", { name: "Clear local cache" }));

    expect(readLocal("fbCache")).toEqual({ updatedAt: 1 });
    expect(readLocal("somethingElse")).toBe("keep me");
  });

  it("confirms for 2 seconds then resets the button", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<ClearCacheButton />);

    await user.click(screen.getByRole("button", { name: "Clear local cache" }));
    expect(screen.getByText("Cache dropped!")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByRole("button", { name: "Clear local cache" })).toBeInTheDocument();
  });
});
