import type { RepProfile } from "../../types";

export const asPercent = (value: number) =>
  Math.round(value <= 1 ? value * 100 : value);

export const routeLabel = (route: string | null, reps: RepProfile[]) =>
  route === "manual_review"
    ? "Manual review"
    : (reps.find((rep) => rep.id === route)?.name ?? "Unavailable");
