"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
    <main className="min-h-screen bg-[#101315] text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-5">
        <div className="mb-4 border-b border-white/16 pb-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/58">
            03 報到成功 / Check-in Successful
          </p>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <div className="relative overflow-hidden rounded-[28px] border border-white/22 bg-[#0c1012] px-5 pb-7 pt-4 text-center shadow-2xl shadow-black/50 ring-4 ring-white/[0.04]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.06),transparent_18%)]" />
            <div className="pointer-events-none absolute inset-x-6 top-24 h-px bg-white/18" />

            <div className="relative flex items-center justify-between font-mono text-[10px] text-white">
              <span>11:34</span>
              <span className="tracking-[0.16em]">...</span>
            </div>

            <div className="relative mx-auto mt-7 w-32">
              <Image
                src="/henduo-duo-logo.png"
                alt="HENDUO MUSIC"
                width={640}
                height={286}
                priority
                className="h-auto w-full"
              />
            </div>

            <div className="relative mx-auto mt-10 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white">
              <span className="text-5xl leading-none">✓</span>
            </div>

            <div className="relative mt-8">
              <h1 className="text-3xl font-semibold tracking-[0.08em]">
                報到成功！
                <span className="mt-1 block font-mono text-xs uppercase tracking-[0.14em] text-white/70">
                  Check-in Successful
                </span>
              </h1>
              <p className="mt-4 text-lg">Hi, {attendeeName}</p>
              <p className="mt-1 text-sm text-white/58">歡迎回來！這是你第 {totalCheckins} 次參加我們的活動</p>
            </div>

            <div className="relative mt-6 space-y-3 text-left">
              <div className="border border-white/16 bg-black/28 p-4">
                <p className="text-xs text-white/42">本次活動</p>
                <p className="mt-2 font-semibold uppercase">{eventName}</p>
                <p className="mt-1 font-mono text-xs text-white/58">{fallbackEvent.eventDate} / {fallbackEvent.venue}</p>
              </div>
            </div>

            <div className="relative mt-7">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/56">關注我們 / Follow Us</p>
              <div className="grid grid-cols-2 gap-3">
                {henduoSocialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 flex h-11 items-center justify-center border border-white/14 bg-white/[0.04] text-xs font-medium transition hover:bg-white hover:text-black"
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

            <Link
              href={`/checkin/${eventId}`}
              className="relative mt-4 inline-block text-xs font-medium text-white/40 underline-offset-4 hover:text-white/70 hover:underline"
            >
              返回報到頁
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
