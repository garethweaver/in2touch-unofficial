import { useState } from "react";
import Link from "next/link";
import { useLocalStorage } from "usehooks-ts";
import { AnimatePresence } from "framer-motion";
import EditListItem from "@/app/_components/EditListItem";
import ButtonToggle from "@/app/_components/ButtonToggle";
import FixtureNext from "./FixtureNext";
import { UserSettings, defaultUserSettings } from "@/app/settings/types";
import type { Team } from "../types";

export default function Team({ data }: { readonly data: Team }) {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [userSettings] = useLocalStorage<UserSettings>(
    "userSettings",
    defaultUserSettings,
    { initializeWithValue: false },
  );

  const isSpaced =
    userSettings?.teamDisplaySettings?.[data.id]?.spaced ?? false;

  return (
    <div className={`util-card ${isSpaced ? "util-card--spaced" : ""}`}>
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
