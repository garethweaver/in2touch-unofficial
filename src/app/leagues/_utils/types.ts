export type Leagues = League[];

export interface League {
  id: string;
  name: string;
  nameLowercased: string;
  standingUrl?: string;
  fixturesUrl?: string;
  leagueUrl?: string;
  teams?: LeagueTeam[];
}

export interface LeagueTeam {
  drawn: string;
  id: string;
  lost: string;
  name: string;
  played: string;
  points: number;
  pointsAgainst: number;
  pointsBonus?: number;
  pointsDifference?: number;
  pointsFor: number;
  profileUrl: string;
  won: number;
}
