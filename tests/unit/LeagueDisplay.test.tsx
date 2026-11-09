import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import LeagueTable from "@/app/leagues/_components/LeagueTable";
import LeagueTeam from "@/app/leagues/_components/LeagueTeam";
import LeagueBasic from "@/app/leagues/_components/LeagueBasic";
import type { LeagueTeam as LeagueTeamType } from "@/app/leagues/_utils/types";
import { league } from "./fixtures";

const row = (overrides: Partial<LeagueTeamType> = {}): LeagueTeamType => ({
  id: "t1",
  name: "Touch Me Not",
  played: 4,
  won: 3,
  drawn: 0,
  lost: 1,
  pointsFor: 24,
  pointsAgainst: 10,
  points: 10,
  profileUrl: "",
  ...overrides,
});

const headerCells = (container: HTMLElement) =>
  Array.from(container.querySelector('[class*="header"]')!.children).map((c) => c.textContent);

describe("LeagueTable columns", () => {
  it("shows the standard columns", () => {
    const { container } = render(<LeagueTable data={[row()]} />);
    expect(headerCells(container)).toEqual(["PL", "W", "D", "L", "F", "A", "P"]);
  });

  it("adds BP and PD when the league has them", () => {
    const { container } = render(
      <LeagueTable data={[row({ pointsBonus: 2, pointsDifference: 14 })]} />,
    );
    expect(headerCells(container)).toEqual(["PL", "W", "D", "L", "F", "A", "BP", "PD", "P"]);
  });

  it("treats a bonus of 0 as present", () => {
    const { container } = render(<LeagueTable data={[row({ pointsBonus: 0 })]} />);
    expect(headerCells(container)).toContain("BP");
  });

  it("shows a message with no data", () => {
    render(<LeagueTable data={undefined} />);
    expect(screen.getByText("No league data yet")).toBeInTheDocument();
  });
});

describe("LeagueTeam row", () => {
  const cells = (container: HTMLElement) =>
    Array.from(container.querySelector('[class*="results"]')!.children).map((c) => c.textContent);

  it("renders stats in header order and links to the team", () => {
    const { container } = render(<LeagueTeam data={row({ pointsBonus: 0, pointsDifference: 14 })} />);
    expect(cells(container)).toEqual(["4", "3", "0", "1", "24", "10", "0", "+14", "10"]);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/teams/t1");
  });

  it.each([
    [14, "+14"],
    [0, "+0"],
    [-3, "-3"],
  ])("formats a points difference of %i as %s", (pd, text) => {
    const { container } = render(<LeagueTeam data={row({ pointsDifference: pd })} />);
    expect(cells(container)).toContain(text);
  });
});

describe("LeagueBasic name parsing", () => {
  const parts = (name: string) => {
    render(<LeagueBasic data={league({ name })} />);
    const heading = screen.getByRole("heading", { level: 3 });
    return [heading.textContent!.trim(), heading.nextElementSibling!.textContent];
  };

  it("splits 'League - Division' into a heading and subtitle", () => {
    expect(parts("Thursday Mixed - Division 1")).toEqual(["Thursday Mixed", "Division 1"]);
  });

  it("keeps later dashes in the subtitle", () => {
    expect(parts("Monday - Mens - Div 2")).toEqual(["Monday", "Mens - Div 2"]);
  });

  it("shows the whole name when there is no dash", () => {
    expect(parts("Social League")).toEqual(["Social League", ""]);
  });

  it("lists teams in order with position and points", () => {
    render(<LeagueBasic data={league()} />);
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items.map((li) => li.textContent)).toEqual(["1Touch Me Not13"]);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/leagues/league-1");
  });

  it("says when there is no table yet", () => {
    render(<LeagueBasic data={league({ teams: [] })} />);
    expect(screen.getByText("No league data yet")).toBeInTheDocument();
  });
});
