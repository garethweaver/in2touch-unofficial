import { describe, it, expect, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useCompareAndUpateCache } from "@/app/_helpers/helpers";
import { setFakeDb, updateFakeDb, failReadsUnder, fbGet } from "./firebaseMock";
import { team, league } from "./fixtures";

const read = (key: string) => JSON.parse(localStorage.getItem(key) ?? "null");
const seedLocal = (key: string, value: unknown) =>
  localStorage.setItem(key, JSON.stringify(value));

const config = (overrides = {}) => ({
  teamDataHash: "t1",
  leaguesHash: "l1",
  teamsHash: "a1",
  updatedAt: 1000,
  ...overrides,
});

function mountHook() {
  const setLoading = vi.fn();
  renderHook(() => useCompareAndUpateCache(setLoading));
  return setLoading;
}

describe("useCompareAndUpateCache", () => {
  it("refreshes saved teams from team-data on first sync", async () => {
    seedLocal("userTeams", [team({ name: "Old name" })]);
    setFakeDb({ config: config(), "team-data": { "team-1": team({ name: "New name" }) } });

    const setLoading = mountHook();

    await waitFor(() => expect(read("userTeams")[0].name).toBe("New name"));
    expect(read("fbCache")).toEqual(config());
    expect(setLoading).toHaveBeenLastCalledWith(false);
  });

  it("refreshes saved leagues and drops the allLeagues list", async () => {
    seedLocal("userLeagues", [league({ name: "Old league" })]);
    seedLocal("allLeagues", [league()]);
    setFakeDb({ config: config(), leagues: { "league-1": league({ name: "New league" }) } });

    mountHook();

    await waitFor(() => expect(read("userLeagues")[0].name).toBe("New league"));
    expect(localStorage.getItem("allLeagues")).toBeNull();
  });

  it("drops the allTeams list when teamsHash changes", async () => {
    seedLocal("allTeams", [team()]);
    setFakeDb({ config: config() });

    mountHook();

    await waitFor(() => expect(localStorage.getItem("allTeams")).toBeNull());
  });

  it("does nothing when the stored hashes already match", async () => {
    seedLocal("fbCache", config());
    seedLocal("userTeams", [team({ name: "Cached" })]);
    seedLocal("allTeams", [team()]);
    setFakeDb({ config: config(), "team-data": { "team-1": team({ name: "Server" }) } });

    const setLoading = mountHook();

    await waitFor(() => expect(setLoading).toHaveBeenLastCalledWith(false));
    expect(fbGet).not.toHaveBeenCalled();
    expect(read("userTeams")[0].name).toBe("Cached");
    expect(read("allTeams")).toHaveLength(1);
  });

  it("only refetches teams when just teamDataHash changes later", async () => {
    seedLocal("fbCache", config());
    seedLocal("userTeams", [team({ name: "Cached" })]);
    setFakeDb({ config: config(), "team-data": { "team-1": team({ name: "Updated" }) } });

    mountHook();
    expect(fbGet).not.toHaveBeenCalled();

    await act(async () => updateFakeDb("config", config({ teamDataHash: "t2" })));

    await waitFor(() => expect(read("userTeams")[0].name).toBe("Updated"));
    expect(fbGet).toHaveBeenCalledTimes(1);
    expect(fbGet).toHaveBeenCalledWith({ path: "team-data/team-1" });
  });

  it("keeps the cached team if its fetch fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    seedLocal("userTeams", [team({ id: "gone", name: "Still here" }), team({ name: "Old" })]);
    setFakeDb({ config: config(), "team-data": { "team-1": team({ name: "Fresh" }) } });

    mountHook();

    await waitFor(() =>
      expect(read("userTeams").map((t: any) => t.name)).toEqual(["Still here", "Fresh"]),
    );
  });

  it("keeps the cached team if the read is rejected", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    seedLocal("userTeams", [team({ name: "Cached" })]);
    setFakeDb({ config: config(), "team-data": { "team-1": team({ name: "Fresh" }) } });
    failReadsUnder("team-data");

    mountHook();

    await waitFor(() => expect(read("fbCache")).toEqual(config()));
    expect(read("userTeams")[0].name).toBe("Cached");
  });
});
