import Icon from "@/app/_components/Icon";
import styles from "./OfflineBanner.module.sass";

export default function OfflineBanner() {
  return (
    <div className={styles.root} role="status">
      <Icon name="wifi-off" />
      <span>Offline – showing your saved teams and leagues</span>
    </div>
  );
}
