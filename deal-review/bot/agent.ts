import { defineAgent } from "@grok/agent-sdk";

export default defineAgent({
  name: "Deal review",
  description:
    "Sunday night review of the team's open deals for MEDDPIC and strategy gaps.",
  model: {
    id: "grok-4.7",
    params: [
      { id: "reasoning_effort", value: "high" },
      { id: "fast", value: "true" },
    ],
  },
});
