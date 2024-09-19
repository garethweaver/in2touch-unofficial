"use client";
import { useEffect, useState } from "react";
import type { TeamData } from "@/app/teams/types";
import AddTeamButton from "./AddTeamButton";
import Link from "next/link";

export default function Page() {
  const [teams, setTeams] = useState<TeamData[] | null>(null);
  const [userTeams, setUserTeams] = useState<string[]>([]);

  useEffect(() => {
    // @ts-ignore
    const userData = localStorage.getItem("userTeams");
    if (userData) {
      setUserTeams(JSON.parse(userData).map((t: TeamData) => t.id));
    }
    const fetchData = async () => {
      const res = await fetch(`/api/teams-data`);
      const data = await res.json();
      setTeams(data);
    };

    fetchData();
  }, []);

  console.log(userTeams);

  return (
    <main>
      <Link href="/">Back</Link>
      <ul>
        {teams?.map((team: TeamData) => (
          <li key={team.id}>
            <AddTeamButton
              team={team}
              isSelected={userTeams.includes(team.id)}
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
