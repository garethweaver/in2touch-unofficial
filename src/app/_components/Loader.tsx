import styles from "./Loader.module.sass";

export default function Loader({
  type,
}: {
  readonly type?: "small" | "center";
}) {
  return (
    <div className={`${type ? styles[type] : ""}`}>
      <div className={styles.inner} />
    </div>
  );
}
