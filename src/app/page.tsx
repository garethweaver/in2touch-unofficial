"use client";
import { useLocalStorage } from "usehooks-ts";
import Icon from "@/app/_components/Icon";
import type { Teams } from "@/app/teams/types";
import type { Leagues } from "@/app/leagues/types";
import Team from "@/app/teams/_components/Team";
import ButtonNav, { type Href } from "@/app/_components/ButtonNav";
import LeagueBasic from "@/app/leagues/_components/LeagueBasic";

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
  const [userTeams] = useLocalStorage<Teams>("userTeams", []);
  const [userLeagues] = useLocalStorage<Leagues>("userLeagues", []);

  // TODO: intro text

  return (
    <main>
      <div className="Margin--b">
        <h2 className="Flex__icon">
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
      <div className="Margin--b">
        <h2 className="Flex__icon">
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

      <ButtonNav hrefs={links} />
    </main>
  );
}
