import Link from "next/link";

export default function Header({ loading }: { loading: boolean }) {
  return (
    <header>
      <Link href="/">Home</Link>
      <Link href="/settings">Settings</Link>
      {loading && "loading..."}
    </header>
  );
}
