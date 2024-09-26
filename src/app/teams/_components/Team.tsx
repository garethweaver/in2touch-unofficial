import { useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import EditListItem from "@/app/_components/EditListItem";
import ButtonToggle from "@/app/_components/ButtonToggle";
import FixtureNext from "./FixtureNext";
import type { Team } from "../types";

export default function Team({ data }: { readonly data: Team }) {
  const [isEdit, setIsEdit] = useState<boolean>(false);

  return (
    <div className="util-card">
      <Link href={`/teams/${data.id}`}>
        <div className="util-flex__header">
          <h3 className="util-flex__heading">{data.name}</h3>
          <ButtonToggle callback={setIsEdit} value={isEdit} />
        </div>
        <AnimatePresence>
          {isEdit && (
            <EditListItem
              localStorageKey="userTeams"
              id={data.id}
              callback={setIsEdit}
            />
          )}
        </AnimatePresence>
        {data.fixtures ? (
          <FixtureNext fixtures={data.fixtures} />
        ) : (
          <em className="util-color--muted util-text--small">
            No scheduled fixtures
          </em>
        )}
      </Link>
    </div>
  );
}
