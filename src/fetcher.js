export class CardError extends Error {
  constructor(message, code = "API") {
    super(message);
    this.code = code;
  }
}

const QUERY = `
query userInfo($login: String!) {
  user(login: $login) {
    name
    login
    avatarUrl(size: 100)
    followers { totalCount }
    following { totalCount }
    pullRequests(first: 1) { totalCount }
    openIssues: issues(states: OPEN) { totalCount }
    closedIssues: issues(states: CLOSED) { totalCount }
    repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) { totalCount }
    contributionsCollection {
      totalCommitContributions
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false, orderBy: {field: STARGAZERS, direction: DESC}) {
      totalCount
      nodes {
        stargazerCount
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges { size node { name color } }
        }
      }
    }
  }
}`;

function tokens(env) {
  const e = env || (typeof process !== "undefined" ? process.env : {}) || {};
  const list = [];
  if (e.GH_TOKEN) list.push(e.GH_TOKEN);
  Object.keys(e)
    .filter((k) => /^PAT_\d+$/.test(k))
    .sort((a, b) => Number(a.slice(4)) - Number(b.slice(4)))
    .forEach((k) => e[k] && list.push(e[k]));
  return [...new Set(list)];
}

async function graphql(variables, token) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "gitfolio",
    },
    body: JSON.stringify({ query: QUERY, variables }),
  });
  return res.json();
}

async function fetchAllCommits(login, token) {
  const res = await fetch(
    `https://api.github.com/search/commits?q=author:${encodeURIComponent(login)}`,
    {
      headers: {
        Authorization: `bearer ${token}`,
        Accept: "application/vnd.github.cloak-preview+json",
        "User-Agent": "gitfolio",
      },
    },
  );
  const json = await res.json();
  return typeof json.total_count === "number" ? json.total_count : null;
}

export async function fetchProfile(login, { allCommits = false, env } = {}) {
  const toks = tokens(env);
  if (!toks.length) throw new CardError("No GitHub token configured (set GH_TOKEN)", "NO_TOKEN");

  let rateLimited = false;
  for (const token of toks) {
    const json = await graphql({ login }, token);

    if (json.errors?.length) {
      const err = json.errors[0];
      const msg = err.message || "";
      if (err.type === "NOT_FOUND") throw new CardError(`User "${login}" not found`, "NOT_FOUND");
      if (/rate limit|api rate/i.test(msg)) { rateLimited = true; continue; }
      throw new CardError(msg || "GitHub API error", "API");
    }
    if (json.message && /bad credentials/i.test(json.message)) { rateLimited = true; continue; }
    if (!json.data?.user) throw new CardError(`User "${login}" not found`, "NOT_FOUND");

    const user = json.data.user;
    if (allCommits) {
      try { user._allCommits = await fetchAllCommits(login, token); } catch { /* keep year commits */ }
    }
    return user;
  }
  throw new CardError(rateLimited ? "GitHub API rate limit reached" : "GitHub API unavailable", "RATE");
}
