const TIME_ZONE = 'Europe/Belgrade';

export type HoursStatus = {
  closedToday: boolean;
  openNow: boolean;
  range: string;
  season: 'summer' | 'winter';
  freeMorning: boolean;
};

function belgradeParts(now: Date) {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    weekday: 'short',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  });
  const bag: Record<string, string> = {};
  for (const part of fmt.formatToParts(now)) {
    if (part.type !== 'literal') bag[part.type] = part.value;
  }
  const weekday = bag.weekday; // Mon, Tue, ...
  return {
    weekday,
    month: Number(bag.month),
    day: Number(bag.day),
    minutes: Number(bag.hour) * 60 + Number(bag.minute),
  };
}

function isSummer(month: number, day: number): boolean {
  // 4 May – 31 October
  if (month > 5 && month < 10) return true;
  if (month === 5 && day >= 4) return true;
  if (month === 10) return true;
  return false;
}

/** Gallery hours at Mali Kalemegdan. Closed Mondays. */
export function galleryHours(now = new Date()): HoursStatus {
  const { weekday, month, day, minutes } = belgradeParts(now);
  const summer = isSummer(month, day);
  const openMin = 10 * 60;
  const closeMin = summer ? 21 * 60 : 18 * 60;
  const closedToday = weekday === 'Mon';
  const openNow = !closedToday && minutes >= openMin && minutes < closeMin;
  const range = summer ? '10:00–21:00' : '10:00–18:00';

  return {
    closedToday,
    openNow,
    range,
    season: summer ? 'summer' : 'winter',
    freeMorning: weekday === 'Thu',
  };
}
