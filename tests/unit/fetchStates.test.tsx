import { describe, it, expect, vi, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TeamDetail from "@/app/teams/TeamPage";
import LeagueDetail from "@/app/leagues/LeaguePage";
import { ConnectionProvider } from "@/app/_helpers/connection";
import { FETCH_TIMEOUT_MS } from "@/app/_helpers/useFetchWhenOnline";
import { setFakeDb, fbGet, failReadsUnder, allowReadsUnder } from "./firebaseMock";
import { team, league } from "./fixtures";

const setBrowserOnline = (online: boolean) => {
  vi.spyOn(navigator, "onLine", "get").mockReturnValue(online);
  act(() => window.dispatchEvent(new Event(online ? "online" : "offline")));
};

afterEach(() => vi.useRealTimers());

describe("loading unsaved teams and leagues", () => {
  it("says when a team doesn't exist instead of spinning", async () => {
    render(<TeamDetail id="nope" />);
    expect(await screen.findByText("Couldn't find this team.")).toBeInTheDocument();
  });

  it("offers a retry when the fetch fails", async () => {
    setFakeDb({ "team-data": { "team-1": team() } });
    failReadsUnder("team-data");
    render(<TeamDetail id="team-1" />);

    expect(await screen.findByText("Couldn't load this team.")).toBeInTheDocument();
    allowReadsUnder("team-data");
    await userEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(await screen.findByRole("heading", { name: "Touch Me Not" })).toBeInTheDocument();
  });

  it("gives up on a request that hangs", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    fbGet.mockImplementationOnce(() => new Promise(() => {}));
    render(<LeagueDetail id="league-1" />);
    await act(async () => vi.advanceTimersByTime(FETCH_TIMEOUT_MS + 1));
    expect(screen.getByText("Couldn't load this league.")).toBeInTheDocument();
  });

  it("waits while offline and loads once back online", async () => {
    setFakeDb({ leagues: { "league-1": league() } });
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    render(
      <ConnectionProvider>
        <LeagueDetail id="league-1" />
      </ConnectionProvider>,
    );
    expect(await screen.findByText(/You're offline, and this league isn't saved/)).toBeInTheDocument();

    setBrowserOnline(true);
    expect(await screen.findByRole("heading", { name: "Thursday Mixed" })).toBeInTheDocument();
  });

  it("still shows saved teams while offline", () => {
    localStorage.setItem("userTeams", JSON.stringify([team({ name: "Saved team" })]));
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    render(
      <ConnectionProvider>
        <TeamDetail id="team-1" />
      </ConnectionProvider>,
    );
    expect(screen.getByRole("heading", { name: "Saved team" })).toBeInTheDocument();
    expect(fbGet).not.toHaveBeenCalled();
  });
});
