import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LeagueDetail from "@/app/leagues/[id]/LeaguePage";
import { setFakeDb, fbGet } from "./firebaseMock";
import { league } from "./fixtures";

describe("LeaguePage", () => {
  it("loads an unsaved league, shows its table and can add it", async () => {
    setFakeDb({ leagues: { "league-1": league() } });
    render(<LeagueDetail id="league-1" />);

    expect(await screen.findByRole("heading", { name: "Thursday Mixed" })).toBeInTheDocument();
    expect(fbGet).toHaveBeenCalledWith({ path: "leagues/league-1" });
    expect(screen.getByText("Touch Me Not")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view standings on in2touch/i })).toHaveAttribute(
      "href",
      "https://example.com/standings",
    );

    await userEvent.click(screen.getByRole("button", { name: /add league to homescreen/i }));
    expect(screen.getByText("League added")).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("userLeagues")!)[0].id).toBe("league-1");
  });

  it("uses the saved copy without hitting the database", () => {
    localStorage.setItem("userLeagues", JSON.stringify([league()]));
    render(<LeagueDetail id="league-1" />);
    expect(screen.getByRole("heading", { name: "Thursday Mixed" })).toBeInTheDocument();
    expect(fbGet).not.toHaveBeenCalled();
  });

  it("handles a league without table data", async () => {
    setFakeDb({ leagues: { "league-1": league({ teams: undefined }) } });
    render(<LeagueDetail id="league-1" />);
    expect(await screen.findByText("No league data yet")).toBeInTheDocument();
  });
});
