import { prompt } from "@grok/agent-sdk";
import { defineTool } from "@grok/agent-sdk/tools";
import * as z from "zod/v4";

const PLACEHOLDER =
  /^(tbd|tba|n\/a|na|none|unknown|todo|pending|wip|not identified|not yet|not sure|\?|-|--+|tbc)$/i;

const MEDDPIC = [
  ["metrics", "Metrics"],
  ["economicBuyer", "Economic Buyer"],
  ["decisionCriteria", "Decision Criteria"],
  ["decisionProcess", "Decision Process"],
  ["paperProcess", "Paper Process"],
  ["identifiedPain", "Identified Pain"],
  ["champion", "Champion"],
] as const;

const textField = z.object({
  tracked: z.boolean(),
  value: z.string().max(4000).optional(),
});

const dealInput = z.object({
  name: z.string().min(1).max(200),
  owner: z.string().max(200).optional(),
  stage: z.string().max(120).optional(),
  amount: z.number().nullable().optional(),
  closeDate: z.string().max(40).optional(),
  nextStep: textField,
  metrics: textField,
  economicBuyer: textField,
  decisionCriteria: textField,
  decisionProcess: textField,
  paperProcess: textField,
  identifiedPain: textField,
  champion: textField,
  competitors: textField,
  mutualClosePlan: textField,
});

type FieldInput = z.infer<typeof textField>;
type FieldState = "present" | "weak" | "missing" | "untracked";

type ElementResult = {
  element: string;
  state: FieldState;
};

type DealResult = {
  name: string;
  owner: string | null;
  stage: string | null;
  amount: number | null;
  closeDate: string | null;
  meddpic: ElementResult[];
  nextStep: FieldState;
  competitors: FieldState;
  mutualClosePlan: FieldState;
  strategyGaps: string[];
  riskFlags: string[];
};

type Assessment = {
  reviewed: number;
  withMeddpicGaps: number;
  clean: number;
  missingChampion: number;
  missingEconomicBuyer: number;
  missingMetrics: number;
  missingIdentifiedPain: number;
  undatedOrMissingNextStep: number;
  untrackedOnEveryDeal: string[];
  deals: DealResult[];
};

function classify(field: FieldInput): FieldState {
  if (!field.tracked) return "untracked";
  const value = (field.value ?? "").trim();
  if (!value || PLACEHOLDER.test(value)) return "missing";
  if (value.length < 24) return "weak";
  return "present";
}

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function daysUntil(closeDate: string, today: string): number | null {
  if (!isIsoDate(closeDate) || !isIsoDate(today)) return null;
  const close = Date.parse(`${closeDate}T00:00:00Z`);
  const now = Date.parse(`${today}T00:00:00Z`);
  return Math.round((close - now) / 86_400_000);
}

function hasDate(value: string): boolean {
  return (
    /\b\d{4}-\d{2}-\d{2}\b/.test(value) ||
    /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2}\b/i.test(
      value,
    ) ||
    /\b\d{1,2}\/\d{1,2}(?:\/\d{2,4})?\b/.test(value)
  );
}

function strategyGaps(
  nextStep: FieldState,
  nextStepText: string,
  competitors: FieldState,
  mutualClosePlan: FieldState,
): string[] {
  const gaps: string[] = [];
  if (nextStep === "missing") gaps.push("next step missing");
  else if (nextStep === "weak") gaps.push("next step is too thin");
  else if (nextStep === "present" && !hasDate(nextStepText)) {
    gaps.push("next step has no date");
  }
  if (competitors === "missing") gaps.push("competitors missing");
  else if (competitors === "weak") gaps.push("competitors are too thin");
  if (mutualClosePlan === "missing") gaps.push("mutual close plan missing");
  else if (mutualClosePlan === "weak") gaps.push("mutual close plan is too thin");
  return gaps;
}

function riskFlags(
  closeDate: string | undefined,
  today: string,
  champion: FieldState,
  economicBuyer: FieldState,
): string[] {
  const flags: string[] = [];
  const raw = (closeDate ?? "").trim();
  if (!raw) {
    flags.push("close date missing");
    return flags;
  }
  if (!isIsoDate(raw)) {
    flags.push("close date is not YYYY-MM-DD");
    return flags;
  }
  const days = daysUntil(raw, today);
  const soon = days !== null && days <= 14;
  if (days !== null && days < 0) flags.push("close date is overdue");
  else if (soon) flags.push("close date is within 14 days");
  if (soon && champion !== "present") {
    flags.push("champion is not confirmed before the close date");
  }
  if (soon && economicBuyer !== "present") {
    flags.push("economic buyer is not confirmed before the close date");
  }
  return flags;
}

function countMissing(deals: DealResult[], element: string): number {
  return deals.filter((deal) =>
    deal.meddpic.some((item) => item.element === element && item.state === "missing"),
  ).length;
}

export default defineTool({
  description: prompt`
    Score MEDDPIC and strategy gaps for open deals.
    Call this once per review, after the deals are mapped from Salesforce or from the user message.
    Pass tracked false when the org has no field for that element.
    Pass tracked true and an empty value when the field exists and is blank.
    This tool does not invent buyers, metrics, or next steps.
  `,
  inputSchema: z.object({
    deals: z.array(dealInput).max(40),
  }),
  effect: "read",
  async execute({ deals }): Promise<Assessment> {
    const today = new Date().toISOString().slice(0, 10);
    const scored: DealResult[] = deals.map((deal) => {
      const meddpic = MEDDPIC.map(([key, element]) => ({
        element,
        state: classify(deal[key]),
      }));
      const champion = meddpic.find((item) => item.element === "Champion")!.state;
      const economicBuyer = meddpic.find((item) => item.element === "Economic Buyer")!
        .state;
      const nextStep = classify(deal.nextStep);
      const competitors = classify(deal.competitors);
      const mutualClosePlan = classify(deal.mutualClosePlan);
      return {
        name: deal.name,
        owner: deal.owner ?? null,
        stage: deal.stage ?? null,
        amount: deal.amount ?? null,
        closeDate: deal.closeDate ?? null,
        meddpic,
        nextStep,
        competitors,
        mutualClosePlan,
        strategyGaps: strategyGaps(
          nextStep,
          deal.nextStep.value ?? "",
          competitors,
          mutualClosePlan,
        ),
        riskFlags: riskFlags(deal.closeDate, today, champion, economicBuyer),
      };
    });

    const withMeddpicGaps = scored.filter((deal) =>
      deal.meddpic.some((item) => item.state !== "present"),
    ).length;
    const clean = scored.filter(
      (deal) =>
        deal.meddpic.every((item) => item.state === "present") &&
        deal.strategyGaps.length === 0 &&
        deal.riskFlags.length === 0,
    ).length;
    const trackedLabels = [
      ...MEDDPIC.map(([, label]) => label),
      "Next step",
      "Competitors",
      "Mutual close plan",
    ];
    const untrackedOnEveryDeal =
      scored.length === 0
        ? []
        : trackedLabels.filter((label) =>
            scored.every((deal) => {
              if (label === "Next step") return deal.nextStep === "untracked";
              if (label === "Competitors") return deal.competitors === "untracked";
              if (label === "Mutual close plan") return deal.mutualClosePlan === "untracked";
              return deal.meddpic.some(
                (item) => item.element === label && item.state === "untracked",
              );
            }),
          );

    return {
      reviewed: scored.length,
      withMeddpicGaps,
      clean,
      missingChampion: countMissing(scored, "Champion"),
      missingEconomicBuyer: countMissing(scored, "Economic Buyer"),
      missingMetrics: countMissing(scored, "Metrics"),
      missingIdentifiedPain: countMissing(scored, "Identified Pain"),
      undatedOrMissingNextStep: scored.filter((deal) =>
        deal.strategyGaps.some((gap) => gap.startsWith("next step")),
      ).length,
      untrackedOnEveryDeal,
      deals: scored,
    };
  },
});
