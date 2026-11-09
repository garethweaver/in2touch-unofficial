import type { Team, Match, Bye } from "@/app/teams/_utils/types";
import type { League } from "@/app/leagues/_utils/types";

const DAY = 86_400_000;

export const match = (overrides: Partial<Match> = {}): Match => ({
  day: "Thursday 12 November",
  time: "19:30",
  timestamp: Date.now() + 3 * DAY,
  leagueName: "Thursday Mixed",
  pitch: "Field 2",
  result: "",
  vs: "The Opposition",
  vsId: "opp-1",
  type: "match",
  ...overrides,
});

export const bye = (overrides: Partial<Bye> = {}): Bye => ({
  day: "Thursday 19 November",
  time: "",
  timestamp: Date.now() + 10 * DAY,
  type: "bye",
  ...overrides,
});

export const team = (overrides: Partial<Team> = {}): Team => ({
  id: "team-1",
  name: "Touch Me Not",
  nameLowercased: "touch me not",
  profileUrl: "https://example.com/team-1",
  fixtures: [match()],
  fixturesHash: "f1",
  ...overrides,
});

export const league = (overrides: Partial<League> = {}): League => ({
  id: "league-1",
  name: "Thursday Mixed",
  nameLowercased: "thursday mixed",
  standingUrl: "https://example.com/standings",
  teams: [
    {
      id: "team-1",
      name: "Touch Me Not",
      played: 5,
      won: 4,
      drawn: 0,
      lost: 1,
      pointsFor: 30,
      pointsAgainst: 12,
      points: 13,
      profileUrl: "https://example.com/team-1",
    },
  ],
  ...overrides,
});
