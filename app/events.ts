export type RaveEvent = {
  id: string;
  title: string;
  date: string;
  venue: string;
  genre: string;
  tag: string;
  description: string;
  instagram_url: string;
  registration_url: string;
};

export const weeklyEvents: RaveEvent[] = [
  {
    id: "critical-dose",
    title: "Critical Dose",
    date: "Fri 23:30",
    venue: "PIPE Live Music",
    genre: "Techno",
    tag: "Underground Pick",
    description: "Heavy kicks, dark room energy, and a late-night crowd.",
    instagram_url: "https://www.instagram.com/",
    registration_url: "https://kktix.com/",
  },
  {
    id: "neon-basement",
    title: "Neon Basement",
    date: "Sat 22:00",
    venue: "Final Taipei",
    genre: "House / Electro",
    tag: "Staff Recommended",
    description: "A compact dance floor with glossy synths and warm grooves.",
    instagram_url: "https://www.instagram.com/",
    registration_url: "https://www.accupass.com/",
  },
  {
    id: "afterglow-unit",
    title: "Afterglow Unit",
    date: "Sat 23:59",
    venue: "Pawnshop",
    genre: "Hard Techno",
    tag: "High Energy",
    description: "Fast, direct, and built for ravers who do not need a warmup.",
    instagram_url: "https://www.instagram.com/",
    registration_url: "https://kktix.com/",
  },
  {
    id: "signal-room",
    title: "Signal Room",
    date: "Sun 20:30",
    venue: "Revolver",
    genre: "Bass / DnB",
    tag: "Hidden Gem",
    description: "Low-end pressure, sharp breaks, and a friendlier Sunday exit.",
    instagram_url: "https://www.instagram.com/",
    registration_url: "https://www.accupass.com/",
  },
];
