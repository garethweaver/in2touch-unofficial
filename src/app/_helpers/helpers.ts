import { TeamDataBasic } from "@/app/teams/types";

export const getFromLocalStorage = (key: string, setDefault?: any) => {
  return localStorage.getItem(key)
    ? JSON.parse(localStorage.getItem(key) ?? "")
    : setDefault;
};

export const sortTeamsAlpha = (a: TeamDataBasic, b: TeamDataBasic) => {
  if (a.nameLowercased < b.nameLowercased) {
    return -1;
  }
  if (a.nameLowercased > b.nameLowercased) {
    return 1;
  }
  return 0;
};

export const compareAndUpateCache = () => {};
