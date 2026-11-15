---
cron: "0 3 * * 1"
---

Run the Sunday night deal review.

This cron is 03:00 UTC on Monday. That is 20:00 Pacific on Sunday during daylight time, and 19:00 Pacific on Sunday during standard time. Change this cron to move the hour.

Follow the meddpic-review skill. Query the team's open Salesforce opportunities. Call assess_meddpic. Write the report in the required shape.

Do not invent deals. If Salesforce is not connected, say the review did not run.
