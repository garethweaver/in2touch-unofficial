import { describe, it, expect, vi, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import ThemeWrapper from "@/app/_components/ThemeWrapper";
import { OFFLINE_GRACE_MS, useOnline } from "@/app/_helpers/connection";
import { setConnected } from "./firebaseMock";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ back: vi.fn() }),
}));

const banner = () => screen.queryByText(/Offline – showing your saved/);
const setBrowserOnline = (online: boolean) => {
  vi.spyOn(navigator, "onLine", "get").mockReturnValue(online);
  act(() => window.dispatchEvent(new Event(online ? "online" : "offline")));
};

afterEach(() => vi.useRealTimers());

describe("offline indicator", () => {
  it("is hidden while connected", () => {
    render(<ThemeWrapper><p>x</p></ThemeWrapper>);
    expect(banner()).toBeNull();
  });

  it("shows straight away when the browser goes offline, and hides when it's back", () => {
    render(<ThemeWrapper><p>x</p></ThemeWrapper>);
    setBrowserOnline(false);
    expect(banner()).not.toBeNull();
    setBrowserOnline(true);
    expect(banner()).toBeNull();
  });

  it("shows after the grace period when Firebase can't connect", () => {
    vi.useFakeTimers();
    render(<ThemeWrapper><p>x</p></ThemeWrapper>);
    act(() => setConnected(false));
    act(() => vi.advanceTimersByTime(OFFLINE_GRACE_MS - 100));
    expect(banner()).toBeNull(); // brief blips don't flash the banner

    act(() => vi.advanceTimersByTime(200));
    expect(banner()).not.toBeNull();

    act(() => setConnected(true));
    expect(banner()).toBeNull();
  });

  it("hides the header sync spinner while offline", () => {
    render(<ThemeWrapper><p>x</p></ThemeWrapper>);
    setBrowserOnline(false);
    expect(document.querySelector('[class*="loading"]')).toBeNull();
  });

  it("defaults to online outside the provider", () => {
    function Probe() {
      return <span>{useOnline() ? "online" : "offline"}</span>;
    }
    render(<Probe />);
    expect(screen.getByText("online")).toBeInTheDocument();
  });
});
