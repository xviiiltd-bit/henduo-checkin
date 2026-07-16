"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import {
  findHenduoRegistrations,
  getEventFallback,
  maskEmail,
} from "../checkin-data";
import type { CheckInSuccessPayload, HenduoRegistration } from "../checkin-data";

const checkedInKey = (eventId: string) => `henduo_checked_in_${eventId}`;
const successKey = (eventId: string) => `henduo_checkin_success_${eventId}`;

export default function HenduoCheckInPage() {
  const params = useParams<{ eventId: string }>();
  const router = useRouter();
  const eventId = params.eventId;
  const event = useMemo(() => getEventFallback(eventId), [eventId]);
  const [lookup, setLookup] = useState("");
  const normalizedLookup = lookup.trim();
  const [message, setMessage] = useState("");
  const [matches, setMatches] = useState<HenduoRegistration[]>([]);
  const [loading, setLoading] = useState(false);

  function completeCheckIn(registration: HenduoRegistration) {
    const existingRaw = localStorage.getItem(checkedInKey(eventId));
    const checkedInIds: string[] = existingRaw ? JSON.parse(existingRaw) : [];

    if (checkedInIds.includes(registration.id)) {
      setMessage("你已經完成本場活動報到。");
      setMatches([]);
      return;
    }

    const payload: CheckInSuccessPayload = {
      eventId,
      eventName: registration.eventName,
      eventDate: registration.eventDate,
      venue: registration.venue,
      attendeeName: registration.name,
      ticketType: registration.ticketType,
      totalCheckins: registration.totalCheckins + 1,
      checkinTime: new Date().toISOString(),
    };

    localStorage.setItem(checkedInKey(eventId), JSON.stringify([...checkedInIds, registration.id]));
    sessionStorage.setItem(successKey(eventId), JSON.stringify(payload));
    router.push(`/checkin-success/${eventId}`);
  }

  function handleSubmit(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    setLoading(true);
    setMessage("");
    setMatches([]);

    window.setTimeout(() => {
      const found = findHenduoRegistrations(eventId, normalizedLookup);

      if (found.length === 0) {
        setMessage("找不到報名資料，請洽現場工作人員協助。");
      } else if (!normalizedLookup.includes("@") && found.length > 1) {
        setMessage("找到多筆同名資料，請選擇你的票券完成報到。");
        setMatches(found);
      } else {
        completeCheckIn(found[0]);
      }

      setLoading(false);
    }, 260);
  }

  return (
    <main className="min-h-screen bg-[#101315] text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-5">
        <div className="mb-4 border-b border-white/16 pb-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/58">
            02 輸入資訊 / Event Check-in System
          </p>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <div className="relative overflow-hidden rounded-[28px] border border-white/22 bg-[#0c1012] px-5 pb-7 pt-4 shadow-2xl shadow-black/50 ring-4 ring-white/[0.04]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_0%,rgba(255,255,255,0.12),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.06),transparent_18%)]" />
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

            <div className="relative mt-11 text-center">
              <p className="font-mono text-xs uppercase text-white/78">Event Check-in</p>
              <h1 className="mt-3 text-2xl font-semibold tracking-[0.08em]">請輸入您的資訊</h1>
            </div>

            <form className="relative mt-7 space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 border border-white/16 bg-white/[0.04] text-center text-xs text-white/62">
                <span className="border-r border-white/12 px-3 py-3">電子郵件 Email</span>
                <span className="px-3 py-3">中文姓名 Name</span>
              </div>

              <label className="block">
                <span className="sr-only">Email 或中文姓名</span>
                <input
                  value={lookup}
                  onChange={(event) => {
                    setLookup(event.target.value);
                    setMessage("");
                    setMatches([]);
                  }}
                  placeholder="請輸入電子郵件或中文姓名"
                  className="h-[52px] w-full border border-white/18 bg-black/25 px-4 text-sm text-white outline-none transition placeholder:text-white/32 focus:border-white/70"
                  autoCapitalize="none"
                  autoComplete="email name"
                />
              </label>

              {message && (
                <div className="border border-white/16 bg-white/[0.06] px-4 py-3 text-sm leading-5 text-white/78">
                  {message}
                </div>
              )}

              {matches.length > 0 && (
                <div className="space-y-2 border border-white/14 bg-black/24 p-3">
                  {matches.map((match) => (
                    <button
                      key={match.id}
                      type="button"
                      onClick={() => completeCheckIn(match)}
                      className="flex w-full items-center justify-between border border-white/12 bg-white/[0.06] px-4 py-3 text-left transition hover:bg-white/[0.1]"
                    >
                      <span>
                        <span className="block text-sm font-semibold">{match.name}</span>
                        <span className="block text-xs text-white/48">
                          {maskEmail(match.email)} / {match.ticketType}
                        </span>
                      </span>
                      <span className="font-mono text-xs uppercase tracking-[0.12em] text-white/62">
                        Select
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !normalizedLookup}
                className="h-[52px] w-full border border-white/70 bg-white/[0.04] font-mono text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:border-white/16 disabled:text-white/32"
              >
                {loading ? "搜尋中..." : "查詢 Search"}
              </button>
            </form>

            <div className="relative my-7 flex items-center gap-3 text-center text-xs text-white/56">
              <span className="h-px flex-1 bg-white/16" />
              <span>或</span>
              <span className="h-px flex-1 bg-white/16" />
            </div>

            <div className="relative text-center text-xs leading-5 text-white/54">
              <p>找不到報名資料？</p>
              <p>請洽現場工作人員</p>
              <p className="mt-4 font-mono uppercase tracking-[0.16em] text-white/28">
                Event ID / {eventId}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
