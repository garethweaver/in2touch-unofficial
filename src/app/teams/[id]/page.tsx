"use client";
import { use } from "react";
import dynamic from "next/dynamic";
// due to useLocalStorage hook and ssr
const TeamDetail = dynamic(() => import("./TeamPage"), { ssr: false });

export default function Page({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <TeamDetail id={id} />;
}
