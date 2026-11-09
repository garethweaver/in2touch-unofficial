export type Teams = Team[];
export type TeamsBasic = TeamBasic[];

export interface Team extends TeamBasic {
  fixtures: Fixture[];
  fixturesHash: string;
}

export interface TeamBasic {
  id: string;
  name: string;
  nameLowercased: string;
  profileUrl: string;
}

export interface BaseFixture {
  day: string;
  time: string;
  timestamp: number;
  round?: string;
}

export interface Bye extends BaseFixture {
  type: "bye";
}

export interface Match extends BaseFixture {
  // Scrapers send null when unknown; Firebase drops nulls, so it can arrive missing
  leagueName?: string | null;
  pitch: string;
  result: string;
  vs: string;
  vsId: string;
  grading?: boolean;
  state?: string;
  type?: "match";
}

export type Fixture = Match | Bye;
