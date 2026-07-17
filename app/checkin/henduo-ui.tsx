import Image from "next/image";
import type { ReactNode } from "react";

type JourneyHeaderProps = {
  activeStep: "scan" | "input" | "success" | "reward";
};

const steps = [
  { id: "scan", label: "01 掃碼進入" },
  { id: "input", label: "02 輸入資訊" },
  { id: "success", label: "03 報到成功" },
  { id: "reward", label: "04 抽獎結果" },
] as const;

export function HenduoPageShell({
  activeStep,
  children,
}: {
  activeStep: JourneyHeaderProps["activeStep"];
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#101315] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_78%_8%,rgba(255,255,255,0.13),transparent_22rem),radial-gradient(circle_at_28%_88%,rgba(255,255,255,0.08),transparent_20rem),linear-gradient(180deg,#15191b,#080a0b)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.11] [background-image:linear-gradient(rgba(255,255,255,.45)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.45)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="pointer-events-none fixed inset-3 border border-white/18" />
      <div className="pointer-events-none fixed left-3 top-3 h-6 w-6 border-l-2 border-t-2 border-white/70" />
      <div className="pointer-events-none fixed right-3 top-3 h-6 w-6 border-r-2 border-t-2 border-white/70" />
      <div className="pointer-events-none fixed bottom-3 left-3 h-6 w-6 border-b-2 border-l-2 border-white/70" />
      <div className="pointer-events-none fixed bottom-3 right-3 h-6 w-6 border-b-2 border-r-2 border-white/70" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-5">
        <JourneyHeader activeStep={activeStep} />
        <div className="flex flex-1 flex-col justify-center">{children}</div>
        <p className="relative py-4 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-white/48">
          HENDUO MUSIC
        </p>
      </section>
    </main>
  );
}

function JourneyHeader({ activeStep }: JourneyHeaderProps) {
  return (
    <header className="relative mb-4 border-b border-white/16 pb-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/58">
            Check-in Journey
          </p>
          <h1 className="mt-2 text-xl font-semibold tracking-[0.08em]">
            活動報到系統
          </h1>
        </div>
        <div className="h-12 w-20 shrink-0">
          <Image
            src="/henduo-duo-logo.png"
            alt="HENDUO MUSIC"
            width={640}
            height={286}
            priority
            className="h-full w-full object-contain"
          />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {steps.map((step) => {
          const active = step.id === activeStep;
          return (
            <div
              key={step.id}
              className={`border px-2 py-2 text-center font-mono text-[10px] ${
                active
                  ? "border-white/70 bg-white text-black"
                  : "border-white/14 bg-white/[0.03] text-white/42"
              }`}
            >
              {step.label}
            </div>
          );
        })}
      </div>
    </header>
  );
}

export function HenduoPhone({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-[30px] border border-white/30 bg-[#090d0f] px-4 pb-6 pt-4 shadow-2xl shadow-black/70 ring-4 ring-white/[0.08]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(255,255,255,0.16),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.07),transparent_18%)]" />
      <div className="pointer-events-none absolute inset-x-6 top-24 h-px bg-white/18" />
      <div className="pointer-events-none absolute inset-x-8 bottom-24 h-px bg-white/12" />
      <StatusBar />
      <DuoLogo />
      {children}
    </div>
  );
}

function StatusBar() {
  return (
    <div className="relative flex items-center justify-between font-mono text-[10px] text-white">
      <span>11:34</span>
      <span className="flex items-center gap-1">
        <span className="h-2 w-3 border border-white/80" />
        <span className="h-2 w-3 border border-white/80 bg-white/80" />
        <span className="h-2 w-4 rounded-sm border border-white/80" />
      </span>
    </div>
  );
}

export function DuoLogo() {
  return (
    <div className="relative mx-auto mt-7 w-28">
      <Image
        src="/henduo-duo-logo.png"
        alt="HENDUO MUSIC"
        width={640}
        height={286}
        priority
        className="h-auto w-full"
      />
    </div>
  );
}

export function TechFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative border border-white/28 bg-black/24 p-5 shadow-[0_0_28px_rgba(255,255,255,0.08)]">
      <span className="absolute left-3 top-3 h-5 w-5 border-l-2 border-t-2 border-white/80" />
      <span className="absolute right-3 top-3 h-5 w-5 border-r-2 border-t-2 border-white/80" />
      <span className="absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-white/80" />
      <span className="absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-white/80" />
      {children}
    </div>
  );
}

export function TicketGraphic() {
  return (
    <div className="relative mx-auto flex min-h-32 w-full items-center justify-center border border-white/28 bg-black/28 px-6 py-6 shadow-[0_0_24px_rgba(255,255,255,0.08)]">
      <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-white/24 bg-[#090d0f]" />
      <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-white/24 bg-[#090d0f]" />
      <div className="text-5xl">▽</div>
      <div className="ml-6 h-20 border-l border-dashed border-white/42" />
    </div>
  );
}
