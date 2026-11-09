import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Location from "@/app/teams/_components/Location";
import ShareButton from "@/app/settings/_components/ShareButton";
import Header from "@/app/_components/Header";
import ThemeWrapper from "@/app/_components/ThemeWrapper";
import { fbOnValue } from "./firebaseMock";
import { seedLocal } from "./testUtils";

const nav = vi.hoisted(() => ({ pathname: "/", back: vi.fn() }));
vi.mock("next/navigation", () => ({
  usePathname: () => nav.pathname,
  useRouter: () => ({ back: nav.back }),
}));

beforeEach(() => {
  nav.pathname = "/";
  nav.back.mockClear();
});
afterEach(() => vi.useRealTimers());

describe("Location", () => {
  it("joins pitch and league", () => {
    const { container } = render(<Location pitch="Field 2" leagueName="Thursday Mixed" />);
    expect(container).toHaveTextContent("Field 2 - Thursday Mixed…");
  });

  it("truncates long league names to 25 characters", () => {
    render(<Location pitch="" leagueName="Thursday Night Mixed Social Division 3" />);
    expect(screen.getByText("Thursday Night Mixed Soci…")).toBeInTheDocument();
  });

  it("handles a missing league or pitch", () => {
    const { container, rerender } = render(<Location pitch="Field 2" leagueName="" />);
    expect(container).toHaveTextContent(/^Field 2$/);
    rerender(<Location pitch="" leagueName="Mixed" />);
    expect(container).toHaveTextContent(/^Mixed…$/);
    rerender(<Location pitch="Field 2" leagueName={null} />);
    expect(container).toHaveTextContent(/^Field 2$/);
    rerender(<Location pitch="Field 2" />);
    expect(container).toHaveTextContent(/^Field 2$/);
  });
});

describe("ShareButton", () => {
  it("copies the site URL and confirms for 2 seconds", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<ShareButton />);

    await user.click(screen.getByRole("button", { name: "Copy URL to share" }));

    expect(await navigator.clipboard.readText()).toBe(window.location.origin);
    expect(screen.getByText("URL copied!")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByRole("button", { name: "Copy URL to share" })).toBeInTheDocument();
  });

  it("doesn't claim success if copying fails", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("denied"));
    vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<ShareButton />);

    await user.click(screen.getByRole("button", { name: "Copy URL to share" }));

    expect(screen.queryByText("URL copied!")).toBeNull();
  });
});

describe("Header", () => {
  it("shows the logo and settings link on the homescreen", () => {
    render(<Header loading={false} />);
    expect(screen.getByRole("heading", { name: "In2Touch Unofficial" })).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/settings");
    expect(screen.queryByRole("button", { name: /back/i })).toBeNull();
  });

  it("shows Home and Back on other pages", async () => {
    nav.pathname = "/teams/abc";
    render(<Header loading={false} />);
    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute("href", "/");

    await userEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(nav.back).toHaveBeenCalledOnce();
  });

  it.each(["/", "/settings"])("shows the loader while loading on %s", (path) => {
    nav.pathname = path;
    const { container, rerender } = render(<Header loading />);
    expect(container.querySelector('[class*="loading"]')).not.toBeNull();
    rerender(<Header loading={false} />);
    expect(container.querySelector('[class*="loading"]')).toBeNull();
  });
});

describe("ThemeWrapper", () => {
  it("renders the page with the default theme", () => {
    const { container } = render(<ThemeWrapper><p>Page content</p></ThemeWrapper>);
    expect(screen.getByText("Page content")).toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass("Theme--1");
  });

  it("applies the saved theme", async () => {
    seedLocal("userSettings", { theme: 4, timeFormat: "24h" });
    const { container } = render(<ThemeWrapper><p>x</p></ThemeWrapper>);
    await vi.waitFor(() => expect(container.firstElementChild).toHaveClass("Theme--4"));
  });

  it("shows the header loader until Firebase answers", () => {
    fbOnValue.mockImplementationOnce(() => () => {}); // never answers
    const { container } = render(<ThemeWrapper><p>x</p></ThemeWrapper>);
    expect(container.querySelector('[class*="loading"]')).not.toBeNull();
  });

  it("hides the loader once synced", async () => {
    const { container } = render(<ThemeWrapper><p>x</p></ThemeWrapper>);
    await vi.waitFor(() => expect(container.querySelector('[class*="loading"]')).toBeNull());
    expect(fbOnValue).toHaveBeenCalledWith({ path: "config" }, expect.any(Function));
  });
});
