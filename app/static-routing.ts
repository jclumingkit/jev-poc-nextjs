import type { Lead } from "./types";

type RoutableLead = Omit<Lead, "evaluation">;

// Keep this branch order aligned with route_static in static_algo.py.
export const routeStatic = (lead: RoutableLead): string => {
  const region = lead.region.toLowerCase();
  const country = lead.country.toLowerCase();

  if (region === "dach") {
    return "anna_keller";
  }

  if (
    country === "france" ||
    lead.inbound_message.toLowerCase().includes("french")
  ) {
    return "sophie_martin";
  }

  if (region === "apac") {
    return "priya_nair";
  }

  if (region === "latin america") {
    return "luis_ortega";
  }

  if (region === "north america") {
    if (lead.employee_count >= 500) {
      return "maya_chen";
    }

    if (lead.employee_count >= 75) {
      return "luis_ortega";
    }

    return "jordan_brooks";
  }

  return "manual_review";
};
