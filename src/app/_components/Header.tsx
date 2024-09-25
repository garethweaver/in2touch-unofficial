import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Icon from "@/app/_components/Icon";
import Loader from "@/app/_components/Loader";
import "./Header.sass";

export default function Header({ loading }: { readonly loading: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <header className="Header">
      {pathname === "/" ? (
        <>
          <div className="Header__left">
            <span className="Header__logo">In2Touch Unofficial</span>
          </div>
          {loading && (
            <div className="Header__loading">
              <Loader className="small" />
            </div>
          )}
          <Link href="/settings" prefetch>
            <Icon name="settings" />
          </Link>
        </>
      ) : (
        <>
          <div className="Header__left">
            <Link href="/" prefetch>
              <Icon name="home" className="header-icon" />
              Home
            </Link>
          </div>
          {loading && (
            <div className="Header__loading">
              <Loader className="small" />
            </div>
          )}
          <button onClick={() => router.back()}>
            <Icon name="arrow-left" className="header-icon" />
            Back
          </button>
        </>
      )}
    </header>
  );
}
