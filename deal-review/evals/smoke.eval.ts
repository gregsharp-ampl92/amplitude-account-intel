import { defineEval, includes } from "@grok/agent-sdk/evals";

export default defineEval({
  tags: ["smoke"],
  description: "A pasted deal is scored with assess_meddpic before the summary.",
  async test(t) {
    await t.send(`Review this one open deal. The records are already in this message. Do not call Salesforce.

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

Call assess_meddpic, then write the Sunday deal review.`);
    t.succeeded();
    t.calledTool("assess_meddpic");
    t.check(t.reply, includes(/Champion/));
    t.check(t.reply, includes(/Economic Buyer/));
    t.check(t.reply, includes(/next step/i));
  },
});
