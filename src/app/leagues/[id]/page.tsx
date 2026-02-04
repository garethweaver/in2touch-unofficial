"use client";
import { use } from "react";
import dynamic from "next/dynamic";
// due to useLocalStorage hook and ssr
const LeagueDetail = dynamic(() => import("./LeaguePage"), { ssr: false });

export default function Page({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <LeagueDetail id={id} />;
}
