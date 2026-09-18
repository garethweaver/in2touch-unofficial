import Icon from "./Icon";
import { motion } from "framer-motion";
import { useLocalStorage } from "usehooks-ts";
import { useUserSettings } from "@/app/settings/_utils/useUserSettings";
import styles from "./EditListItem.module.sass";

export default function EditListItem({
  localStorageKey,
  id,
  callback,
}: {
  readonly localStorageKey: string;
  readonly id: string;
  readonly callback: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [items, setItems] = useLocalStorage<{ id: string }[]>(
    localStorageKey,
    [],
  );
  const [userSettings, updateUserSettings] = useUserSettings();
  const idx = items.findIndex((item) => item.id === id);
  const isSpaced = userSettings.teamDisplaySettings?.[id]?.spaced ?? false;

  const handleMove = (e: React.MouseEvent<HTMLElement>, dir: number) => {
    e.preventDefault();
    e.stopPropagation();
    const removedArr = items.toSpliced(idx, 1);
    setItems(removedArr.toSpliced(idx + dir, 0, items[idx]));
    callback(false);
  };
  const handleDelete = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setItems(items.toSpliced(idx, 1));
    callback(false);
  };
  const handleToggleSpacing = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    updateUserSettings({
      teamDisplaySettings: {
        ...userSettings.teamDisplaySettings,
        [id]: { spaced: !isSpaced },
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 55 }}
      exit={{ opacity: 0, y: 8, height: 0 }}
      transition={{ ease: "easeIn", duration: 0.15 }}
    >
      <div className={styles.root}>
        {localStorageKey === "userTeams" && (
          <button onClick={handleToggleSpacing}>
            <Icon name="align-justify" size="large" />
          </button>
        )}
        {idx > 0 && (
          <button onClick={(e) => handleMove(e, -1)}>
            <Icon name="arrow-up-circle" size="large" />
          </button>
        )}
        {idx < items.length - 1 && (
          <button onClick={(e) => handleMove(e, 1)}>
            <Icon name="arrow-down-circle" size="large" />
          </button>
        )}
        <button onClick={handleDelete}>
          <Icon name="trash-2" size="large" />
        </button>
        <hr />
      </div>
    </motion.div>
  );
}
