import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { resetFakeDb } from "./firebaseMock";

// Every test file gets the in-memory Firebase mock (see firebaseMock.ts).
afterEach(() => {
  cleanup();
  localStorage.clear();
  document.documentElement.className = "";
  resetFakeDb();
});
