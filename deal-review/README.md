# Deal review

This agent reviews the team's open Salesforce deals every Sunday night. It reports MEDDPIC gaps, strategy gaps, and next steps for the week.

The schedule is `0 3 * * 1` (03:00 UTC Monday). That is 20:00 Pacific on Sunday during daylight time, and 19:00 Pacific on Sunday during standard time.

## What it uses

- Salesforce, through the Cursor account connector named `Salesforce`
- `assess_meddpic`, which marks each element present, weak, missing, or untracked
- The `meddpic-review` skill, which maps Opportunity fields before the score

A blank field is a seller gap. A column the org does not have is an org gap.

## Test it locally

```bash
cd deal-review
npx --yes "@grok/agent-sdk@0.6.0" dev
```

Open the playground URL the command prints.

```bash
npx --yes "@grok/agent-sdk@0.6.0" run --dir ./deal-review --message "Review this one open deal. The records are already in this message. Do not call Salesforce.

Deal: Northwind Analytics
Owner: Priya Shah
Stage: Evaluation
Amount: 120000
Close date: 2026-12-15
Next step: follow up
Metrics: not tracked in Salesforce
Economic buyer: blank, and the field exists
Decision criteria: Security review must finish before procurement, owned by their CISO
Decision process: Champion runs a technical eval, then the economic buyer signs
Paper process: Legal redlines after a verbal yes, and that cycle takes three weeks
Identified pain: slow
Champion: blank, and the field exists
Competitors: not tracked in Salesforce
Mutual close plan: blank, and the field exists

Call assess_meddpic, then write the Sunday deal review."
```

```bash
npx --yes "@grok/agent-sdk@0.6.0" eval --dir ./deal-review
```

Schedules do not fire in dev. Dispatch Sunday night by hand:

```bash
curl -X POST http://127.0.0.1:3000/deal-review/v1/dev/schedules/sunday-night
```

Use `/v1/dev/schedules/sunday-night` when the server is in single mode.

## Deploy it

Deploy from your own terminal so the alias token is not stored in a transcript.

1. `npx --yes "@grok/agent-sdk@0.6.0" validate --dir ./deal-review`
2. `npx --yes "@grok/agent-sdk@0.6.0" deploy --dir ./deal-review --dry-run`
3. `npx --yes "@grok/agent-sdk@0.6.0" deploy --dir ./deal-review`
4. Connect Salesforce on the deployed agent. The connector name must be `Salesforce`.
5. `npx --yes "@grok/agent-sdk@0.6.0" session create --slug deal-review --message "Run the Sunday deal review." --wait`

Manage the agent at https://cursor.com/dashboard/deployed-agents.
