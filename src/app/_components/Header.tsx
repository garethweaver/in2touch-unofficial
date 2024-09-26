import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Icon from "@/app/_components/Icon";
import Loader from "@/app/_components/Loader";
import styles from "./Header.module.sass";

function HeaderLoader() {
  return (
    <div className={styles.loading}>
      <Loader type="small" />
    </div>
  );
}

export default function Header({ loading }: { readonly loading: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <header className={styles.root}>
      {pathname === "/" ? (
        <>
          <div className={styles.left}>
            <h1 className={styles.logo}>In2Touch Unofficial</h1>
          </div>
          {loading && <HeaderLoader />}
          <Link href="/settings">
            <Icon name="settings" />
          </Link>
        </>
      ) : (
        <>
          <div className={styles.left}>
            <Link href="/">
              <Icon name="home" className={styles.icon} />
              Home
            </Link>
          </div>
          {loading && <HeaderLoader />}
          <button onClick={() => router.back()}>
            <Icon name="arrow-left" className={styles.icon} />
            Back
          </button>
        </>
      )}
    </header>
  );
}
