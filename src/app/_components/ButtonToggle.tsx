import Icon from "./Icon";
import { motion } from "framer-motion";
import styles from "./ButtonToggle.module.sass";

export default function ButtonToggle({
  callback,
  value,
}: {
  readonly callback: React.Dispatch<React.SetStateAction<boolean>>;
  readonly value: boolean;
}) {
  const handleEdit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    callback(!value);
  };

  return (
    <button onClick={handleEdit} className={styles.root}>
      {value && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ ease: "easeIn", duration: 0.15 }}
        >
          <Icon name="x" />
        </motion.div>
      )}
      {!value && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ ease: "easeIn", duration: 0.15 }}
        >
          <Icon name="more-horizontal" />
        </motion.div>
      )}
    </button>
  );
}
