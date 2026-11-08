import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { resetFakeDb } from "./firebaseMock";

// Every test file gets the in-memory Firebase mock (see firebaseMock.ts).
afterEach(() => {
  cleanup();
  localStorage.clear();
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0].trim();
    if (name) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
  resetFakeDb();
});
