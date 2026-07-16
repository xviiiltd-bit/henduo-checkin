import { NextRequest, NextResponse } from "next/server";
import { registrations0718 } from "../../../checkin/registrations-0718";
import type { HashedRegistration } from "../../../checkin/registrations-0718";

type LookupResult = Pick<
  HashedRegistration,
  | "id"
  | "eventName"
  | "eventDate"
  | "venue"
  | "maskedName"
  | "maskedEmail"
  | "ticketType"
  | "totalCheckins"
>;

function normalize(value: string) {
  return value.trim().toLowerCase();
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(normalize(value));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function toLookupResult(registration: HashedRegistration): LookupResult {
  return {
    id: registration.id,
    eventName: registration.eventName,
    eventDate: registration.eventDate,
    venue: registration.venue,
    maskedName: registration.maskedName,
    maskedEmail: registration.maskedEmail,
    ticketType: registration.ticketType,
    totalCheckins: registration.totalCheckins,
  };
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await context.params;
  const body = await request.json().catch(() => ({}));
  const lookup = String(body.lookup ?? "");
  const selectedRegistrationId = body.selectedRegistrationId
    ? String(body.selectedRegistrationId)
    : "";

  if (!lookup && !selectedRegistrationId) {
    return NextResponse.json(
      { success: false, status: "empty_lookup", message: "請輸入 Email 或中文姓名。" },
      { status: 400 },
    );
  }

  const eventRegistrations = registrations0718.filter(
    (registration) => registration.eventId === eventId,
  );

  if (selectedRegistrationId) {
    const selected = eventRegistrations.find(
      (registration) => registration.id === selectedRegistrationId,
    );

    if (!selected) {
      return NextResponse.json(
        { success: false, status: "not_found", message: "找不到報名資料。" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, status: "checked_in", registration: toLookupResult(selected) });
  }

  const lookupHash = await sha256(lookup);
  const isEmail = lookup.includes("@");
  const matches = eventRegistrations.filter((registration) =>
    isEmail ? registration.emailHash === lookupHash : registration.nameHash === lookupHash,
  );

  if (matches.length === 0) {
    return NextResponse.json(
      { success: false, status: "not_found", message: "找不到報名資料，請洽現場工作人員協助。" },
      { status: 404 },
    );
  }

  if (!isEmail && matches.length > 1) {
    return NextResponse.json({
      success: false,
      status: "duplicate_name",
      matches: matches.map(toLookupResult),
    });
  }

  return NextResponse.json({
    success: true,
    status: "checked_in",
    registration: toLookupResult(matches[0]),
  });
}
