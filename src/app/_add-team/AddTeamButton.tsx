"use client";
import type { Team } from "@/app/teams/types";

interface Props {
  readonly team: Team;
  readonly isSelected: boolean;
}

export default function AddTeamButton({ team, isSelected }: Props) {
  const addTeam = (t: Team) => {
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
