/**
 * Formats pace in seconds/km to "M:SS min/km" display string.
 * e.g. 330 => "5:30 min/km"
 */
export function formatPace(paceSecondsPerKm: number): string {
  const totalSeconds = Math.round(paceSecondsPerKm);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const paddedSeconds = seconds.toString().padStart(2, '0');
  return `${minutes}:${paddedSeconds} min/km`;
}

/**
 * Formats an ISO date string (YYYY-MM-DD) to "DD/MM/YYYY".
 */
export function formatDate(isoDate: string): string {
  const parts = isoDate.split('T')[0].split('-');
  if (parts.length !== 3) return isoDate;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

/**
 * Calculates days remaining until deadline.
 * Returns 0 if deadline has passed.
 */
export function daysRemaining(deadline: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(deadline + 'T00:00:00');
  const diff = deadlineDate.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/**
 * Converts "hh:mm:ss" or "mm:ss" string to total seconds.
 * Returns null if the format is invalid.
 */
export function parseDurationToSeconds(value: string): number | null {
  const trimmed = value.trim();
  const parts = trimmed.split(':');

  if (parts.length === 2) {
    const [mm, ss] = parts.map(Number);
    if (
      isNaN(mm) || isNaN(ss) ||
      mm < 0 || ss < 0 || ss >= 60
    ) return null;
    return mm * 60 + ss;
  }

  if (parts.length === 3) {
    const [hh, mm, ss] = parts.map(Number);
    if (
      isNaN(hh) || isNaN(mm) || isNaN(ss) ||
      hh < 0 || mm < 0 || mm >= 60 || ss < 0 || ss >= 60
    ) return null;
    return hh * 3600 + mm * 60 + ss;
  }

  return null;
}

/**
 * Calculates real-time pace from distance and duration string.
 * Returns formatted pace string or null if inputs are invalid.
 */
export function calculateLivePace(
  distanceText: string,
  durationText: string
): string | null {
  const distance = parseFloat(distanceText);
  if (isNaN(distance) || distance <= 0) return null;

  const durationSeconds = parseDurationToSeconds(durationText);
  if (durationSeconds === null || durationSeconds <= 0) return null;

  const paceSecondsPerKm = durationSeconds / distance;
  return formatPace(paceSecondsPerKm);
}
