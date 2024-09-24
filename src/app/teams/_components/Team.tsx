import { useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import EditListItem from "@/app/_components/EditListItem";
import ButtonToggle from "@/app/_components/ButtonToggle";
import FixtureNext from "./FixtureNext";
import type { Team } from "../types";

export default function Team({ data, ...props }: { data: Team }) {
  const [isEdit, setIsEdit] = useState<boolean>(false);

  return (
    <div className="Team Card">
      <Link href={`/teams/${data.id}`}>
        <div className="Flex__header">
          <h3 className="Flex__heading">{data.name}</h3>
          <ButtonToggle callback={setIsEdit} value={isEdit} />
        </div>
        <AnimatePresence>
          {isEdit && <EditListItem localStorageKey="userTeams" id={data.id} />}
        </AnimatePresence>
        {data.fixtures ? (
          <FixtureNext fixtures={data.fixtures} />
        ) : (
          <em className="Color--muted Text--small">No scheduled fixtures</em>
        )}
      </Link>
    </div>
  );
}
