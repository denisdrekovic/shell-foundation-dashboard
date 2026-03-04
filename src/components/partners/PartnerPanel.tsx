import ChartContainer from "@/components/ui/ChartContainer";
import IncomeUpliftHistogram from "@/components/charts/IncomeUpliftHistogram";
import IncomeBenchmarksLine from "@/components/charts/IncomeBenchmarksLine";
import QualityOfLifeBar from "@/components/charts/QualityOfLifeBar";
import ResiliencePie from "@/components/charts/ResiliencePie";
import { PartnerData } from "@/types/partner";
import {
  prepareUpliftCSV,
  prepareBenchmarksCSV,
  prepareQualityOfLifeCSV,
  prepareResilienceCSV,
} from "@/lib/csvHelpers";

interface PartnerPanelProps {
  data: PartnerData;
}

export default function PartnerPanel({ data }: PartnerPanelProps) {
  const slug = data.id;

  return (
    <div className="space-y-6">
      {/* Partner header */}
      <div className="bg-deep-purple text-white rounded-[var(--radius-card)] p-4 text-center">
        <h2 className="text-xl font-bold font-[var(--font-heading)]">
          {data.name}
          <span className="text-white/60 font-normal ml-2">
            – {data.asset}
          </span>
        </h2>
      </div>

      {/* Income Uplift */}
      <ChartContainer
        title={`${data.name} – Income Uplift`}
        subtitle="Distribution of net income change across respondents"
        csvData={prepareUpliftCSV(data.incomeUplift.bins)}
        csvFilename={`${slug}-income-uplift`}
        tableView={
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-surface-alt text-[10px] text-gray uppercase tracking-wide">
                  <th className="text-left py-2 pr-3 font-medium">Range</th>
                  <th className="text-right py-2 px-3 font-medium">All</th>
                  <th className="text-right py-2 px-3 font-medium">Men</th>
                  <th className="text-right py-2 pl-3 font-medium">Women</th>
                </tr>
              </thead>
              <tbody>
                {data.incomeUplift.bins.map((b) => (
                  <tr key={b.rangeLabel} className="border-b border-surface-alt/50">
                    <td className="py-1.5 pr-3 font-medium text-title">{b.rangeLabel}%</td>
                    <td className="py-1.5 px-3 text-right">{b.all}</td>
                    <td className="py-1.5 px-3 text-right">{b.men}</td>
                    <td className="py-1.5 pl-3 text-right">{b.women}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      >
        <IncomeUpliftHistogram
          bins={data.incomeUplift.bins}
          mean={data.incomeUplift.stats.mean}
          median={data.incomeUplift.stats.median}
        />
      </ChartContainer>

      {/* Income Benchmarks */}
      <ChartContainer
        title={`${data.name} – Income Benchmarks`}
        subtitle="Baseline vs endline income by gender with poverty and living wage reference lines"
        csvData={prepareBenchmarksCSV(
          data.incomeBenchmarks.baseline,
          data.incomeBenchmarks.endline,
          data.incomeBenchmarks.referenceLines
        )}
        csvFilename={`${slug}-income-benchmarks`}
        tableView={
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-surface-alt text-[10px] text-gray uppercase tracking-wide">
                  <th className="text-left py-2 pr-3 font-medium">Period</th>
                  <th className="text-right py-2 px-3 font-medium">All ($/day)</th>
                  <th className="text-right py-2 px-3 font-medium">Men ($/day)</th>
                  <th className="text-right py-2 pl-3 font-medium">Women ($/day)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { period: "Baseline", all: data.incomeBenchmarks.baseline.all, men: data.incomeBenchmarks.baseline.men, women: data.incomeBenchmarks.baseline.women },
                  { period: "Endline", all: data.incomeBenchmarks.endline.all, men: data.incomeBenchmarks.endline.men, women: data.incomeBenchmarks.endline.women },
                ].map((row) => (
                  <tr key={row.period} className="border-b border-surface-alt/50">
                    <td className="py-1.5 pr-3 font-medium text-title">{row.period}</td>
                    <td className="py-1.5 px-3 text-right">${row.all.toFixed(2)}</td>
                    <td className="py-1.5 px-3 text-right">${row.men.toFixed(2)}</td>
                    <td className="py-1.5 pl-3 text-right">${row.women.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      >
        <IncomeBenchmarksLine
          baseline={data.incomeBenchmarks.baseline}
          endline={data.incomeBenchmarks.endline}
          referenceLines={data.incomeBenchmarks.referenceLines}
        />
      </ChartContainer>

      {/* Quality of Life */}
      <ChartContainer
        title={`${data.name} – Quality of Life`}
        subtitle="Self-reported agreement with quality of life statements"
        csvData={prepareQualityOfLifeCSV(data.qualityOfLife)}
        csvFilename={`${slug}-quality-of-life`}
        tableView={
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-surface-alt text-[10px] text-gray uppercase tracking-wide">
                  <th className="text-left py-2 pr-3 font-medium">Question</th>
                  <th className="text-right py-2 px-2 font-medium">Strongly Agree</th>
                  <th className="text-right py-2 px-2 font-medium">Agree</th>
                  <th className="text-right py-2 px-2 font-medium">Disagree</th>
                  <th className="text-right py-2 pl-2 font-medium">Strongly Disagree</th>
                </tr>
              </thead>
              <tbody>
                {data.qualityOfLife.map((item) => (
                  <tr key={item.question} className="border-b border-surface-alt/50">
                    <td className="py-1.5 pr-3 font-medium text-title max-w-48 truncate">{item.question}</td>
                    <td className="py-1.5 px-2 text-right">{item.stronglyAgree}%</td>
                    <td className="py-1.5 px-2 text-right">{item.agree}%</td>
                    <td className="py-1.5 px-2 text-right">{item.disagree}%</td>
                    <td className="py-1.5 pl-2 text-right">{item.stronglyDisagree}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      >
        <QualityOfLifeBar items={data.qualityOfLife} />
      </ChartContainer>

      {/* Resilience */}
      <ChartContainer
        title={`${data.name} – Resilience`}
        subtitle="Ability to manage unexpected financial expenses"
        csvData={prepareResilienceCSV(data.resilience)}
        csvFilename={`${slug}-resilience`}
        tableView={
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-surface-alt text-[10px] text-gray uppercase tracking-wide">
                  <th className="text-left py-2 pr-3 font-medium">Response</th>
                  <th className="text-right py-2 pl-3 font-medium">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {data.resilience.map((s) => (
                  <tr key={s.label} className="border-b border-surface-alt/50">
                    <td className="py-1.5 pr-3 font-medium text-title flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: s.color }} />
                      {s.label}
                    </td>
                    <td className="py-1.5 pl-3 text-right">{s.value}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      >
        <ResiliencePie slices={data.resilience} />
      </ChartContainer>
    </div>
  );
}
