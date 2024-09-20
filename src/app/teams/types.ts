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

export interface Fixture {
  day: string;
  grading: boolean;
  leagueName: string;
  pitch: string;
  result: string;
  time: string;
  timestamp: number;
  vs: string;
  vsId: string;
}
