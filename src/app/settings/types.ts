import { TimeFormat } from "./_components/TimeFormatSelector";

export interface TeamDisplaySettings {
  spaced?: boolean;
}

export interface UserSettings {
  theme: number;
  timeFormat: TimeFormat;
  teamDisplaySettings?: Record<string, TeamDisplaySettings>;
}

export const defaultUserSettings: UserSettings = {
  theme: 1,
  timeFormat: "24h",
  teamDisplaySettings: {},
};
