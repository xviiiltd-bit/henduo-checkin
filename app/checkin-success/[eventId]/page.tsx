"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { HenduoPageShell, HenduoPhone } from "../../checkin/henduo-ui";
import {
  getEventFallback,
  henduoSocialLinks,
} from "../../checkin/checkin-data";
import type { CheckInSuccessPayload } from "../../checkin/checkin-data";

const successKey = (eventId: string) => `henduo_checkin_success_${eventId}`;

export default function HenduoCheckInSuccessPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = params.eventId;
  const fallbackEvent = useMemo(() => getEventFallback(eventId), [eventId]);
  const [data, setData] = useState<CheckInSuccessPayload | null>(null);

  useEffect(() => {
    const cached = sessionStorage.getItem(successKey(eventId));
    if (cached) {
      setData(JSON.parse(cached));
    }
  }, [eventId]);

  const eventName = data?.eventName ?? fallbackEvent.eventName;
  const attendeeName = data?.attendeeName ?? "Guest";
  const totalCheckins = data?.totalCheckins ?? 1;

  return (
    <HenduoPageShell activeStep="success">
      <HenduoPhone>
        <div className="relative text-center">
          <div className="mx-auto mt-10 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white shadow-[0_0_26px_rgba(255,255,255,0.18)]">
            <span className="text-5xl leading-none">✓</span>
          </div>

          <div className="mt-8">
            <h2 className="text-3xl font-semibold tracking-[0.08em]">
              報到成功！
              <span className="mt-1 block font-mono text-xs uppercase tracking-[0.14em] text-white/70">
                Check-in Successful
              </span>
            </h2>
            <p className="mt-4 text-lg">Hi, {attendeeName}</p>
            <p className="mt-1 text-sm text-white/58">
              歡迎回來！這是你第 {totalCheckins} 次參加我們的活動
            </p>
          </div>
        </div>

        <div className="relative mt-6 border border-white/16 bg-black/28 p-4 text-left">
          <p className="text-xs text-white/42">本次活動</p>
          <p className="mt-2 font-semibold uppercase">{eventName}</p>
          <p className="mt-1 font-mono text-xs text-white/58">
            {fallbackEvent.eventDate} / {fallbackEvent.venue}
          </p>
        </div>

        <div className="relative mt-7">
          <p className="text-center font-mono text-xs uppercase tracking-[0.16em] text-white/56">
            關注我們 / Follow Us
          </p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {henduoSocialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex h-12 items-center justify-center border border-white/14 bg-white/[0.04] text-[10px] font-medium transition hover:bg-white hover:text-black"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <Link
          href={`/reward/${eventId}`}
          className="relative mt-6 flex h-[52px] w-full items-center justify-center border border-white/70 bg-white/[0.04] font-mono text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-black"
        >
          參加抽獎
        </Link>

        <button
          type="button"
          className="relative mt-4 block w-full text-center text-xs font-medium text-white/40 underline-offset-4 hover:text-white/70 hover:underline"
          onClick={() => {
            alert("目前為本機展示版；正式版會產出可分享 IG 限動的圖片。");
          }}
        >
          分享至限動
        </button>
      </HenduoPhone>
    </HenduoPageShell>
  );
}
