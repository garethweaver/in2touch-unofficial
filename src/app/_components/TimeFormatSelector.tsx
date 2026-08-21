import Button from "./Button";
import styles from "./TimeFormatSelector.module.sass";

export type TimeFormat = "12h" | "24h";

export default function TimeFormatSelector({
  selectedFormat,
  onFormatChange,
}: {
  readonly selectedFormat: TimeFormat;
  readonly onFormatChange: (format: TimeFormat) => void;
}) {
  return (
    <div className={styles.timeFormatButtons}>
      <Button
        onClick={() => onFormatChange("24h")}
        selected={selectedFormat === "24h"}
      >
        24-hour (19:30)
      </Button>
      <Button
        onClick={() => onFormatChange("12h")}
        selected={selectedFormat === "12h"}
      >
        12-hour (7:30pm)
      </Button>
    </div>
  );
}
