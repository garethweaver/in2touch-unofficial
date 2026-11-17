"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import Loader from "@/app/_components/Loader";

// Client only: it reads saved data from localStorage, which the server
// (e.g. next dev rendering ?id= on the server) can't see, so SSR would
// render the loader and then mismatch on hydration.
const LeagueDetail = dynamic(() => import("./LeaguePage"), {
  ssr: false,
  loading: () => <Loader type="center" />,
});

function LeagueFromQuery() {
  const id = useSearchParams().get("id");
  if (!id) {
    return (
      <main>
        <em className="util-color--muted">No league selected</em>
      </main>
    );
  }
  // key: remount when navigating between leagues on this same page
  return <LeagueDetail key={id} id={id} />;
}

export default function Page() {
  return (
    <Suspense fallback={<Loader type="center" />}>
      <LeagueFromQuery />
    </Suspense>
  );
}
