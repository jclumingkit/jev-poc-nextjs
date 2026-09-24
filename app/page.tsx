import leads from "../test-data/mock_realistic_leads.json";
import reps from "../test-data/mock_realistic_rep_profiles.json";
import { RoutingSimulation } from "./components/routing-simulation";
import type { Lead, RepProfile, Scenario } from "./types";

const Home = () => {
  return (
    <RoutingSimulation
      leads={leads.leads as Lead[]}
      reps={reps.reps as RepProfile[]}
      scenario={leads.scenario as Scenario}
    />
  );
};

export default Home;
