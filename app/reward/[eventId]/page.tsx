"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { HenduoPageShell, HenduoPhone, TicketGraphic } from "../../checkin/henduo-ui";
import { henduoDemoReward } from "../../checkin/checkin-data";

export default function HenduoRewardPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = params.eventId;

  return (
    <HenduoPageShell activeStep="reward">
      <HenduoPhone>
        <div className="relative mt-11 text-center">
          <p className="font-mono text-xs uppercase text-white/78">Lucky Draw</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[0.08em]">恭喜你！</h2>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-white/66">
            Congratulations!
          </p>
        </div>

        <div className="relative mt-8">
          <TicketGraphic />
        </div>

        <div className="relative mt-7 text-center">
          <p className="text-sm text-white/55">你抽中了</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[0.05em]">
            {henduoDemoReward.rewardName}
          </h2>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.12em] text-white/58">
            {henduoDemoReward.rewardNameEn}
          </p>
        </div>

        <div className="relative mt-6 border border-white/14 bg-white/[0.04] px-4 py-5 text-center">
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
          className="relative mt-4 block text-center text-xs font-medium text-white/40 underline-offset-4 hover:text-white/70 hover:underline"
        >
          查看我的獎品
        </Link>
      </HenduoPhone>
    </HenduoPageShell>
  );
}
