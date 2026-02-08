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
  date: string;
  day: string;
  time: string;
  timestamp: number;
}

export interface Bye extends BaseFixture {
  type: "bye";
}

export interface Match extends BaseFixture {
  leagueName: string;
  pitch: string;
  result: string;
  vs: string;
  vsId: string;
  round?: string;
  grading?: boolean;
  state?: string;
  type?: "match";
}

export type Fixture = Match | Bye;
