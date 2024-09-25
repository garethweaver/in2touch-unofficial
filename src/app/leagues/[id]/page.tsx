"use client";
import dynamic from "next/dynamic";
// due to useLocalStorage hook and ssr
const LeagueDetail = dynamic(() => import("./LeaguePage"), { ssr: false });

export default function Page({ params }: { readonly params: { id: string } }) {
  return <LeagueDetail id={params.id} />;
}
