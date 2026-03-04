import Card from "@/components/ui/Card";
import IncomeUpliftHistogram from "@/components/charts/IncomeUpliftHistogram";
import IncomeBenchmarksLine from "@/components/charts/IncomeBenchmarksLine";
import QualityOfLifeBar from "@/components/charts/QualityOfLifeBar";
import ResiliencePie from "@/components/charts/ResiliencePie";
import { PartnerData } from "@/types/partner";

interface PartnerPanelProps {
  data: PartnerData;
}

export default function PartnerPanel({ data }: PartnerPanelProps) {
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
      <Card>
        <IncomeUpliftHistogram
          bins={data.incomeUplift.bins}
          mean={data.incomeUplift.stats.mean}
          median={data.incomeUplift.stats.median}
          title={`${data.name} – Income Uplift`}
        />
      </Card>

      {/* Income Benchmarks */}
      <Card>
        <IncomeBenchmarksLine
          baseline={data.incomeBenchmarks.baseline}
          endline={data.incomeBenchmarks.endline}
          referenceLines={data.incomeBenchmarks.referenceLines}
          title={`${data.name} – Income Benchmarks`}
        />
      </Card>

      {/* Quality of Life */}
      <Card>
        <QualityOfLifeBar
          items={data.qualityOfLife}
          title={`${data.name} – Quality of Life`}
        />
      </Card>

      {/* Resilience */}
      <Card>
        <ResiliencePie
          slices={data.resilience}
          title={`${data.name} – Resilience`}
        />
      </Card>
    </div>
  );
}
