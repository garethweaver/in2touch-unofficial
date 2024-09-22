import React from "react";
import Link from "next/link";
import type { Team } from "../types";
// import ButtonsEdit from 'components/buttons/buttons-edit'
import FixtureNext from "./FixtureNext";

export default function Team({ data, ...props }: { data: Team }) {
  return (
    <div className="Team Card">
      <Link href={`/teams/${data.id}`}>
        <div className="Flex__header">
          <h3 className="Flex__heading">{data.name}</h3>
          {/*
           <ButtonsEdit
             id={data.id}
             type="teams" />
            */}
        </div>
        {data.fixtures ? (
          <FixtureNext fixtures={data.fixtures} />
        ) : (
          <em className="Color--muted Text--small">No scheduled fixtures</em>
        )}
      </Link>
    </div>
  );
}
