// Team and league pages are single static pages that read the id from the
// query string, so one cached copy works for every team/league offline.
export const teamHref = (id: string) => `/teams?id=${encodeURIComponent(id)}`;
export const leagueHref = (id: string) => `/leagues?id=${encodeURIComponent(id)}`;
