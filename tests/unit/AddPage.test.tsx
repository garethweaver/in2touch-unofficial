import { describe, it, expect } from "vitest";
import { Suspense } from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddPage from "@/app/add/[slug]/page";
import { setFakeDb, fbGet } from "./firebaseMock";
import { team } from "./fixtures";

const teams = {
  b: { id: "b", name: "Bravo", nameLowercased: "bravo", profileUrl: "" },
  a: { id: "a", name: "Alpha", nameLowercased: "alpha", profileUrl: "" },
  c: { id: "c", name: "Charlie", nameLowercased: "charlie", profileUrl: "" },
};

async function renderAdd(slug: string) {
  const params = Promise.resolve({ slug });
  await act(async () => {
    render(
      <Suspense fallback="suspended">
        <AddPage params={params} />
      </Suspense>,
    );
  });
}

describe("Add page", () => {
  it("fetches the full list, sorts it and caches it", async () => {
    setFakeDb({ teams });
    await renderAdd("teams");

    const links = await screen.findAllByRole("link");
    expect(links.map((l) => l.textContent)).toEqual(["Alpha", "Bravo", "Charlie"]);
    expect(links[0]).toHaveAttribute("href", "/teams/a");
    expect(fbGet).toHaveBeenCalledWith({ path: "teams" });
    expect(JSON.parse(localStorage.getItem("allTeams")!)).toHaveLength(3);
  });

  // KNOWN BUG: useLocalStorage(..., { initializeWithValue: false }) returns null on the
  // first render, so the fetch effect runs before the cached list is read and the full
  // list is downloaded every visit. Change `it.fails` to `it` once that's fixed.
  it.fails("uses the cached list instead of the database", async () => {
    localStorage.setItem("allTeams", JSON.stringify([teams.c]));
    await renderAdd("teams");

    expect(await screen.findByRole("link", { name: "Charlie" })).toBeInTheDocument();
    expect(fbGet).not.toHaveBeenCalled();
  });

  it("filters by the search box", async () => {
    setFakeDb({ teams });
    await renderAdd("teams");

    await userEvent.type(await screen.findByPlaceholderText("Search..."), "BRA");
    expect(screen.getAllByRole("link").map((l) => l.textContent)).toEqual(["Bravo"]);
  });

  it("marks items the user already follows", async () => {
    setFakeDb({ teams });
    localStorage.setItem("userTeams", JSON.stringify([team({ id: "b" })]));
    await renderAdd("teams");

    const bravo = await screen.findByRole("link", { name: "Bravo" });
    expect(bravo.closest("li")!.className).toMatch(/itemAdded/);
    expect(screen.getByRole("link", { name: "Alpha" }).closest("li")!.className).not.toMatch(
      /itemAdded/,
    );
  });

  it("works for leagues too", async () => {
    setFakeDb({ leagues: { x: { id: "x", name: "Monday Men", nameLowercased: "monday men" } } });
    await renderAdd("leagues");
    expect(await screen.findByRole("link", { name: "Monday Men" })).toHaveAttribute(
      "href",
      "/leagues/x",
    );
  });
});
