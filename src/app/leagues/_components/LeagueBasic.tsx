import { useState } from "react";
import { League } from "../types";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import EditListItem from "@/app/_components/EditListItem";
import ButtonToggle from "@/app/_components/ButtonToggle";
import styles from "./LeagueBasic.module.sass";

function parseName(name: string) {
  let namesArr: undefined | string[];
  if (name.indexOf("-")) {
    namesArr = name.split("-");
  }
  return (
    <>
      <h3 className="util-flex__heading">{namesArr?.[0]}</h3>
      <span>{namesArr?.slice(1, namesArr?.length).join("-").trim()}</span>
    </>
  );
}

export default function LeagueBasic({ data }: { readonly data: League }) {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  return (
    <div className={`${styles.root} util-card`}>
      <Link href={`/leagues/${data.id}`}>
        <div className="util-flex__header">
          <span>{parseName(data.name)}</span>
          <ButtonToggle callback={setIsEdit} value={isEdit} />
        </div>
        <AnimatePresence>
          {isEdit && (
            <EditListItem
              localStorageKey="userLeagues"
              id={data.id}
              callback={setIsEdit}
            />
          )}
        </AnimatePresence>
        <div className={styles.list}>
          {data.teams && data.teams.length > 0 ? (
            <>
              <h6 className="util-heading--sm">Teams:</h6>
              <ol>
                {data.teams.map((team, idx: number) => {
                  return (
                    <li key={team.id} className={styles.team}>
                      <span className={styles.pos}>{idx + 1}</span>
                      <span className={styles.name}>{team.name}</span>
                      <span className={styles.points}>{team.points}</span>
                    </li>
                  );
                })}
              </ol>
            </>
          ) : (
            <em className="util-color--muted">No league data yet</em>
          )}
        </div>
      </Link>
    </div>
  );
}
