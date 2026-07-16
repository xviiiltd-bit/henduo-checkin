export type HenduoRegistration = {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  venue: string;
  name: string;
  email: string;
  ticketType: string;
  totalCheckins: number;
};

export type CheckInSuccessPayload = {
  eventId: string;
  eventName: string;
  eventDate: string;
  venue: string;
  attendeeName: string;
  ticketType: string;
  totalCheckins: number;
  checkinTime: string;
};

export type HenduoReward = {
  rewardName: string;
  rewardNameEn: string;
  instruction: string;
};

export const HENDUO_DEFAULT_EVENT_ID = "henduo-music-demo";

export const henduoRegistrations: HenduoRegistration[] = [
  {
    id: "henduo-001",
    eventId: HENDUO_DEFAULT_EVENT_ID,
    eventName: "HENDUO MUSIC Check-in Night",
    eventDate: "2026.07.18",
    venue: "Taipei",
    name: "Mica",
    email: "mica@example.com",
    ticketType: "Guest",
    totalCheckins: 3,
  },
  {
    id: "henduo-002",
    eventId: HENDUO_DEFAULT_EVENT_ID,
    eventName: "HENDUO MUSIC Check-in Night",
    eventDate: "2026.07.18",
    venue: "Taipei",
    name: "陳威儒",
    email: "weiru@example.com",
    ticketType: "General",
    totalCheckins: 1,
  },
  {
    id: "henduo-003",
    eventId: HENDUO_DEFAULT_EVENT_ID,
    eventName: "HENDUO MUSIC Check-in Night",
    eventDate: "2026.07.18",
    venue: "Taipei",
    name: "林冠廷",
    email: "kuanting@example.com",
    ticketType: "General",
    totalCheckins: 2,
  },
  {
    id: "henduo-004",
    eventId: HENDUO_DEFAULT_EVENT_ID,
    eventName: "HENDUO MUSIC Check-in Night",
    eventDate: "2026.07.18",
    venue: "Taipei",
    name: "Lulu",
    email: "lulu.one@example.com",
    ticketType: "General",
    totalCheckins: 1,
  },
  {
    id: "henduo-005",
    eventId: HENDUO_DEFAULT_EVENT_ID,
    eventName: "HENDUO MUSIC Check-in Night",
    eventDate: "2026.07.18",
    venue: "Taipei",
    name: "Lulu",
    email: "lulu.two@example.com",
    ticketType: "VIP",
    totalCheckins: 4,
  },
];

export const henduoSocialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/henduo.music_tw/",
  },
  {
    label: "Threads",
    href: "https://www.instagram.com/henduo.music_tw/",
  },
  {
    label: "Website",
    href: "https://www.instagram.com/henduo.music_tw/",
  },
  {
    label: "Creator Compass",
    href: "https://www.instagram.com/henduo.music_tw/",
  },
];

export const henduoDemoReward: HenduoReward = {
  rewardName: "免費酒水兌換券",
  rewardNameEn: "Free Drink Voucher",
  instruction: "請至吧台出示此畫面，即可兌換酒水一杯。",
};

export function findHenduoRegistrations(eventId: string, lookup: string) {
  const normalizedLookup = lookup.trim().toLowerCase();
  const eventRegistrations = henduoRegistrations.filter(
    (registration) => registration.eventId === eventId,
  );

  if (!normalizedLookup) {
    return [];
  }

  if (normalizedLookup.includes("@")) {
    return eventRegistrations.filter(
      (registration) => registration.email.toLowerCase() === normalizedLookup,
    );
  }

  return eventRegistrations.filter(
    (registration) => registration.name.trim().toLowerCase() === normalizedLookup,
  );
}

export function getEventFallback(eventId: string) {
  return (
    henduoRegistrations.find((registration) => registration.eventId === eventId) ?? {
      id: "fallback",
      eventId,
      eventName: "HENDUO MUSIC",
      eventDate: "Event day",
      venue: "Taipei",
      name: "Guest",
      email: "",
      ticketType: "Guest",
      totalCheckins: 1,
    }
  );
}

export function maskEmail(email: string) {
  if (!email.includes("@")) {
    return "No email";
  }

  const [name, domain] = email.split("@");
  const visible = name.slice(0, 2);
  return `${visible}***@${domain}`;
}
