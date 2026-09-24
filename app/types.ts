export type Scenario = {
  company: string;
  product: string;
  note: string;
  important: string;
};

export type Evaluation = {
  expected_route: string;
  difficulty: string;
  reason: string;
};

export type Lead = {
  id: string;
  company: string;
  employee_count: number;
  country: string;
  region: string;
  industry: string;
  source: string;
  product_interest: string;
  current_crm: string;
  estimated_seats: number | null;
  requested_features: string[];
  inbound_message: string;
  evaluation: Evaluation;
};

export type RepProfile = {
  id: string;
  name: string;
  role: string;
  primary_regions: string[];
  secondary_regions: string[];
  languages: string[];
  segments: string[];
  typical_company_size: string;
  specialties: string[];
  industries: string[];
  current_open_opportunities: number;
  soft_capacity: number;
  routing_criteria: string;
};

export type EvalResult = "pass" | "fail";

export type EngineOutcome = {
  routeChoice: string | null;
  evalResult: EvalResult | null;
  durationMs: number;
  error?: string;
};

export type JevOutcome = EngineOutcome & {
  confidence?: number;
  probabilities?: Record<string, number>;
};

export type RoutingResult = {
  leadId: string;
  expectedRoute: string;
  difficulty: string;
  evaluationReason: string;
  jev: JevOutcome;
  static: EngineOutcome;
};
