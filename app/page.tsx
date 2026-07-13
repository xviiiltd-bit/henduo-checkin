"use client";

import { useState } from "react";
import { useEffect } from "react";
import { weeklyEvents, type RaveEvent } from "./events";

type Base44Event = {
  id: string;
  title?: string;
  date?: string;
  venue?: string;
  genre?: string;
  tag?: string;
  description?: string;
  instagram_url?: string;
  registration_url?: string;
  is_published?: boolean;
  sort_order?: number;
};

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [flippedId, setFlippedId] = useState<string | null>(null);
  const [events, setEvents] = useState<RaveEvent[]>(weeklyEvents);
  const [eventSource, setEventSource] = useState<"base44" | "fallback">("fallback");

  useEffect(() => {
    let isMounted = true;

    async function loadEvents() {
      try {
        const { base44 } = await import("./base44Client");
        const records = (await base44.entities.Event.filter(
          { is_published: true },
          "sort_order",
          4,
          0
        )) as Base44Event[];

        const publishedEvents = records
          .filter((event) => event.title && event.instagram_url && event.registration_url)
          .map(toRaveEvent);

        if (isMounted && publishedEvents.length > 0) {
          setEvents(publishedEvents);
          setEventSource("base44");
        }
      } catch (error) {
        console.warn("Using fallback events because Base44 events could not load.", error);
      }
    }

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  function declineTonight() {
    setDeclined(true);
    window.setTimeout(() => setDeclined(false), 2600);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-black text-zinc-50">
      <div className="site-frame">
        <div className="ambient-grid" aria-hidden="true" />
        <div className="scanline" aria-hidden="true" />

        {!entered ? (
          <section className="landing-shell" aria-labelledby="landing-title">
            <p className="system-kicker">RAVE DESTINY // WEEKLY SELECTOR</p>
            <h1 id="landing-title" className="landing-title">
              <span className="welcome-line">Welcome</span>
              <span className="welcome-line">raver</span>
              <span className="question-line">Are you ready to go party tonight?</span>
            </h1>
            <div className="landing-actions" aria-label="Choose your answer">
              <button className="neon-button primary" onClick={() => setEntered(true)}>
                Yes
              </button>
              <button className="neon-button" onClick={declineTonight}>
                No
              </button>
            </div>
            <p className="status-copy" role="status" aria-live="polite">
              {declined ? "Maybe next weekend. See you soon." : "This week's signal is waiting."}
            </p>
          </section>
        ) : (
          <section className="events-shell" aria-labelledby="events-title">
            <div className="events-header">
              <div>
                <p className="system-kicker">MATCH FOUND</p>
                <h2 id="events-title">Select Event</h2>
              </div>
              <button
                className="neon-button compact"
                onClick={() => {
                  setEntered(false);
                  setFlippedId(null);
                }}
              >
                Home
              </button>
            </div>

            <div className="event-grid" aria-label="Weekly featured events">
              {events.map((event) => (
                <EventCard
                  event={event}
                  key={event.id}
                  flipped={flippedId === event.id}
                  onToggle={() =>
                    setFlippedId((current) => (current === event.id ? null : event.id))
                  }
                />
              ))}
            </div>
            <p className="game-prompt">
              {eventSource === "base44" ? "Live from Base44" : "Demo events"} / Press Enter
              or tap a card to flip
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

function toRaveEvent(event: Base44Event): RaveEvent {
  return {
    id: event.id,
    title: event.title ?? "Untitled Event",
    date: event.date ?? "TBA",
    venue: event.venue ?? "TBA",
    genre: event.genre ?? "Electronic",
    tag: event.tag ?? "Weekly Pick",
    description: event.description ?? "Tap through for this week's party signal.",
    instagram_url: event.instagram_url ?? "https://www.instagram.com/",
    registration_url: event.registration_url ?? "https://kktix.com/",
  };
}

function EventCard({
  event,
  flipped,
  onToggle,
}: {
  event: RaveEvent;
  flipped: boolean;
  onToggle: () => void;
}) {
  return (
    <article className={`event-card ${flipped ? "is-flipped" : ""}`}>
      <div className="event-card-inner">
        <button
          className="event-face event-front"
          type="button"
          onClick={onToggle}
          aria-label={`Show actions for ${event.title}`}
          aria-pressed={flipped}
        >
          <span className="card-corner card-corner-tl" />
          <span className="card-corner card-corner-tr" />
          <span className="card-corner card-corner-bl" />
          <span className="card-corner card-corner-br" />
          <span className="event-tag">{event.tag}</span>
          <span className={`pixel-poster poster-${event.id}`} aria-hidden="true">
            <span className="pixel-sun" />
            <span className="pixel-figure" />
            <span className="pixel-deck" />
          </span>
          <strong>{event.title}</strong>
          <span className="event-meta">{event.date} / {event.genre}</span>
          <span className="event-venue">{event.venue}</span>
        </button>

        <div className="event-face event-back" aria-hidden={!flipped}>
          <span className="card-corner card-corner-tl" />
          <span className="card-corner card-corner-tr" />
          <span className="card-corner card-corner-bl" />
          <span className="card-corner card-corner-br" />
          <span className="event-tag">{event.genre}</span>
          <span className={`pixel-poster small poster-${event.id}`} aria-hidden="true">
            <span className="pixel-sun" />
            <span className="pixel-figure" />
            <span className="pixel-deck" />
          </span>
          <strong>{event.title}</strong>
          <span className="event-description">{event.description}</span>
          <span className="event-actions">
            <a href={event.instagram_url} target="_blank" rel="noreferrer">
              View Instagram
            </a>
            <a href={event.registration_url} target="_blank" rel="noreferrer">
              Register Now
            </a>
            <button type="button" onClick={onToggle}>
              Flip Back
            </button>
          </span>
        </div>
      </div>
    </article>
  );
}
