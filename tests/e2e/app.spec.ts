import { test, expect, type Page } from "@playwright/test";
import { resetDb, setDb } from "./emulator";
import { buildSeed } from "./seed";

// Each test starts with a freshly seeded emulator and an empty browser profile.
test.beforeEach(async () => {
  await resetDb(buildSeed());
});

const homeTeamCard = (page: Page, name: string) =>
  page.locator(".util-card", { has: page.getByRole("heading", { name, level: 3 }) });

test("first visit shows the intro", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Alright, let's go!" })).toBeVisible();
});

test("find a team, add it, and it stays on the homescreen", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Add team" }).click();

  await page.getByPlaceholder("Search...").fill("touch");
  await expect(page.getByRole("link", { name: "Slow Pokes" })).toBeHidden();
  await page.getByRole("link", { name: "Touch Me Not" }).click();

  await expect(page.getByRole("heading", { name: "Touch Me Not", level: 1 })).toBeVisible();
  await expect(page.getByText("Past Fixtures")).toBeVisible();
  await expect(page.getByText("6 - 2")).toBeVisible();
  await expect(page.getByText("Upcoming Fixtures")).toBeVisible();

  await page.getByRole("button", { name: "Add team to homescreen" }).click();
  await expect(page.getByText("Team added")).toBeVisible();

  await page.goto("/");
  await expect(homeTeamCard(page, "Touch Me Not")).toBeVisible();
  await expect(homeTeamCard(page, "Touch Me Not")).toContainText("19:30");

  await page.reload();
  await expect(homeTeamCard(page, "Touch Me Not")).toBeVisible();
});

test("follow a league", async ({ page }) => {
  await page.goto("/add/leagues");
  await page.getByRole("link", { name: "Thursday Mixed" }).click();

  await expect(page.getByRole("heading", { name: "Thursday Mixed", level: 1 })).toBeVisible();
  await expect(page.getByText("Slow Pokes")).toBeVisible();

  await page.getByRole("button", { name: "Add league to homescreen" }).click();
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Followed Leagues" })).toBeVisible();
});

test("homescreen picks up database updates live", async ({ page }) => {
  await page.goto("/teams/touch-me-not");
  await page.getByRole("button", { name: "Add team to homescreen" }).click();
  await page.goto("/");
  await expect(homeTeamCard(page, "Touch Me Not")).toBeVisible();

  // simulate the scraper publishing new data while the app is open
  await setDb("team-data/touch-me-not/name", "Touch Me Not (Renamed)");
  await setDb("config/teamDataHash", "t2");

  await expect(homeTeamCard(page, "Touch Me Not (Renamed)")).toBeVisible();
});

test("settings persist and clearing the cache resets the app", async ({ page }) => {
  await page.goto("/teams/touch-me-not");
  await page.getByRole("button", { name: "Add team to homescreen" }).click();

  await page.goto("/settings");
  await page.getByRole("button", { name: /12-hour/ }).click();
  await page.getByRole("button", { name: "Midnight" }).click();

  await page.goto("/");
  await expect(homeTeamCard(page, "Touch Me Not")).toContainText("7:30pm");
  await expect(page.locator(".Theme--2").first()).toBeAttached();

  await page.goto("/settings");
  await page.getByRole("button", { name: "Clear local cache" }).click();
  await expect(page.getByText("Cache dropped!")).toBeVisible();

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Alright, let's go!" })).toBeVisible();
});
