---
description: Use when reviewing open deals for MEDDPIC gaps, strategy gaps, or the Sunday night pipeline summary.
---

# MEDDPIC deal review

1. If this turn already contains the deal records, map those records. Do not call Salesforce.
2. If it does not, use the Salesforce tools from the account connector.
3. If those tools are absent, stop. The instructions say how to report that.
4. Find a query tool. Describe the Opportunity object when you do not know the field names.
5. Load open opportunities where `IsClosed` is false. Read Name, Owner name, StageName, Amount, CloseDate, NextStep, and custom fields whose labels match Metrics, Economic Buyer, Decision Criteria, Decision Process, Paper Process, Pain, Champion, Competitor, and Mutual Close Plan or Close Plan.
6. Keep at most 40 deals. Prefer the earliest close dates. Record how many you left out.
7. For each MEDDPIC element, competitor, mutual close plan, and next step:
   - The org has no field: `tracked` false.
   - The field exists and is blank: `tracked` true and `value` `""`.
   - The field has text: `tracked` true and that text as `value`.
8. A blank field is a seller gap. A missing column is an org gap. Do not mix them.
9. Pass close dates as `YYYY-MM-DD`.
10. Call `assess_meddpic` once with every deal you will report.
11. Write the report from that result. Follow the report shape in the instructions.
