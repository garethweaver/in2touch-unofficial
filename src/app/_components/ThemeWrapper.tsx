"use client";
import { useState } from "react";
import { useCompareAndUpateCache } from "@/app/_helpers/helpers";
import { ConnectionProvider, useOnline } from "@/app/_helpers/connection";
import Header from "@/app/_components/Header";
import OfflineBanner from "@/app/_components/OfflineBanner";
import styles from "./ThemeWrapper.module.sass";

function Shell({ children }: { readonly children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  useCompareAndUpateCache(setLoading);
  const online = useOnline();

  return (
    <div>
      <div className={styles.pageWrapper}>
        {/* a sync can't finish while offline, so don't spin forever */}
        <Header loading={loading && online} />
        {!online && <OfflineBanner />}
        {children}
      </div>
      <div className={styles.pageBg} />
    </div>
  );
}

export default function ThemeWrapper({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <ConnectionProvider>
      <Shell>{children}</Shell>
    </ConnectionProvider>
  );
}
