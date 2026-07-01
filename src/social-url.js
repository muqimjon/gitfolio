const MAP = {
  github: (h) => `https://github.com/${h}`,
  gitlab: (h) => `https://gitlab.com/${h}`,
  bitbucket: (h) => `https://bitbucket.org/${h}`,
  linkedin: (h) => `https://www.linkedin.com/in/${h}`,
  telegram: (h) => `https://t.me/${h}`,
  x: (h) => `https://x.com/${h}`,
  twitter: (h) => `https://twitter.com/${h}`,
  instagram: (h) => `https://www.instagram.com/${h}`,
  facebook: (h) => `https://www.facebook.com/${h}`,
  youtube: (h) => `https://www.youtube.com/@${h.replace(/^@/, "")}`,
  twitch: (h) => `https://www.twitch.tv/${h}`,
  discord: (h) => `https://discord.com/users/${h}`,
  gmail: (h) => `mailto:${h}`,
  medium: (h) => `https://medium.com/@${h.replace(/^@/, "")}`,
  devdotto: (h) => `https://dev.to/${h}`,
  hashnode: (h) => `https://hashnode.com/@${h.replace(/^@/, "")}`,
  stackoverflow: (h) => `https://stackoverflow.com/users/${h}`,
  reddit: (h) => `https://www.reddit.com/user/${h}`,
  dribbble: (h) => `https://dribbble.com/${h}`,
  behance: (h) => `https://www.behance.net/${h}`,
  mastodon: (h) => `https://mastodon.social/@${h.replace(/^@/, "")}`,
  dev: (h) => `https://dev.to/${h}`,
  website: (h) => h,
};

export function socialUrl(platform, handle) {
  if (!handle) return null;
  if (/^(https?:\/\/|mailto:)/i.test(handle)) return handle;
  const fn = MAP[String(platform || "").toLowerCase()];
  return fn ? fn(handle) : null;
}
