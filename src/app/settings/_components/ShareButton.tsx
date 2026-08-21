"use client";
import { useState } from "react";
import { useCopyToClipboard } from "usehooks-ts";
import Button from "@/app/_components/Button";

export default function ShareButton() {
  const [copied, setCopied] = useState<boolean>(false);
  const [, copyToClipboard] = useCopyToClipboard();

  const handleCopyUrl = async () => {
    const url = window.location.origin;
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return copied ? (
    <Button icon="check" faux>
      URL copied!
    </Button>
  ) : (
    <Button icon="share-2" onClick={handleCopyUrl}>
      Copy URL to share
    </Button>
  );
}
