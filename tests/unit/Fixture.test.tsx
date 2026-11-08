import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Fixture from "@/app/teams/_components/Fixture";
import FixtureNext from "@/app/teams/_components/FixtureNext";
import { match, bye } from "./fixtures";

describe("Fixture", () => {
  it.each([
    ["5 - 3", "util-color--success"],
    ["2 - 6", "util-color--danger"],
    ["4 - 4", "util-color--warning"],
  ])("colours result %s as %s", (result, className) => {
    render(<Fixture data={match({ result })} isPast />);
    expect(screen.getByText(result)).toHaveClass(className);
  });

  it("shows 'No result yet' for a past game without a score", () => {
    render(<Fixture data={match()} isPast />);
    expect(screen.getByText("No result yet")).toBeInTheDocument();
  });

  it("shows the time in the user's chosen format", () => {
    localStorage.setItem("userSettings", JSON.stringify({ theme: 1, timeFormat: "12h" }));
    render(<Fixture data={match({ time: "19:30" })} isPast={false} />);
    expect(screen.getByText("7:30pm")).toBeInTheDocument();
  });

  it("renders byes and flags grading/forfeit games", () => {
    const { unmount } = render(<Fixture data={bye()} isPast={false} />);
    expect(screen.getByText("Bye")).toBeInTheDocument();
    unmount();

    render(<Fixture data={match({ grading: true, state: "forfeit" })} isPast={false} />);
    expect(screen.getByText("Grading game")).toBeInTheDocument();
    expect(screen.getByText("Game Forfeit")).toBeInTheDocument();
  });
});

describe("FixtureNext", () => {
  it("shows every game on the next game day", () => {
    const day = new Date();
    day.setDate(day.getDate() + 3);
    day.setHours(18, 0, 0, 0);
    const t = day.getTime();
    render(
      <FixtureNext
        fixtures={[
          match({ timestamp: Date.now() - 86_400_000, vs: "Old game" }),
          match({ timestamp: t, vs: "Early game" }),
          match({ timestamp: t + 3_600_000, vs: "Late game" }),
          match({ timestamp: t + 7 * 86_400_000, vs: "Next week" }),
        ]}
      />,
    );
    expect(screen.getByText("2 Next:")).toBeInTheDocument();
    expect(screen.getByText("Early game")).toBeInTheDocument();
    expect(screen.getByText("Late game")).toBeInTheDocument();
    expect(screen.queryByText("Old game")).not.toBeInTheDocument();
    expect(screen.queryByText("Next week")).not.toBeInTheDocument();
  });

  it("says when nothing is scheduled", () => {
    render(<FixtureNext fixtures={[match({ timestamp: Date.now() - 1000 })]} />);
    expect(screen.getByText("No scheduled fixtures")).toBeInTheDocument();
  });
});
