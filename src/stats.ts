import type { GHUser, Stats } from "./types";

export function normalizeStats(user: GHUser): Stats {
  const stars = (user.repositories.nodes || []).reduce((sum, r) => sum + (r.stargazerCount || 0), 0);
  const yearCommits = user.contributionsCollection.totalCommitContributions;
  const commits = user._allCommits != null ? user._allCommits : yearCommits;

  return {
    name: user.name || user.login,
    login: user.login,
    avatarUrl: user.avatarUrl,
    followers: user.followers.totalCount,
    following: user.following.totalCount,
    repos: user.repositories.totalCount,
    stars,
    commits,
    allCommits: user._allCommits != null,
    prs: user.pullRequests.totalCount,
    issues: user.openIssues.totalCount + user.closedIssues.totalCount,
    contributed: user.repositoriesContributedTo.totalCount,
    contributions: user.contributionsCollection.contributionCalendar.totalContributions,
  };
}
