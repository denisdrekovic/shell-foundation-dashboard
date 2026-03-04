import {
  PredictiveInputs,
  IncomeTrajectoryPoint,
  PovertyDistribution,
  WaterfallSegment,
  SensitivityRow,
  CountryProjection,
  ACTOR_TYPE_CONFIG,
  COUNTRY_CONFIG,
  Country,
} from "@/types/analytics";

// ── Global constants ──
// Poverty lines from World Bank (2024 International Poverty Lines)
const EXTREME_POVERTY_LINE = 2.15;
const POVERTY_LINE = 3.65;

// ── Baseline & living wage resolution ──
// "all" uses portfolio-wide averages; specific countries use partner survey data.

function getBaseline(inputs: PredictiveInputs): number {
  const countryConf = COUNTRY_CONFIG[inputs.country];
  const countryBaseline = countryConf.baselinesByActor[inputs.actorType];
  if (countryBaseline !== undefined) return countryBaseline;
  return ACTOR_TYPE_CONFIG[inputs.actorType].baselineIncome;
}

function getLivingWage(inputs: PredictiveInputs): number {
  return COUNTRY_CONFIG[inputs.country].livingWage;
}

// ── Income driver weights ──
// Elasticity of income to each driver, calibrated so realistic slider
// movements produce sensible income changes (10-80% range).
// At default slider positions, projected = baseline (0% change).

const FARMER_WEIGHTS = {
  productivity: 0.40,
  cropYield: 0.25,
  cropPrice: 0.20,
  farmSize: 0.15,
};

const TRANSPORTER_WEIGHTS = {
  tripsPerDay: 0.30,
  revenuePerTrip: 0.30,
  fuelCost: 0.20,
  utilization: 0.15,
  fleetSize: 0.35,
};

const MICRO_WEIGHTS = {
  customers: 0.30,
  transactionValue: 0.30,
  operatingCost: 0.20,
  diversification: 0.10,
  marketAccess: 0.25,
};

// ── Core income calculation ──
// Each driver produces a fractional change from baseline.
// Combined effect is additive: projected = baseline × (1 + sum of effects)

function calculateDriverEffects(
  inputs: PredictiveInputs
): { name: string; effect: number }[] {
  switch (inputs.actorType) {
    case "smallholder-farmers":
      return farmerDriverEffects(inputs);
    case "transporters":
      return transporterDriverEffects(inputs);
    case "microentrepreneurs":
      return microentrepreneurDriverEffects(inputs);
    default:
      return [];
  }
}

function farmerDriverEffects(
  inputs: PredictiveInputs
): { name: string; effect: number }[] {
  const f = inputs.farmer;
  return [
    {
      name: "Productivity",
      effect: (f.productivityChange / 100) * FARMER_WEIGHTS.productivity,
    },
    {
      name: "Crop Yield",
      effect: (f.cropYieldChange / 100) * FARMER_WEIGHTS.cropYield,
    },
    {
      name: "Crop Price",
      effect:
        f.cropPricePerUnit > 0
          ? (((f.cropPricePerUnit - getBaseCropPrice(f.cropType)) /
              getBaseCropPrice(f.cropType)) *
              FARMER_WEIGHTS.cropPrice)
          : 0,
    },
    {
      name: "Farm Size",
      effect: (((f.farmSizeHectares - 2.0) / 2.0) * FARMER_WEIGHTS.farmSize),
    },
  ];
}

function transporterDriverEffects(
  inputs: PredictiveInputs
): { name: string; effect: number }[] {
  const t = inputs.transporter;
  return [
    {
      name: "Trip Volume",
      effect: ((t.tripsPerDay - 6) / 6) * TRANSPORTER_WEIGHTS.tripsPerDay,
    },
    {
      name: "Route Revenue",
      effect:
        ((t.revenuePerTrip - 8) / 8) * TRANSPORTER_WEIGHTS.revenuePerTrip,
    },
    {
      name: "Fuel Costs",
      effect: -(t.fuelCostChange / 100) * TRANSPORTER_WEIGHTS.fuelCost,
    },
    {
      name: "Utilization",
      effect:
        ((t.vehicleUtilization - 60) / 100) * TRANSPORTER_WEIGHTS.utilization,
    },
    {
      name: "Fleet Size",
      effect: (t.fleetSize - 1) * TRANSPORTER_WEIGHTS.fleetSize,
    },
  ];
}

function microentrepreneurDriverEffects(
  inputs: PredictiveInputs
): { name: string; effect: number }[] {
  const m = inputs.microentrepreneur;
  return [
    {
      name: "Customers",
      effect: ((m.customersPerDay - 20) / 20) * MICRO_WEIGHTS.customers,
    },
    {
      name: "Transaction Value",
      effect:
        ((m.avgTransactionValue - 2.5) / 2.5) * MICRO_WEIGHTS.transactionValue,
    },
    {
      name: "Operating Costs",
      effect: -(m.operatingCostChange / 100) * MICRO_WEIGHTS.operatingCost,
    },
    {
      name: "Diversification",
      effect: (m.productDiversification - 2) * MICRO_WEIGHTS.diversification,
    },
    {
      name: "Market Access",
      effect: (m.marketAccessChange / 100) * MICRO_WEIGHTS.marketAccess,
    },
  ];
}

function getBaseCropPrice(cropType: string): number {
  const prices: Record<string, number> = {
    rice: 0.35,
    wheat: 0.3,
    maize: 0.25,
    coffee: 3.5,
    vegetables: 0.5,
  };
  return prices[cropType] || 0.35;
}

function calculateDailyIncome(inputs: PredictiveInputs): number {
  const baseline = getBaseline(inputs);
  const effects = calculateDriverEffects(inputs);
  const totalEffect = effects.reduce((sum, d) => sum + d.effect, 0);
  return Math.max(0, baseline * (1 + totalEffect));
}

// ── Projected income trajectory ──

export function projectedIncome(
  inputs: PredictiveInputs
): IncomeTrajectoryPoint[] {
  const baseline = getBaseline(inputs);
  const targetIncome = calculateDailyIncome(inputs);
  const points: IncomeTrajectoryPoint[] = [];

  for (let month = 0; month <= 12; month++) {
    const rampFactor = Math.min(1, month / 6);
    const projected = baseline + (targetIncome - baseline) * rampFactor;
    points.push({
      month,
      baseline: Math.round(baseline * 100) / 100,
      projected: Math.round(Math.max(0, projected) * 100) / 100,
    });
  }

  return points;
}

// ── Poverty distribution ──

export function povertyDistribution(
  inputs: PredictiveInputs
): PovertyDistribution[] {
  const trajectory = projectedIncome(inputs);
  const finalIncome = trajectory[trajectory.length - 1].projected;
  const baselineIncome = trajectory[0].baseline;
  const livingWage = getLivingWage(inputs);

  const distributions = [
    { label: "Baseline", income: baselineIncome },
    { label: "Projected", income: finalIncome },
  ];

  return distributions.map(({ label, income }) => {
    const sd = income * 0.4;
    const pctBelowExtreme = cdfNormal(EXTREME_POVERTY_LINE, income, sd) * 100;
    const pctBelowPoverty = cdfNormal(POVERTY_LINE, income, sd) * 100;
    const pctBelowLiving = cdfNormal(livingWage, income, sd) * 100;

    const belowExtreme = Math.round(
      (pctBelowExtreme / 100) * inputs.numBeneficiaries
    );
    const belowPoverty =
      Math.round((pctBelowPoverty / 100) * inputs.numBeneficiaries) -
      belowExtreme;
    const belowLiving =
      Math.round((pctBelowLiving / 100) * inputs.numBeneficiaries) -
      belowExtreme -
      belowPoverty;
    const aboveLiving =
      inputs.numBeneficiaries - belowExtreme - belowPoverty - belowLiving;

    return {
      label,
      belowExtremePoverty: Math.max(0, belowExtreme),
      belowPovertyLine: Math.max(0, belowPoverty),
      belowLivingWage: Math.max(0, belowLiving),
      aboveLivingWage: Math.max(0, aboveLiving),
    };
  });
}

// ── Living income gap waterfall ──

export function livingIncomeGap(inputs: PredictiveInputs): WaterfallSegment[] {
  const baseline = getBaseline(inputs);
  const livingWage = getLivingWage(inputs);
  const effects = calculateDriverEffects(inputs);
  let running = baseline;

  const segments: WaterfallSegment[] = [
    {
      name: "Baseline",
      start: 0,
      end: baseline,
      value: baseline,
      fill: "#6D6A6A",
    },
  ];

  for (const driver of effects) {
    const dollarEffect = baseline * driver.effect;
    if (Math.abs(dollarEffect) < 0.01) continue;
    segments.push({
      name: driver.name,
      start: running,
      end: running + dollarEffect,
      value: dollarEffect,
      fill: dollarEffect >= 0 ? "#00A17D" : "#DC2626",
    });
    running += dollarEffect;
  }

  segments.push({
    name: "Projected",
    start: 0,
    end: Math.max(0, running),
    value: Math.max(0, running),
    fill: ACTOR_TYPE_CONFIG[inputs.actorType].color,
  });

  if (running < livingWage) {
    segments.push({
      name: "Gap to Wage",
      start: running,
      end: livingWage,
      value: livingWage - running,
      fill: "#EDEBEF",
    });
  }

  return segments;
}

// ── Country projections ──
// Shows how the current slider scenario plays out across all countries
// that have partners for the selected actor type.

export function countryProjections(
  inputs: PredictiveInputs
): CountryProjection[] {
  const effects = calculateDriverEffects(inputs);
  const totalEffect = effects.reduce((sum, d) => sum + d.effect, 0);

  const countries: Country[] = ["India", "Kenya", "Rwanda", "Nigeria"];

  return countries
    .filter((c) => {
      const conf = COUNTRY_CONFIG[c];
      return conf.baselinesByActor[inputs.actorType] !== undefined;
    })
    .map((c) => {
      const conf = COUNTRY_CONFIG[c];
      const baseline = conf.baselinesByActor[inputs.actorType]!;
      const projected = Math.max(0, baseline * (1 + totalEffect));
      return {
        country: conf.label,
        baseline: Math.round(baseline * 100) / 100,
        projected: Math.round(projected * 100) / 100,
        livingWage: conf.livingWage,
        gap: Math.round(Math.max(0, conf.livingWage - projected) * 100) / 100,
        partners: conf.partners,
      };
    });
}

// ── Sensitivity analysis ──

export function sensitivityAnalysis(
  inputs: PredictiveInputs
): SensitivityRow[] {
  const trajectory = projectedIncome(inputs);
  const currentIncome = trajectory[trajectory.length - 1].projected;

  const test = (
    label: string,
    override: Partial<PredictiveInputs>
  ): SensitivityRow => {
    const traj = projectedIncome({ ...inputs, ...override });
    const impact = traj[traj.length - 1].projected - currentIncome;
    return {
      driver: label,
      elasticity:
        currentIncome > 0 ? Math.abs(impact / currentIncome) * 100 : 0,
      currentImpact: impact,
      direction: impact >= 0 ? "positive" : "negative",
    };
  };

  switch (inputs.actorType) {
    case "smallholder-farmers": {
      const f = inputs.farmer;
      return [
        test("Productivity", {
          farmer: { ...f, productivityChange: f.productivityChange + 10 },
        }),
        test("Crop Yield", {
          farmer: { ...f, cropYieldChange: f.cropYieldChange + 10 },
        }),
        test("Crop Price", {
          farmer: { ...f, cropPricePerUnit: f.cropPricePerUnit * 1.1 },
        }),
        test("Farm Size", {
          farmer: { ...f, farmSizeHectares: f.farmSizeHectares * 1.1 },
        }),
      ].sort((a, b) => b.elasticity - a.elasticity);
    }
    case "transporters": {
      const t = inputs.transporter;
      return [
        test("Trips/Day", {
          transporter: {
            ...t,
            tripsPerDay: Math.min(20, t.tripsPerDay + 1),
          },
        }),
        test("Revenue/Trip", {
          transporter: { ...t, revenuePerTrip: t.revenuePerTrip * 1.1 },
        }),
        test("Fuel Costs", {
          transporter: { ...t, fuelCostChange: t.fuelCostChange + 10 },
        }),
        test("Utilization", {
          transporter: {
            ...t,
            vehicleUtilization: Math.min(100, t.vehicleUtilization + 10),
          },
        }),
        test("Fleet Size", {
          transporter: { ...t, fleetSize: Math.min(10, t.fleetSize + 1) },
        }),
      ].sort((a, b) => b.elasticity - a.elasticity);
    }
    case "microentrepreneurs": {
      const m = inputs.microentrepreneur;
      return [
        test("Customers/Day", {
          microentrepreneur: {
            ...m,
            customersPerDay: Math.min(100, m.customersPerDay + 2),
          },
        }),
        test("Transaction Value", {
          microentrepreneur: {
            ...m,
            avgTransactionValue: m.avgTransactionValue * 1.1,
          },
        }),
        test("Operating Costs", {
          microentrepreneur: {
            ...m,
            operatingCostChange: m.operatingCostChange + 10,
          },
        }),
        test("Diversification", {
          microentrepreneur: {
            ...m,
            productDiversification: Math.min(5, m.productDiversification + 1),
          },
        }),
        test("Market Access", {
          microentrepreneur: {
            ...m,
            marketAccessChange: m.marketAccessChange + 10,
          },
        }),
      ].sort((a, b) => b.elasticity - a.elasticity);
    }
    default:
      return [];
  }
}

// ── Helpers ──

function cdfNormal(x: number, mean: number, sd: number): number {
  if (sd <= 0) return x >= mean ? 1 : 0;
  const z = (x - mean) / sd;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804014327;
  const p =
    d *
    Math.exp((-z * z) / 2) *
    (t *
      (0.3193815 +
        t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))));
  return z > 0 ? 1 - p : p;
}
