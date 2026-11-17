import { useEffect, useRef, useState } from "react";
import { get, ref } from "firebase/database";
import { database } from "@/app/_firebase/config";
import { useOnline } from "@/app/_helpers/connection";

// Firebase's get() can hang on a flaky connection rather than failing
export const FETCH_TIMEOUT_MS = 10_000;

export class NotFoundError extends Error {}

export function fetchOnce<T>(
  path: string,
  timeoutMs = FETCH_TIMEOUT_MS,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`Timed out fetching ${path}`)),
      timeoutMs,
    );
    get(ref(database, path))
      .then((snapshot) =>
        snapshot.exists()
          ? resolve(snapshot.val())
          : reject(new NotFoundError(path)),
      )
      .catch(reject)
      .finally(() => clearTimeout(timer));
  });
}

export type FetchStatus = "loading" | "done" | "offline" | "notFound" | "error";

/**
 * Fetch `path` once, unless `skip` (e.g. the item is already saved locally).
 * Waits while offline and fetches automatically when the connection returns.
 */
export function useFetchWhenOnline<T>(
  path: string,
  skip: boolean,
  onData: (data: T) => void,
) {
  const online = useOnline();
  const [status, setStatus] = useState<FetchStatus>(skip ? "done" : "loading");
  const [attempt, setAttempt] = useState(0);
  const onDataRef = useRef(onData);
  onDataRef.current = onData;

  useEffect(() => {
    if (skip) return;
    if (!online) {
      setStatus("offline");
      return;
    }
    let cancelled = false;
    setStatus("loading");
    fetchOnce<T>(path)
      .then((data) => {
        if (cancelled) return;
        onDataRef.current(data);
        setStatus("done");
      })
      .catch((e) => {
        if (cancelled) return;
        console.error(e);
        setStatus(e instanceof NotFoundError ? "notFound" : "error");
      });
    return () => {
      cancelled = true;
    };
  }, [path, skip, online, attempt]);

  return { status, retry: () => setAttempt((a) => a + 1) };
}
