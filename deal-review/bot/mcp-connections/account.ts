import { defineConnection } from "@grok/agent-sdk/connections";

// Connector name must match the Cursor dashboard. "Salesforce" is the
// account connector this agent is allowed to call.
export default defineConnection({
  description:
    "Salesforce opportunities for the Sunday MEDDPIC review. Uses the signed-in Cursor account connector.",
  cursorAccount: true,
  servers: ["Salesforce"],
  advertiseTools: true,
  optional: true,
});
