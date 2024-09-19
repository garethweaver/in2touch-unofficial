export type TeamsData = TeamData[];
export type TeamsDataBasic = TeamDataBasic[];

export interface TeamData extends TeamDataBasic {
  fixtures: Fixture[];
  fixturesHash: string;
}

export interface TeamDataBasic {
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
