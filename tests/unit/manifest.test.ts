import { describe, it, expect, vi, afterEach } from "vitest";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const PUBLIC = join(__dirname, "../../public");

// One public/<app> folder per branded build (e.g. in2touch, touchfootball-au)
const brands = readdirSync(PUBLIC, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

async function loadManifest(appName: string) {
  vi.stubEnv("NEXT_PUBLIC_APPNAME", appName);
  vi.resetModules(); // manifest.ts reads the env var at import time
  return (await import("@/app/manifest")).default();
}

afterEach(() => vi.unstubAllEnvs());

describe("manifest", () => {
  it("names the app", async () => {
    const m = await loadManifest("In2Touch");
    expect(m.name).toBe("In2Touch Unofficial");
    expect(m.short_name).toBe("In2Touch");
    expect(m.start_url).toBe("/");
    expect(m.display).toBe("standalone");
  });

  it("finds at least one brand folder", () => {
    expect(brands.length).toBeGreaterThan(0);
  });

  it.each(brands)("every icon exists for %s", async (brand) => {
    const m = await loadManifest(brand);
    const missing = m.icons!.map((i) => i.src).filter((src) => !existsSync(join(PUBLIC, src)));
    expect(missing).toEqual([]);
  });

  it("has a maskable icon at 192 and 512", async () => {
    const m = await loadManifest("In2Touch");
    const maskable = m.icons!.filter((i) => i.purpose === "maskable").map((i) => i.sizes);
    expect(maskable).toEqual(expect.arrayContaining(["192x192", "512x512"]));
  });
});
