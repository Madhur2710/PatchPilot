export function shortSha(sha: string): string {
  return sha.slice(0, 7);
}

export function formatDate(iso: string | Date | null | undefined): string {
  if (!iso) return "—";
  const d = typeof iso === "string" ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatRelative(iso: string | Date | null | undefined): string {
  if (!iso) return "—";
  const d = typeof iso === "string" ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return "—";
  const diff = (Date.now() - d.getTime()) / 1000;
  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.34524, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];
  let value = diff;
  let unit: Intl.RelativeTimeFormatUnit = "second";
  for (const [step, u] of units) {
    if (Math.abs(value) < step) {
      unit = u;
      break;
    }
    value /= step;
    unit = u;
  }
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  return rtf.format(-Math.round(value), unit);
}
