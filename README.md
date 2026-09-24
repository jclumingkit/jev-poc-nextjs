# PoC Head to Head: Static versus Jev CRM Lead Routing

## Dataset

Leads: `/test-data/mock_realistic_leads.json`
Rep Profiles: `/test-data/mock_realistic_rep_profiles.json`

## Scenario:

Company: `RelayCRM`
Product: `B2B sales and customer engagement platform`

Each lead has a pre-defined `evaluation` result with expected routing to a rep profile, difficulty, and reasoning behind the routing. Some leads are designed to have an edge case to challenge the models. The `evaluation` data of each lead is hidden/not sent to the models.

To avoid order bias in System One Model routing, reps are shuffled on every function call.

## Models

Jev via Openrouter: `~typesafe/jev-latest`

## Getting Started

First, clone this repo.

Second, install dependencies using `npm i` and create a `.env.local` file and add env variable `OPENROUTER_API_KEY`. You can get one here [`openrouter-ai`](https://openrouter.ai/)

Second, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
