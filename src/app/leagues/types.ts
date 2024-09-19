export type Leagues = League[];

export interface League {
  fixturesUrl: string;
  id: string;
  name: string;
  nameLowercased: string;
  standingUrl: string;
  teams?: LeagueTeam[];
}

export interface LeagueTeam {
  drawn: string;
  id: string;
  lost: string;
  name: string;
  played: string;
  points: string;
  pointsAgainst: string;
  pointsBonus: string;
  pointsFor: string;
  profileUrl: string;
  won: string;
}
