import Icon from "./Icon";
import { motion } from "framer-motion";
import "./ButtonToggle.sass";

export default function ButtonToggle({
  callback,
  value,
}: {
  callback: (value: boolean) => void;
  value: boolean;
}) {
  const handleEdit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    callback(!value);
  };

  return (
    <button onClick={handleEdit} className="ButtonToggle">
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
