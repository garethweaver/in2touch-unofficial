const DAY = 86_400_000;

/** Fixtures are relative to "now" so upcoming/past splits stay stable. */
export function buildSeed(now = Date.now()) {
  const fixtures = [
    {
      date: "past",
      day: "Last week",
      time: "18:00",
      timestamp: now - 7 * DAY,
      leagueName: "Thursday Mixed",
      pitch: "Field 1",
      result: "6 - 2",
      vs: "Slow Pokes",
      vsId: "slow-pokes",
      type: "match",
    },
    {
      date: "future",
      day: "Next Thursday",
      time: "19:30",
      timestamp: now + 3 * DAY,
      leagueName: "Thursday Mixed",
      pitch: "Field 2",
      result: "",
      vs: "Slow Pokes",
      vsId: "slow-pokes",
      type: "match",
    },
  ];

  const teamBasic = (id: string, name: string) => ({
    id,
    name,
    nameLowercased: name.toLowerCase(),
    profileUrl: `https://example.com/teams/${id}`,
  });

  return {
    config: { teamDataHash: "t1", leaguesHash: "l1", teamsHash: "a1", updatedAt: now },
    teams: {
      "touch-me-not": teamBasic("touch-me-not", "Touch Me Not"),
      "slow-pokes": teamBasic("slow-pokes", "Slow Pokes"),
      "the-hat-tricks": teamBasic("the-hat-tricks", "The Hat Tricks"),
    },
    "team-data": {
      "touch-me-not": {
        ...teamBasic("touch-me-not", "Touch Me Not"),
        fixtures,
        fixturesHash: "f1",
      },
      "slow-pokes": {
        ...teamBasic("slow-pokes", "Slow Pokes"),
        fixtures: [],
        fixturesHash: "f0",
      },
    },
    leagues: {
      "thursday-mixed": {
        id: "thursday-mixed",
        name: "Thursday Mixed",
        nameLowercased: "thursday mixed",
        standingUrl: "https://example.com/standings",
        teams: [
          {
            id: "touch-me-not",
            name: "Touch Me Not",
            played: 4,
            won: 3,
            drawn: 0,
            lost: 1,
            pointsFor: 24,
            pointsAgainst: 10,
            points: 10,
            profileUrl: "https://example.com/teams/touch-me-not",
          },
          {
            id: "slow-pokes",
            name: "Slow Pokes",
            played: 4,
            won: 1,
            drawn: 0,
            lost: 3,
            pointsFor: 10,
            pointsAgainst: 24,
            points: 4,
            profileUrl: "https://example.com/teams/slow-pokes",
          },
        ],
      },
    },
  };
}
