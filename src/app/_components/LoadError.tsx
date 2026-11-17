import Button from "@/app/_components/Button";
import type { FetchStatus } from "@/app/_helpers/useFetchWhenOnline";

/** Message for a fetch that hasn't succeeded. `subject` e.g. "this team" */
export default function LoadError({
  status,
  subject,
  onRetry,
}: {
  readonly status: Extract<FetchStatus, "offline" | "notFound" | "error">;
  readonly subject: string;
  readonly onRetry: () => void;
}) {
  if (status === "offline") {
    return (
      <p className="util-color--muted">
        {`You're offline, and ${subject} isn't saved on this device. It'll load when you're back online.`}
      </p>
    );
  }
  if (status === "notFound") {
    return <p className="util-color--muted">{`Couldn't find ${subject}.`}</p>;
  }
  return (
    <>
      <p className="util-color--muted">{`Couldn't load ${subject}.`}</p>
      <Button icon="refresh-cw" onClick={onRetry}>
        Try again
      </Button>
    </>
  );
}
