import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TeamDetail from "@/app/teams/[id]/TeamPage";
import { setFakeDb, fbGet } from "./firebaseMock";
import { team, match } from "./fixtures";

describe("TeamPage", () => {
  it("loads an unsaved team from the database and can add it", async () => {
    const serverTeam = team();
    setFakeDb({ "team-data": { "team-1": serverTeam } });
    render(<TeamDetail id="team-1" />);

    expect(await screen.findByRole("heading", { name: "Touch Me Not" })).toBeInTheDocument();
    expect(fbGet).toHaveBeenCalledWith({ path: "team-data/team-1" });
    expect(screen.getByText("Upcoming Fixtures")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /add team to homescreen/i }));

    expect(screen.getByText("Team added")).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("userTeams")!)).toEqual([serverTeam]);
  });

  it("uses the saved copy without hitting the database", () => {
    localStorage.setItem("userTeams", JSON.stringify([team({ name: "Saved team" })]));
    render(<TeamDetail id="team-1" />);

    expect(screen.getByRole("heading", { name: "Saved team" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /add team/i })).not.toBeInTheDocument();
    expect(fbGet).not.toHaveBeenCalled();
  });

  it("shows a message when the team has no fixtures", async () => {
    setFakeDb({ "team-data": { "team-1": team({ fixtures: [] }) } });
    render(<TeamDetail id="team-1" />);
    expect(await screen.findByText("No team fixtures")).toBeInTheDocument();
  });

  it("splits past results from upcoming games", async () => {
    setFakeDb({
      "team-data": {
        "team-1": team({
          fixtures: [
            match({ timestamp: Date.now() - 86_400_000, result: "5 - 3", vs: "Beaten" }),
            match({ vs: "Next up" }),
          ],
        }),
      },
    });
    render(<TeamDetail id="team-1" />);

    expect(await screen.findByText("Past Fixtures")).toBeInTheDocument();
    expect(screen.getByText("5 - 3")).toHaveClass("util-color--success");
    expect(screen.getByText("Next up")).toBeInTheDocument();
  });
});
