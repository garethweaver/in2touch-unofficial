import { describe, it, expect } from "vitest";
import { formatTime, sortNameLowerByAlpha } from "@/app/_helpers/helpers";

describe("formatTime", () => {
  it("leaves 24h times alone", () => {
    expect(formatTime("19:30", false)).toBe("19:30");
  });

  it.each([
    ["19:30", "7:30pm"],
    ["12:00", "12:00pm"],
    ["00:05", "12:05am"],
    ["09:00", "9:00am"],
    ["11:59", "11:59am"],
  ])("converts %s to %s", (input, expected) => {
    expect(formatTime(input, true)).toBe(expected);
  });
});

describe("sortNameLowerByAlpha", () => {
  it("sorts by nameLowercased", () => {
    const items = [
      { nameLowercased: "zebras" },
      { nameLowercased: "aardvarks" },
      { nameLowercased: "moose" },
    ];
    expect(items.sort(sortNameLowerByAlpha).map((i) => i.nameLowercased)).toEqual([
      "aardvarks",
      "moose",
      "zebras",
    ]);
  });

  it("returns 0 for equal names", () => {
    expect(sortNameLowerByAlpha({ nameLowercased: "a" }, { nameLowercased: "a" })).toBe(0);
  });
});
