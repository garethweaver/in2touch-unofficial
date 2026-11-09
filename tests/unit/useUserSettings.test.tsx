import { describe, it, expect } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useUserSettings } from "@/app/settings/_utils/useUserSettings";
import { defaultUserSettings } from "@/app/settings/_utils/types";
import { readLocal, seedLocal } from "./testUtils";

const saved = {
  theme: 3,
  timeFormat: "12h" as const,
  teamDisplaySettings: { a: { spaced: true } },
};

describe("useUserSettings", () => {
  it("returns the defaults when nothing is saved", () => {
    const { result } = renderHook(() => useUserSettings());
    expect(result.current[0]).toEqual(defaultUserSettings);
  });

  it("loads saved settings", async () => {
    seedLocal("userSettings", saved);
    const { result } = renderHook(() => useUserSettings());
    await waitFor(() => expect(result.current[0]).toEqual(saved));
  });

  it.each([
    ["theme", { theme: 5 }],
    ["timeFormat", { timeFormat: "24h" as const }],
    ["teamDisplaySettings", { teamDisplaySettings: {} }],
  ])("updating only %s keeps every other setting", async (_key, patch) => {
    seedLocal("userSettings", saved);
    const { result } = renderHook(() => useUserSettings());
    await waitFor(() => expect(result.current[0]).toEqual(saved));

    act(() => result.current[1](patch));

    expect(result.current[0]).toEqual({ ...saved, ...patch });
    expect(readLocal("userSettings")).toEqual({ ...saved, ...patch });
  });

  it("keeps two quick updates in a row (no stale overwrite)", async () => {
    seedLocal("userSettings", saved);
    const { result } = renderHook(() => useUserSettings());
    await waitFor(() => expect(result.current[0]).toEqual(saved));

    act(() => {
      result.current[1]({ theme: 6 });
      result.current[1]({ timeFormat: "24h" });
    });

    expect(readLocal("userSettings")).toEqual({ ...saved, theme: 6, timeFormat: "24h" });
  });

  it("keeps separate components in sync", async () => {
    const a = renderHook(() => useUserSettings());
    const b = renderHook(() => useUserSettings());

    act(() => a.result.current[1]({ timeFormat: "12h" }));

    await waitFor(() => expect(b.result.current[0].timeFormat).toBe("12h"));
  });
});
