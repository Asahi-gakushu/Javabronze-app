"use client";

import { useEffect } from "react";
import { adsenseClient, adsenseSlot } from "@/lib/monetization";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

// NEXT_PUBLIC_ADSENSE_CLIENT / _SLOT が設定されるまでは何も表示しない。
export default function AdSlot({ className = "" }: { className?: string }) {
  const enabled = Boolean(adsenseClient && adsenseSlot);

  useEffect(() => {
    if (!enabled) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // 広告ブロッカーやスクリプト未読込の場合 — 広告なしでもページは動く。
    }
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className={className}>
      <p className="mb-1 text-center text-xs opacity-50">スポンサーリンク</p>
      <ins
        className="adsbygoogle block"
        data-ad-client={adsenseClient}
        data-ad-slot={adsenseSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
