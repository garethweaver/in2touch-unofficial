import { describe, it, expect } from "vitest";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { splashScreens } from "@/app/_helpers/splashScreens";

const PUBLIC = join(__dirname, "../../public");
const brands = readdirSync(PUBLIC, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

describe("iOS splash screens", () => {
  it.each(brands)("every startup image exists for %s", (brand) => {
    const images = splashScreens(brand) as { url: string }[];
    expect(images.length).toBeGreaterThan(0);
    const missing = images.map((i) => i.url).filter((url) => !existsSync(join(PUBLIC, url)));
    expect(missing).toEqual([]);
  });

  it("has one media query per device", () => {
    const media = (splashScreens("in2touch") as { media: string }[]).map((i) => i.media);
    expect(new Set(media).size).toBe(media.length);
  });
});
