import { describe, it, expect, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import TeamsPage from "@/app/teams/page";
import LeaguesPage from "@/app/leagues/page";
import { teamHref, leagueHref } from "@/app/_helpers/routes";
import { setFakeDb } from "./firebaseMock";
import { team, league } from "./fixtures";

const nav = vi.hoisted(() => ({ search: new URLSearchParams() }));
vi.mock("next/navigation", () => ({ useSearchParams: () => nav.search }));

describe("query-string detail pages", () => {
  it("builds encoded links", () => {
    expect(teamHref("a b/c")).toBe("/teams?id=a%20b%2Fc");
    expect(leagueHref("x")).toBe("/leagues?id=x");
  });

  it("shows the team from ?id= and swaps when the id changes", async () => {
    setFakeDb({
      "team-data": {
        one: team({ id: "one", name: "Team One" }),
        two: team({ id: "two", name: "Team Two" }),
      },
    });
    nav.search = new URLSearchParams("id=one");
    const { rerender } = render(<TeamsPage />);
    expect(await screen.findByRole("heading", { name: "Team One" })).toBeInTheDocument();

    nav.search = new URLSearchParams("id=two");
    await act(async () => rerender(<TeamsPage />));
    expect(await screen.findByRole("heading", { name: "Team Two" })).toBeInTheDocument();
  });

  it("shows the league from ?id=", async () => {
    setFakeDb({ leagues: { "league-1": league() } });
    nav.search = new URLSearchParams("id=league-1");
    render(<LeaguesPage />);
    expect(await screen.findByRole("heading", { name: "Thursday Mixed" })).toBeInTheDocument();
  });

  it("handles a missing id", () => {
    nav.search = new URLSearchParams();
    render(<TeamsPage />);
    expect(screen.getByText("No team selected")).toBeInTheDocument();
  });
});
