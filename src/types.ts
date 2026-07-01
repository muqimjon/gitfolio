export interface Colors {
  primary: string;
  secondary: string;
  text: string;
  muted: string;
  border: string;
  bgStops: string[];
  bgAngle: number;
}

export interface Stats {
  name: string;
  login: string;
  avatarUrl: string | null;
  followers: number;
  following: number;
  repos: number;
  stars: number;
  commits: number;
  allCommits: boolean;
  prs: number;
  issues: number;
  contributed: number;
  contributions: number;
}

export interface Language {
  name: string;
  color: string;
  size: number;
  pct: number;
}

export interface Streak {
  total: number;
  current: number;
  curStart: string | null;
  curEnd: string | null;
  longest: number;
  longStart: string | null;
  longEnd: string | null;
}

export interface Icon {
  path?: string;
  hex: string;
  label: string;
  vb?: number;
  fr?: string;
}

export interface Social {
  platform: string;
  handle: string;
}

export interface CalendarDay {
  date: string;
  contributionCount: number;
}

export interface CalendarWeek {
  contributionDays: CalendarDay[];
}

export interface GHUser {
  name: string | null;
  login: string;
  avatarUrl: string;
  followers: { totalCount: number };
  following: { totalCount: number };
  pullRequests: { totalCount: number };
  openIssues: { totalCount: number };
  closedIssues: { totalCount: number };
  repositoriesContributedTo: { totalCount: number };
  contributionsCollection: {
    totalCommitContributions: number;
    contributionCalendar: {
      totalContributions: number;
      weeks: CalendarWeek[];
    };
  };
  repositories: {
    totalCount: number;
    nodes: Array<{
      stargazerCount: number;
      languages?: { edges: Array<{ size: number; node: { name: string; color: string | null } }> };
    }>;
  };
  _allCommits?: number | null;
}

export type Align = "left" | "center" | "right";
export type SocialShow = "handle" | "name" | "icon";

export interface CardData {
  stats: Stats;
  languages: Language[];
  streak: Streak;
  calendarWeeks: CalendarWeek[];
  icons: Icon[];
  avatarDataUri: string | null;
  socials: Social[];
}

export interface CardOptions {
  colors: Colors;
  sections: string[];
  animation: boolean;
  hideBorder: boolean;
  mono: boolean;
  socialShow: SocialShow;
  socialMono: boolean;
  stackAlign: Align;
  socialAlign: Align;
}

export interface CardContext {
  c: Colors;
  W: number;
  WIDTH: number;
  PAD: number;
  anim: boolean;
  mono: boolean;
  socialShow: SocialShow;
  socialMono: boolean;
  stackAlign: Align;
  socialAlign: Align;
  data: CardData;
}

export interface Section {
  h: number;
  draw: () => string;
}

export interface Env {
  GH_TOKEN?: string;
  WHITELIST?: string;
  CACHE_SECONDS?: string;
  [k: string]: string | undefined;
}

export type Query = Record<string, string | undefined>;

export interface CardResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
}
