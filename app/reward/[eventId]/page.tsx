"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { henduoDemoReward } from "../../checkin/checkin-data";

export default function HenduoRewardPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = params.eventId;

  return (
    <main className="min-h-screen bg-[#101315] text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-5">
        <div className="mb-4 border-b border-white/16 pb-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/58">
            04 抽獎結果 / Lucky Draw
          </p>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <div className="relative overflow-hidden rounded-[28px] border border-white/22 bg-[#0c1012] px-5 pb-7 pt-4 text-center shadow-2xl shadow-black/50 ring-4 ring-white/[0.04]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(255,255,255,0.13),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.06),transparent_18%)]" />
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

            <div className="relative mt-11">
              <p className="font-mono text-xs uppercase text-white/78">Lucky Draw</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[0.08em]">恭喜你！</h1>
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-white/66">
                Congratulations!
              </p>
            </div>

            <div className="relative mx-auto mt-8 flex min-h-32 w-full items-center justify-center border border-white/24 bg-black/28 px-6 py-6 shadow-[0_0_24px_rgba(255,255,255,0.08)]">
              <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-white/22 bg-[#0c1012]" />
              <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-white/22 bg-[#0c1012]" />
              <div className="font-mono text-2xl font-semibold tracking-[0.18em]">DRINK</div>
              <div className="ml-5 h-20 border-l border-dashed border-white/38" />
            </div>

            <div className="relative mt-7">
              <p className="text-sm text-white/55">你抽中了</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[0.05em]">
                {henduoDemoReward.rewardName}
              </h2>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.12em] text-white/58">
                {henduoDemoReward.rewardNameEn}
              </p>
            </div>

            <div className="relative mt-6 border border-white/14 bg-white/[0.04] px-4 py-5">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/54">
                兌換說明 / Redemption Info
              </p>
              <p className="mt-3 text-sm leading-6 text-white/76">{henduoDemoReward.instruction}</p>
            </div>

            <button
              type="button"
              className="relative mt-6 h-[52px] w-full border border-white/70 bg-white/[0.04] font-mono text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-black"
              onClick={() => {
                alert("目前為本機展示版；正式版會產出可分享 IG 限動的圖片。");
              }}
            >
              分享至限動
            </button>

            <Link
              href={`/checkin-success/${eventId}`}
              className="relative mt-4 inline-block text-xs font-medium text-white/40 underline-offset-4 hover:text-white/70 hover:underline"
            >
              查看我的獎品
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
