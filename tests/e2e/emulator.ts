/**
 * Helpers for seeding/changing the Firebase Realtime Database emulator over its REST API.
 * "Bearer owner" is the emulator's admin token, so writes bypass the read-only rules.
 */
export const PROJECT_ID = "demo-in2touch";
export const EMULATOR_HOST = "127.0.0.1:9000";

const url = (path = "") =>
  `http://${EMULATOR_HOST}/${path}.json?ns=${PROJECT_ID}`;

async function send(method: "PUT" | "PATCH", path: string, body: unknown) {
  const res = await fetch(url(path), {
    method,
    headers: { Authorization: "Bearer owner" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${method} ${path} failed: ${await res.text()}`);
}

/** Replace the whole database. */
export const resetDb = (data: unknown) => send("PUT", "", data);
/** Set the value at a path, e.g. setDb("team-data/abc/name", "New name"). */
export const setDb = (path: string, value: unknown) => send("PUT", path, value);
