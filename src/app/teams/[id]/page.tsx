"use client";
import dynamic from "next/dynamic";
// due to useLocalStorage hook and ssr
const TeamDetail = dynamic(() => import("./TeamPage"), { ssr: false });

export default function Page({ params }: { readonly params: { id: string } }) {
  return <TeamDetail id={params.id} />;
}
