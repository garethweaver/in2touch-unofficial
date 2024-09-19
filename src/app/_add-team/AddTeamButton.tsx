"use client";
import type { TeamData } from "@/app/teams/types";

interface Props {
  readonly team: TeamData;
  readonly isSelected: boolean;
}

export default function AddTeamButton({ team, isSelected }: Props) {
  const addTeam = (t: TeamData) => {
    const userTeams = localStorage.getItem("userTeams");

    if (userTeams) {
    } else {
      const follow = [team];
      localStorage.setItem("userTeams", JSON.stringify(follow));
    }
  };

  return (
    <button onClick={() => addTeam(team)}>
      {team.name}
      {isSelected && "✅"}
    </button>
  );
}
