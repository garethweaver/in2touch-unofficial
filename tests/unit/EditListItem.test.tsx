import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditListItem from "@/app/_components/EditListItem";
import { iconButton, readLocal, seedLocal } from "./testUtils";

const list = () => [{ id: "a" }, { id: "b" }, { id: "c" }];
const ids = (key = "userTeams") => readLocal(key).map((i: { id: string }) => i.id);

function renderItem(id: string, localStorageKey = "userTeams") {
  const callback = vi.fn();
  const parentClick = vi.fn();
  const utils = render(
    // EditListItem sits inside a <Link> in the app, so clicks must not bubble up
    <div onClick={parentClick}>
      <EditListItem localStorageKey={localStorageKey} id={id} callback={callback} />
    </div>,
  );
  const btn = (icon: string) => iconButton(utils.container, icon);
  return { ...utils, callback, parentClick, btn };
}

describe("EditListItem: which buttons show", () => {
  it.each([
    ["a", { up: false, down: true }],
    ["b", { up: true, down: true }],
    ["c", { up: true, down: false }],
  ])("item %s", (id, expected) => {
    seedLocal("userTeams", list());
    const { btn } = renderItem(id);
    expect(!!btn("arrow-up-circle")).toBe(expected.up);
    expect(!!btn("arrow-down-circle")).toBe(expected.down);
    expect(btn("trash-2")).not.toBeNull();
  });

  it("shows no move buttons for a single item", () => {
    seedLocal("userTeams", [{ id: "a" }]);
    const { btn } = renderItem("a");
    expect(btn("arrow-up-circle")).toBeNull();
    expect(btn("arrow-down-circle")).toBeNull();
  });

  it("only offers the spacing toggle for teams", () => {
    seedLocal("userLeagues", list());
    const { btn } = renderItem("a", "userLeagues");
    expect(btn("align-justify")).toBeNull();
  });
});

describe("EditListItem: reordering", () => {
  it.each([
    ["a", "arrow-down-circle", ["b", "a", "c"]],
    ["b", "arrow-up-circle", ["b", "a", "c"]],
    ["b", "arrow-down-circle", ["a", "c", "b"]],
    ["c", "arrow-up-circle", ["a", "c", "b"]],
  ])("moving %s with %s gives %j", async (id, icon, expected) => {
    seedLocal("userTeams", list());
    const { btn, callback, parentClick } = renderItem(id);

    await userEvent.click(btn(icon)!);

    expect(ids()).toEqual(expected);
    expect(callback).toHaveBeenCalledWith(false);
    expect(parentClick).not.toHaveBeenCalled();
  });

  it("works on leagues as well as teams", async () => {
    seedLocal("userLeagues", list());
    const { btn } = renderItem("c", "userLeagues");
    await userEvent.click(btn("arrow-up-circle")!);
    expect(ids("userLeagues")).toEqual(["a", "c", "b"]);
  });

  it("keeps the full item data when moving", async () => {
    seedLocal("userTeams", [{ id: "a", name: "A", fixtures: [1] }, { id: "b", name: "B" }]);
    const { btn } = renderItem("a");
    await userEvent.click(btn("arrow-down-circle")!);
    expect(readLocal("userTeams")).toEqual([{ id: "b", name: "B" }, { id: "a", name: "A", fixtures: [1] }]);
  });
});

describe("EditListItem: deleting", () => {
  it.each([
    ["a", ["b", "c"]],
    ["b", ["a", "c"]],
    ["c", ["a", "b"]],
  ])("deleting %s leaves %j", async (id, expected) => {
    seedLocal("userTeams", list());
    const { btn, callback, parentClick } = renderItem(id);

    await userEvent.click(btn("trash-2")!);

    expect(ids()).toEqual(expected);
    expect(callback).toHaveBeenCalledWith(false);
    expect(parentClick).not.toHaveBeenCalled();
  });

  it("can delete the only item", async () => {
    seedLocal("userTeams", [{ id: "a" }]);
    const { btn } = renderItem("a");
    await userEvent.click(btn("trash-2")!);
    expect(readLocal("userTeams")).toEqual([]);
  });
});

describe("EditListItem: spacing toggle", () => {
  it("toggles spacing for this team only and keeps other settings", async () => {
    seedLocal("userTeams", list());
    seedLocal("userSettings", {
      theme: 3,
      timeFormat: "12h",
      teamDisplaySettings: { c: { spaced: true } },
    });
    const { btn, callback, parentClick } = renderItem("a");

    await userEvent.click(btn("align-justify")!);
    expect(readLocal("userSettings")).toEqual({
      theme: 3,
      timeFormat: "12h",
      teamDisplaySettings: { a: { spaced: true }, c: { spaced: true } },
    });

    await userEvent.click(btn("align-justify")!);
    expect(readLocal("userSettings").teamDisplaySettings.a).toEqual({ spaced: false });

    // the panel stays open so you can see the change, and the list is untouched
    expect(callback).not.toHaveBeenCalled();
    expect(parentClick).not.toHaveBeenCalled();
    expect(ids()).toEqual(["a", "b", "c"]);
  });
});
