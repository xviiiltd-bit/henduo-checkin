import { createClientFromRequest } from "npm:@base44/sdk";

type ExternalEvent = Record<string, unknown>;

type NormalizedEvent = {
  title: string;
  date: string;
  venue: string;
  genre: string;
  tag: string;
  description: string;
  instagram_url: string;
  registration_url: string;
  is_published: boolean;
  sort_order: number;
  source_id: string;
  source_date: string;
  source_url: string;
  fetched_at: string;
};

type RequestBody = {
  date?: string;
  save?: boolean;
  publish?: boolean;
  limit?: number;
  apiUrl?: string;
};

const DEFAULT_INSTAGRAM_URL = "https://www.instagram.com/";
const DEFAULT_REGISTRATION_URL = "https://kktix.com/";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Use POST with JSON body." }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const body = (await req.json()) as RequestBody;
    const date = normalizeDate(body.date);

    if (!date) {
      return Response.json(
        { error: "date is required and must use YYYY-MM-DD format." },
        { status: 400 },
      );
    }

    const apiUrl = body.apiUrl ?? Deno.env.get("EVENTS_API_URL");
    if (!apiUrl) {
      return Response.json(
        {
          error: "EVENTS_API_URL is not configured.",
          setup: "Add EVENTS_API_URL in Base44 app secrets, or pass apiUrl in the request while testing.",
          exampleBody: { date, save: false },
        },
        { status: 424 },
      );
    }

    if (body.save || body.apiUrl) {
      const user = await base44.auth.me();
      if (!user || user.role !== "admin") {
        return Response.json(
          { error: "Admin login is required to save events or override apiUrl." },
          { status: 403 },
        );
      }
    }

    const endpoint = buildEndpoint(apiUrl, date);
    const externalEvents = await fetchExternalEvents(endpoint);
    const normalized = externalEvents
      .slice(0, clampLimit(body.limit))
      .map((event, index) => normalizeEvent(event, date, index))
      .filter((event) => event.title && event.registration_url);

    let saved = 0;
    let skipped = 0;

    if (body.save) {
      for (const event of normalized) {
        const existing = await base44.asServiceRole.entities.Event.filter(
          { source_id: event.source_id },
          null,
          1,
          0,
        );

        if (existing.length > 0) {
          skipped += 1;
          continue;
        }

        await base44.asServiceRole.entities.Event.create({
          ...event,
          is_published: Boolean(body.publish),
        });
        saved += 1;
      }
    }

    return Response.json({
      success: true,
      date,
      source: endpoint,
      count: normalized.length,
      saved,
      skipped,
      events: normalized,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
});

function normalizeDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

function clampLimit(limit: unknown): number {
  if (typeof limit !== "number" || !Number.isFinite(limit)) return 20;
  return Math.min(Math.max(Math.floor(limit), 1), 50);
}

function buildEndpoint(apiUrl: string, date: string): string {
  const endpoint = new URL(apiUrl);
  endpoint.searchParams.set("date", date);
  return endpoint.toString();
}

async function fetchExternalEvents(endpoint: string): Promise<ExternalEvent[]> {
  const headers = new Headers({ Accept: "application/json" });
  const apiKey = Deno.env.get("EVENTS_API_KEY");

  if (apiKey) {
    headers.set("Authorization", `Bearer ${apiKey}`);
  }

  const response = await fetch(endpoint, { headers });
  if (!response.ok) {
    throw new Error(`External event API returned ${response.status}`);
  }

  const payload = await response.json();
  const events = Array.isArray(payload)
    ? payload
    : Array.isArray(payload.events)
      ? payload.events
      : Array.isArray(payload.data)
        ? payload.data
        : [];

  return events.filter((event): event is ExternalEvent => {
    return event !== null && typeof event === "object" && !Array.isArray(event);
  });
}

function normalizeEvent(event: ExternalEvent, date: string, index: number): NormalizedEvent {
  const sourceUrl = pickString(event, ["url", "event_url", "link", "registration_url"]);
  const eventDate = pickString(event, ["date", "start_date", "startDate", "starts_at", "start_time"]) ?? date;

  return {
    title: pickString(event, ["title", "name", "event_name"]) ?? "Untitled Event",
    date: formatEventDate(eventDate),
    venue: pickVenue(event) ?? "TBA",
    genre: pickString(event, ["genre", "category", "music_type"]) ?? "Electronic",
    tag: pickString(event, ["tag", "badge", "label"]) ?? "API Pick",
    description: pickString(event, ["description", "summary", "subtitle"]) ?? "Fetched from external event API.",
    instagram_url: pickString(event, ["instagram_url", "instagram", "ig_url"]) ?? DEFAULT_INSTAGRAM_URL,
    registration_url: pickString(event, ["registration_url", "ticket_url", "tickets_url", "url", "link"]) ??
      DEFAULT_REGISTRATION_URL,
    is_published: false,
    sort_order: index + 1,
    source_id: String(pickString(event, ["id", "event_id", "uuid", "slug"]) ?? `${date}-${index + 1}`),
    source_date: date,
    source_url: sourceUrl ?? DEFAULT_REGISTRATION_URL,
    fetched_at: new Date().toISOString(),
  };
}

function pickVenue(event: ExternalEvent): string | null {
  const direct = pickString(event, ["venue", "location", "place"]);
  if (direct) return direct;

  const venue = event.venue ?? event.location ?? event.place;
  if (venue && typeof venue === "object" && !Array.isArray(venue)) {
    return pickString(venue as ExternalEvent, ["name", "title", "address"]);
  }

  return null;
}

function pickString(event: ExternalEvent, keys: string[]): string | null {
  for (const key of keys) {
    const value = event[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }

  return null;
}

function formatEventDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleString("en-US", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Taipei",
  });
}
