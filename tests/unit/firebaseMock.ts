/**
 * In-memory stand-in for the Firebase Realtime Database.
 *
 * Importing this file (done once in setup.ts) replaces `firebase/database` and
 * `@/app/_firebase/config` for every test, so nothing touches the network.
 *
 *   setFakeDb({ "team-data": { abc: team } })   // seed data
 *   updateFakeDb("config", { teamDataHash: "2" }) // change data + fire onValue listeners
 *   fbGet / fbOnValue                          // vi.fn spies for assertions
 */
import { vi } from "vitest";

type Listener = { path: string; cb: (snap: FakeSnapshot) => void };
type FakeSnapshot = { exists: () => boolean; val: () => any };

const state: { db: Record<string, any>; listeners: Listener[]; failPaths: Set<string> } = {
  db: {},
  listeners: [],
  failPaths: new Set(),
};

const clone = <T>(v: T): T => (v === undefined ? v : structuredClone(v));
const lookup = (path: string) =>
  path.split("/").filter(Boolean).reduce<any>((o, k) => o?.[k], state.db);
const snapshot = (path: string): FakeSnapshot => {
  const v = clone(lookup(path));
  return { exists: () => v !== undefined && v !== null, val: () => v ?? null };
};

export const fbGet = vi.fn(async (r: { path: string }) => {
  if (Array.from(state.failPaths).some((p) => r.path.startsWith(p))) {
    throw new Error(`Permission denied: ${r.path}`);
  }
  return snapshot(r.path);
});

export const fbOnValue = vi.fn(
  (r: { path: string }, cb: (snap: FakeSnapshot) => void) => {
    const listener = { path: r.path, cb };
    state.listeners.push(listener);
    cb(snapshot(r.path));
    return () => {
      state.listeners = state.listeners.filter((l) => l !== listener);
    };
  },
);

vi.mock("@/app/_firebase/config", () => ({ database: { __fake: true } }));
vi.mock("firebase/database", () => ({
  ref: (_db: unknown, path = "") => ({ path }),
  get: (r: { path: string }) => fbGet(r),
  onValue: (r: { path: string }, cb: any) => fbOnValue(r, cb),
}));

export function setFakeDb(data: Record<string, any>) {
  state.db = clone(data);
}

/** Set a value at `path` and notify any onValue listeners on that path. */
export function updateFakeDb(path: string, value: any) {
  const keys = path.split("/").filter(Boolean);
  const last = keys.pop()!;
  const parent = keys.reduce((o, k) => (o[k] ??= {}), state.db);
  parent[last] = clone(value);
  state.listeners
    .filter((l) => path.startsWith(l.path) || l.path.startsWith(path))
    .forEach((l) => l.cb(snapshot(l.path)));
}

/** Make any get() under `path` reject, to test error handling. */
export function failReadsUnder(path: string) {
  state.failPaths.add(path);
}

export function resetFakeDb() {
  state.db = {};
  state.listeners = [];
  state.failPaths.clear();
  fbGet.mockClear();
  fbOnValue.mockClear();
}
