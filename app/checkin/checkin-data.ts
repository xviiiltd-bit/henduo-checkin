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

export const HENDUO_DEFAULT_EVENT_ID = "henduo-0718";

export const henduoEvent = {
  eventId: HENDUO_DEFAULT_EVENT_ID,
  eventName: "2026/07/18 舞廳復興 慢搖最高",
  eventDate: "2026.07.18",
  venue: "錦州街浪漫屋",
};

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

export function getEventFallback(eventId: string) {
  if (eventId === HENDUO_DEFAULT_EVENT_ID) {
    return henduoEvent;
  }

  return {
    eventId,
    eventName: "HENDUO MUSIC",
    eventDate: "Event day",
    venue: "Taipei",
  };
}
