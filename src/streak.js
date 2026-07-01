export function computeStreak(user) {
  const weeks = user.contributionsCollection.contributionCalendar.weeks || [];
  const days = [];
  for (const w of weeks) for (const d of w.contributionDays) days.push(d);
  days.sort((a, b) => (a.date < b.date ? -1 : 1));

  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  let total = 0;
  let current = 0, curStart = null, curEnd = null;
  let longest = 0, longStart = null, longEnd = null;

  for (const d of days) {
    if (d.date > today && !(d.date === tomorrow && d.contributionCount > 0)) continue;
    total += d.contributionCount;

    if (d.contributionCount > 0) {
      current += 1;
      if (current === 1) curStart = d.date;
      curEnd = d.date;
      if (current > longest) {
        longest = current;
        longStart = curStart;
        longEnd = curEnd;
      }
    } else if (d.date !== today) {
      current = 0;
      curStart = null;
      curEnd = null;
    }
  }

  return { total, current, curStart, curEnd, longest, longStart, longEnd };
}
