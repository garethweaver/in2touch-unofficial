import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import HomePage from "@/app/page";
import { seedLocal } from "./testUtils";
import { team, league } from "./fixtures";

const intro = () => screen.queryByRole("heading", { name: "Alright, let's go!" });
const teamsHeading = () => screen.queryByRole("heading", { name: "Your Teams" });
const leaguesHeading = () => screen.queryByRole("heading", { name: "Followed Leagues" });

describe("Homescreen", () => {
  it("shows the intro when nothing is saved", () => {
    render(<HomePage />);
    expect(intro()).toBeInTheDocument();
    expect(teamsHeading()).toBeNull();
    expect(leaguesHeading()).toBeNull();
  });

  it("shows saved teams only", async () => {
    seedLocal("userTeams", [team()]);
    render(<HomePage />);
    expect(await screen.findByRole("heading", { name: "Your Teams" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Touch Me Not", level: 3 })).toBeInTheDocument();
    expect(intro()).toBeNull();
    expect(leaguesHeading()).toBeNull();
  });

  it("shows followed leagues only", async () => {
    seedLocal("userLeagues", [league()]);
    render(<HomePage />);
    expect(await screen.findByRole("heading", { name: "Followed Leagues" })).toBeInTheDocument();
    expect(intro()).toBeNull();
    expect(teamsHeading()).toBeNull();
  });

  it("shows teams then leagues when both are saved", async () => {
    seedLocal("userTeams", [team(), team({ id: "team-2", name: "Second Team" })]);
    seedLocal("userLeagues", [league()]);
    render(<HomePage />);

    await screen.findByRole("heading", { name: "Your Teams" });
    const headings = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(headings).toEqual(["Your Teams", "Followed Leagues"]);
    expect(
      screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent!.trim()),
    ).toEqual(["Touch Me Not", "Second Team", "Thursday Mixed"]);
  });

  it("applies the per-team spacing setting", async () => {
    seedLocal("userTeams", [team()]);
    seedLocal("userSettings", { theme: 1, timeFormat: "24h", teamDisplaySettings: { "team-1": { spaced: true } } });
    render(<HomePage />);
    const heading = await screen.findByRole("heading", { name: "Touch Me Not", level: 3 });
    await waitFor(() => expect(heading.closest(".util-card")).toHaveClass("util-card--spaced"));
  });

  it("always offers the add links", () => {
    render(<HomePage />);
    expect(screen.getByRole("link", { name: "Add team" })).toHaveAttribute("href", "/add/teams");
    expect(screen.getByRole("link", { name: "Add league" })).toHaveAttribute("href", "/add/leagues");
  });
});
