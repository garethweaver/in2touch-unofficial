"use client";
import { useLocalStorage } from "usehooks-ts";
import Icon from "@/app/_components/Icon";
import type { Teams } from "@/app/teams/types";
import type { Leagues } from "@/app/leagues/types";
import Team from "@/app/teams/_components/Team";
import ButtonNav, { type Href } from "@/app/_components/ButtonNav";
import LeagueBasic from "@/app/leagues/_components/LeagueBasic";
import styles from "./page.module.sass";

const links: Href[] = [
  {
    text: "Add team",
    href: "/add/teams",
    icon: "user",
  },
  {
    text: "Add league",
    href: "/add/leagues",
    icon: "map-pin",
  },
];

export default function Page() {
  const [userTeams] = useLocalStorage<Teams>("userTeams", [], {
    initializeWithValue: false,
  });
  const [userLeagues] = useLocalStorage<Leagues>("userLeagues", [], {
    initializeWithValue: false,
  });

  return (
    <main>
      {userTeams.length === 0 && userLeagues.length === 0 && (
        <div className={styles.intro}>
          <h1>Alright, let&apos;s go!</h1>
          <p>
            First you&apos;ll need to find a team that you play for or a league
            to follow. We&apos;ll remember your preferences for future visits.
            You can change the theme or reset the app on the settings page as
            well as finding how to add the app to your homescreen.
          </p>
        </div>
      )}
      {userTeams.length > 0 && (
        <div className="util-margin--b">
          <h2 className="util-flex__icon">
            <Icon name="user" />
            Your Teams
          </h2>
          <nav>
            <ul>
              {userTeams.map((team) => (
                <li key={team.id}>
                  <Team data={team} />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
      {userLeagues.length > 0 && (
        <div className="util-margin--b">
          <h2 className="util-flex__icon">
            <Icon name="map-pin" />
            Followed Leagues
          </h2>
          <nav>
            <ul>
              {userLeagues.map((league) => (
                <li key={league.id}>
                  <LeagueBasic data={league} />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
      <ButtonNav hrefs={links} />
    </main>
  );
}
