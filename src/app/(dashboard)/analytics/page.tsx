"use client";

import { useState, useMemo } from "react";
import {
  PredictiveInputs,
  DEFAULT_INPUTS,
  ACTOR_TYPE_CONFIG,
  COUNTRY_CONFIG,
} from "@/types/analytics";
import {
  projectedIncome,
  povertyDistribution,
  livingIncomeGap,
  sensitivityAnalysis,
  countryProjections,
} from "@/lib/predictiveEngine";
import PredictiveControls from "@/components/analytics/PredictiveControls";
import ProjectedIncomeChart from "@/components/analytics/ProjectedIncomeChart";
import PovertyDistributionChart from "@/components/analytics/PovertyDistributionChart";
import LivingIncomeGapChart from "@/components/analytics/LivingIncomeGapChart";
import SensitivityTable from "@/components/analytics/SensitivityTable";
import CountryComparisonChart from "@/components/analytics/CountryComparisonChart";
import ChartContainer from "@/components/ui/ChartContainer";
import {
  prepareProjectedIncomeCSV,
  prepareCountryCompCSV,
  preparePovertyCSV,
  prepareWaterfallCSV,
  prepareSensitivityCSV,
} from "@/lib/csvHelpers";
import { formatCurrency } from "@/lib/formatters";
import { ChevronDown, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function AnalyticsPage() {
  const [inputs, setInputs] = useState<PredictiveInputs>(DEFAULT_INPUTS);
  const [methodologyOpen, setMethodologyOpen] = useState(false);

  const trajectory = useMemo(() => projectedIncome(inputs), [inputs]);
  const poverty = useMemo(() => povertyDistribution(inputs), [inputs]);
  const waterfall = useMemo(() => livingIncomeGap(inputs), [inputs]);
  const sensitivity = useMemo(() => sensitivityAnalysis(inputs), [inputs]);
  const countries = useMemo(() => countryProjections(inputs), [inputs]);

  const currentIncome = trajectory[trajectory.length - 1].projected;
  const baselineIncome = trajectory[0].baseline;
  const incomeChange = currentIncome - baselineIncome;
  const pctChange =
    baselineIncome > 0 ? (incomeChange / baselineIncome) * 100 : 0;

  const projectedDist = poverty.find((p) => p.label === "Projected");
  const livingWage = COUNTRY_CONFIG[inputs.country].livingWage;

  const actorConf = ACTOR_TYPE_CONFIG[inputs.actorType];
  const countryLabel =
    inputs.country === "all"
      ? "Portfolio Average"
      : COUNTRY_CONFIG[inputs.country].label;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-heading)] text-title">
          Predictive Analytics
        </h1>
        <p className="text-sm text-gray mt-1">
          Explore how different income drivers affect living income outcomes
          across actor types and countries. Select a segment, choose a market,
          and adjust sliders to model scenarios.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Controls panel (sticky) */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="lg:sticky lg:top-20">
            <PredictiveControls inputs={inputs} onChange={setInputs} />
          </div>
        </div>

        {/* Right: Output charts */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          {/* Actor + Country context badge */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-button)] text-xs font-medium"
            style={{
              color: actorConf.color,
              backgroundColor: actorConf.color + "0D",
              border: `1px solid ${actorConf.color}25`,
            }}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: actorConf.color }}
            />
            Modeling: {actorConf.label} &middot; {countryLabel} &middot;
            Baseline: {formatCurrency(baselineIncome)}/day &middot; Living
            wage: {formatCurrency(livingWage)}/day
          </div>

          {/* KPI summary strip */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            role="list"
            aria-label="Key performance indicators"
          >
            <KPICard
              label="Projected Income"
              value={formatCurrency(currentIncome) + "/day"}
              color={currentIncome >= livingWage ? "#00A17D" : "#FFC000"}
              trend={{ value: pctChange, label: "vs baseline" }}
            />
            <KPICard
              label="Income Change"
              value={`${incomeChange >= 0 ? "+" : ""}${formatCurrency(incomeChange)}/day`}
              sub={`${pctChange >= 0 ? "+" : ""}${pctChange.toFixed(1)}%`}
              color={incomeChange >= 0 ? "#00A17D" : "#DC2626"}
            />
            <KPICard
              label="Above Living Wage"
              value={
                projectedDist
                  ? projectedDist.aboveLivingWage.toLocaleString()
                  : "—"
              }
              sub={`of ${inputs.numBeneficiaries.toLocaleString()}`}
              color="#00A17D"
            />
            <KPICard
              label="Below Poverty"
              value={
                projectedDist
                  ? (
                      projectedDist.belowExtremePoverty +
                      projectedDist.belowPovertyLine
                    ).toLocaleString()
                  : "—"
              }
              sub="extreme + moderate"
              color="#DC2626"
            />
          </div>

          {/* Projected income trajectory */}
          <ChartContainer
            title="Projected Income Trajectory"
            subtitle="12-month projection based on current parameter settings"
            csvData={prepareProjectedIncomeCSV(trajectory)}
            csvFilename="projected-income"
            tableView={
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-surface-alt text-[10px] text-gray uppercase tracking-wide">
                      <th className="text-left py-2 pr-3 font-medium">Month</th>
                      <th className="text-right py-2 px-3 font-medium">Baseline ($/day)</th>
                      <th className="text-right py-2 pl-3 font-medium">Projected ($/day)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trajectory.map((pt) => (
                      <tr key={pt.month} className="border-b border-surface-alt/50">
                        <td className="py-1.5 pr-3 font-medium text-title">Month {pt.month}</td>
                        <td className="py-1.5 px-3 text-right">{formatCurrency(pt.baseline)}</td>
                        <td className="py-1.5 pl-3 text-right">{formatCurrency(pt.projected)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
          >
            <ProjectedIncomeChart data={trajectory} />
          </ChartContainer>

          {/* Country comparison */}
          <ChartContainer
            title="Country Comparison"
            subtitle="How the current scenario plays out across different operating markets"
            csvData={prepareCountryCompCSV(countries)}
            csvFilename="country-comparison"
            tableView={
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-surface-alt text-[10px] text-gray uppercase tracking-wide">
                      <th className="text-left py-2 pr-3 font-medium">Country</th>
                      <th className="text-right py-2 px-3 font-medium">Baseline ($/day)</th>
                      <th className="text-right py-2 px-3 font-medium">Projected ($/day)</th>
                      <th className="text-right py-2 px-3 font-medium">Living Wage</th>
                      <th className="text-right py-2 px-3 font-medium">Gap</th>
                      <th className="text-left py-2 pl-3 font-medium">Partners</th>
                    </tr>
                  </thead>
                  <tbody>
                    {countries.map((c) => (
                      <tr key={c.country} className="border-b border-surface-alt/50">
                        <td className="py-1.5 pr-3 font-medium text-title">{c.country}</td>
                        <td className="py-1.5 px-3 text-right">{formatCurrency(c.baseline)}</td>
                        <td className="py-1.5 px-3 text-right">{formatCurrency(c.projected)}</td>
                        <td className="py-1.5 px-3 text-right">{formatCurrency(c.livingWage)}</td>
                        <td className="py-1.5 px-3 text-right">{c.gap > 0 ? formatCurrency(c.gap) : "—"}</td>
                        <td className="py-1.5 pl-3 text-gray">{c.partners.join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
          >
            <CountryComparisonChart
              data={countries}
              actorColor={actorConf.color}
            />
          </ChartContainer>

          {/* Poverty distribution */}
          <ChartContainer
            title="Poverty Distribution"
            subtitle={`Estimated distribution of ${inputs.numBeneficiaries.toLocaleString()} beneficiaries across income thresholds`}
            csvData={preparePovertyCSV(poverty)}
            csvFilename="poverty-distribution"
            tableView={
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-surface-alt text-[10px] text-gray uppercase tracking-wide">
                      <th className="text-left py-2 pr-3 font-medium">Scenario</th>
                      <th className="text-right py-2 px-3 font-medium">Extreme Poverty</th>
                      <th className="text-right py-2 px-3 font-medium">Below Poverty</th>
                      <th className="text-right py-2 px-3 font-medium">Below Living Wage</th>
                      <th className="text-right py-2 pl-3 font-medium">Above Living Wage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {poverty.map((p) => (
                      <tr key={p.label} className="border-b border-surface-alt/50">
                        <td className="py-1.5 pr-3 font-medium text-title">{p.label}</td>
                        <td className="py-1.5 px-3 text-right">{p.belowExtremePoverty.toLocaleString()}</td>
                        <td className="py-1.5 px-3 text-right">{p.belowPovertyLine.toLocaleString()}</td>
                        <td className="py-1.5 px-3 text-right">{p.belowLivingWage.toLocaleString()}</td>
                        <td className="py-1.5 pl-3 text-right">{p.aboveLivingWage.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
          >
            <PovertyDistributionChart
              data={poverty}
              numBeneficiaries={inputs.numBeneficiaries}
            />
          </ChartContainer>

          {/* Waterfall */}
          <ChartContainer
            title="Living Income Gap Waterfall"
            subtitle="Contribution of each driver to closing the living income gap"
            csvData={prepareWaterfallCSV(waterfall)}
            csvFilename="living-income-gap"
            tableView={
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-surface-alt text-[10px] text-gray uppercase tracking-wide">
                      <th className="text-left py-2 pr-3 font-medium">Driver</th>
                      <th className="text-right py-2 px-3 font-medium">Contribution ($/day)</th>
                      <th className="text-right py-2 px-3 font-medium">From</th>
                      <th className="text-right py-2 pl-3 font-medium">To</th>
                    </tr>
                  </thead>
                  <tbody>
                    {waterfall.map((seg) => (
                      <tr key={seg.name} className="border-b border-surface-alt/50">
                        <td className="py-1.5 pr-3 font-medium text-title flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: seg.fill }} />
                          {seg.name}
                        </td>
                        <td className="py-1.5 px-3 text-right">{seg.value >= 0 ? "+" : ""}{formatCurrency(seg.value)}</td>
                        <td className="py-1.5 px-3 text-right">{formatCurrency(seg.start)}</td>
                        <td className="py-1.5 pl-3 text-right">{formatCurrency(seg.end)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
          >
            <LivingIncomeGapChart data={waterfall} livingWage={livingWage} />
          </ChartContainer>

          {/* Sensitivity analysis */}
          <ChartContainer
            title="Sensitivity Analysis"
            subtitle="Impact of +10% change in each driver on projected income (ranked by sensitivity)"
            csvData={prepareSensitivityCSV(sensitivity)}
            csvFilename="sensitivity-analysis"
            tableView={
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-surface-alt text-[10px] text-gray uppercase tracking-wide">
                      <th className="text-left py-2 pr-3 font-medium">Driver</th>
                      <th className="text-right py-2 px-3 font-medium">Sensitivity (%)</th>
                      <th className="text-right py-2 px-3 font-medium">Impact ($/day)</th>
                      <th className="text-right py-2 pl-3 font-medium">Direction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sensitivity.map((row) => (
                      <tr key={row.driver} className="border-b border-surface-alt/50">
                        <td className="py-1.5 pr-3 font-medium text-title">{row.driver}</td>
                        <td className="py-1.5 px-3 text-right">{row.elasticity.toFixed(1)}%</td>
                        <td className="py-1.5 px-3 text-right">{row.direction === "positive" ? "+" : ""}{formatCurrency(row.currentImpact)}</td>
                        <td className="py-1.5 pl-3 text-right">
                          <span className={row.direction === "positive" ? "text-green" : "text-income-low"}>
                            {row.direction === "positive" ? "↑ Positive" : "↓ Negative"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
          >
            <SensitivityTable data={sensitivity} />
          </ChartContainer>

          {/* Methodology & Data Sources — collapsible */}
          <div
            className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden"
            role="region"
            aria-label="Methodology and data sources"
          >
            <button
              onClick={() => setMethodologyOpen(!methodologyOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-surface-alt/30 transition-colors"
              aria-expanded={methodologyOpen}
            >
              <div>
                <h3 className="text-xs font-semibold text-title uppercase tracking-wider">
                  Methodology & Data Sources
                </h3>
                <p className="text-[10px] text-gray mt-0.5">
                  How projections are calculated and where data comes from
                </p>
              </div>
              <ChevronDown
                size={16}
                className={`text-gray transition-transform flex-shrink-0 ${
                  methodologyOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {methodologyOpen && (
              <div className="px-4 pb-4 border-t border-surface-alt">
                {/* Model overview */}
                <div className="mt-3 mb-4 p-3 bg-surface-alt/40 rounded-lg">
                  <p className="text-[11px] font-semibold text-title mb-1">
                    Projection Formula
                  </p>
                  <p className="font-mono text-[11px] text-body">
                    projected = baseline &times; (1 + &Sigma; driver effects)
                  </p>
                  <p className="text-[10px] text-gray mt-1">
                    Each slider controls one driver. Effects are additive
                    fractions of baseline income, weighted by empirically
                    calibrated elasticities. Interventions ramp linearly over 6
                    months to full effect.
                  </p>
                </div>

                {/* Sections in a grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <MethodologyCard
                    title="Baseline Incomes"
                    items={[
                      "Derived from 2024 Rapid Impact Assessment endline survey data across Shell Foundation partners.",
                      "Portfolio-wide baselines are sample-weighted averages across all partners in each actor segment.",
                      "Country-specific baselines reflect partner data from that market (e.g., India farmers = Sistema.bio + S4S weighted avg).",
                    ]}
                  />
                  <MethodologyCard
                    title="Living Wage Benchmarks"
                    items={[
                      "Country-specific: India $7.20, Kenya $8.50, Rwanda $6.80, Nigeria $6.50 per day (USD PPP).",
                      "Portfolio average of $7.50/day used when viewing all countries combined.",
                      "Source: Global Living Wage Coalition & Anker methodology.",
                    ]}
                  />
                  <MethodologyCard
                    title="Poverty Distribution"
                    items={[
                      "Uses normal approximation with SD = 40% of mean income.",
                      "World Bank International Poverty Lines: $2.15/day (extreme), $3.65/day (moderate).",
                      "Beneficiary counts estimated by applying CDF thresholds to selected population size.",
                    ]}
                  />
                  <MethodologyCard
                    title="Sensitivity Analysis"
                    items={[
                      "Tests a +10% change in each income driver independently.",
                      "Ranked by income elasticity: the percentage change in projected income per 10% driver increase.",
                      "Helps identify which levers have the highest impact for each actor type.",
                    ]}
                  />
                </div>

                {/* Data source table */}
                <div className="mt-3">
                  <p className="text-[10px] font-semibold text-title uppercase tracking-wider mb-2">
                    Baseline Data by Country & Actor Type
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[10px]">
                      <thead>
                        <tr className="border-b border-surface-alt">
                          <th className="text-left py-1 pr-3 text-gray font-medium">
                            Country
                          </th>
                          <th className="text-left py-1 pr-3 text-gray font-medium">
                            Actor Type
                          </th>
                          <th className="text-right py-1 pr-3 text-gray font-medium">
                            Baseline
                          </th>
                          <th className="text-right py-1 pr-3 text-gray font-medium">
                            Living Wage
                          </th>
                          <th className="text-left py-1 text-gray font-medium">
                            Partners
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-body">
                        <DataRow
                          country="India"
                          actor="Farmers"
                          baseline={3.8}
                          livingWage={7.2}
                          partners="Sistema.bio, S4S"
                        />
                        <DataRow
                          country="India"
                          actor="Transporters"
                          baseline={5.0}
                          livingWage={7.2}
                          partners="SIDBI"
                        />
                        <DataRow
                          country="Kenya"
                          actor="Farmers"
                          baseline={3.0}
                          livingWage={8.5}
                          partners="Sunculture"
                        />
                        <DataRow
                          country="Kenya"
                          actor="Transporters"
                          baseline={6.5}
                          livingWage={8.5}
                          partners="M-KOPA"
                        />
                        <DataRow
                          country="Kenya"
                          actor="Micro."
                          baseline={5.5}
                          livingWage={8.5}
                          partners="Keep IT Cool"
                        />
                        <DataRow
                          country="Rwanda"
                          actor="Transporters"
                          baseline={4.0}
                          livingWage={6.8}
                          partners="Ampersand"
                        />
                        <DataRow
                          country="Nigeria"
                          actor="Micro."
                          baseline={3.0}
                          livingWage={6.5}
                          partners="Odyssey"
                        />
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div
            className="bg-gold-tint rounded-[var(--radius-card)] p-3"
            role="note"
          >
            <p className="text-[10px] text-body">
              <span className="font-bold">Note:</span> Projections are
              illustrative estimates based on simplified models. Actual income
              outcomes depend on many factors not captured here including market
              conditions, weather, policy changes, and individual circumstances.
              These scenarios are intended for directional guidance only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({
  label,
  value,
  sub,
  color,
  trend,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
  trend?: { value: number; label: string };
}) {
  const TrendIcon =
    trend && Math.abs(trend.value) < 0.5
      ? Minus
      : trend && trend.value >= 0
        ? TrendingUp
        : TrendingDown;

  const trendColor =
    trend && Math.abs(trend.value) < 0.5
      ? "text-gray"
      : trend && trend.value >= 0
        ? "text-green"
        : "text-income-low";

  return (
    <div
      className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-3 text-center"
      role="listitem"
    >
      <p className="text-[10px] text-gray uppercase tracking-wide">{label}</p>
      <p
        className="text-lg font-bold font-[var(--font-heading)] mt-0.5"
        style={{ color }}
      >
        {value}
      </p>
      {sub && <p className="text-[10px] text-gray">{sub}</p>}
      {trend && (
        <div className={`flex items-center justify-center gap-1 mt-1.5 ${trendColor}`}>
          <TrendIcon size={12} />
          <span className="text-[11px] font-semibold">
            {trend.value >= 0 ? "+" : ""}
            {trend.value.toFixed(1)}%
          </span>
          <span className="text-[10px] text-gray font-normal">
            {trend.label}
          </span>
        </div>
      )}
    </div>
  );
}

function MethodologyCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="p-2.5 bg-surface-alt/30 rounded-lg">
      <p className="text-[10px] font-semibold text-title mb-1.5">{title}</p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-[10px] text-body leading-relaxed flex gap-1.5">
            <span className="text-gray mt-0.5 flex-shrink-0">&bull;</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DataRow({
  country,
  actor,
  baseline,
  livingWage,
  partners,
}: {
  country: string;
  actor: string;
  baseline: number;
  livingWage: number;
  partners: string;
}) {
  return (
    <tr className="border-b border-surface-alt/50">
      <td className="py-1.5 pr-3 font-medium">{country}</td>
      <td className="py-1.5 pr-3">{actor}</td>
      <td className="py-1.5 pr-3 text-right font-mono">
        ${baseline.toFixed(2)}
      </td>
      <td className="py-1.5 pr-3 text-right font-mono">
        ${livingWage.toFixed(2)}
      </td>
      <td className="py-1.5 text-gray">{partners}</td>
    </tr>
  );
}
