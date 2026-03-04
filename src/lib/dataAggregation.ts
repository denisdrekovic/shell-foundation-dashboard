import { PartnerData } from "@/types/partner";
import { GeoLocation, EnrichedGeoLocation, CountryPartnerGroup } from "@/types/map";

// Import all partner data
import sistemaBioData from "@/data/partners/sistema-bio.json";
import s4sData from "@/data/partners/s4s.json";
import suncultureData from "@/data/partners/sunculture.json";
import ampersandData from "@/data/partners/ampersand-rwanda.json";
import mkopaData from "@/data/partners/m-kopa.json";
import sidbiData from "@/data/partners/sidbi.json";
import keepItCoolData from "@/data/partners/keep-it-cool.json";
import odysseyData from "@/data/partners/odyssey.json";
import geoData from "@/data/geographic.json";

const allPartners: PartnerData[] = [
  sistemaBioData,
  s4sData,
  suncultureData,
  ampersandData,
  mkopaData,
  sidbiData,
  keepItCoolData,
  odysseyData,
] as PartnerData[];

const partnerMap = new Map<string, PartnerData>();
allPartners.forEach((p) => partnerMap.set(p.id, p));

/**
 * Returns all partner data objects.
 */
export function getAllPartners(): PartnerData[] {
  return allPartners;
}

/**
 * Returns a single partner's data by ID.
 */
export function getPartnerById(id: string): PartnerData | undefined {
  return partnerMap.get(id);
}

/**
 * Enriches geographic data with income benchmarks and quality metrics.
 */
export function enrichGeoData(): EnrichedGeoLocation[] {
  return (geoData as GeoLocation[])
    .map((geo) => {
      const partner = partnerMap.get(geo.partnerId);
      if (!partner) return null;

      const bench = partner.incomeBenchmarks;
      const ratio = bench.endline.all / bench.referenceLines.livingWage;

      // QoL: average of (stronglyAgree + agree) across all questions
      const qolScore =
        partner.qualityOfLife.length > 0
          ? partner.qualityOfLife.reduce(
              (sum, q) => sum + q.stronglyAgree + q.agree,
              0
            ) / partner.qualityOfLife.length
          : 0;

      // Resilience positive: "without difficulty" + "with some difficulty"
      const resPositive = partner.resilience
        .filter(
          (r) =>
            r.label === "Without any difficulty" ||
            r.label === "With some difficulty"
        )
        .reduce((sum, r) => sum + r.value, 0);

      return {
        ...geo,
        endlineIncome: {
          all: bench.endline.all,
          men: bench.endline.men,
          women: bench.endline.women,
        },
        baselineIncome: {
          all: bench.baseline.all,
          men: bench.baseline.men,
          women: bench.baseline.women,
        },
        livingWage: bench.referenceLines.livingWage,
        incomeToWageRatio: ratio,
        incomeUpliftPercent: partner.incomeUplift.stats.median,
        asset: partner.asset,
        qualityOfLifeScore: Math.round(qolScore),
        resiliencePositive: Math.round(resPositive * 10) / 10,
      } as EnrichedGeoLocation;
    })
    .filter((x): x is EnrichedGeoLocation => x !== null);
}

/**
 * Groups enriched locations by country with averaged metrics.
 */
export function groupByCountry(
  locations: EnrichedGeoLocation[]
): CountryPartnerGroup[] {
  const groups = new Map<string, EnrichedGeoLocation[]>();

  locations.forEach((loc) => {
    const existing = groups.get(loc.country) || [];
    existing.push(loc);
    groups.set(loc.country, existing);
  });

  return Array.from(groups.entries()).map(([country, partners]) => {
    const avgLng =
      partners.reduce((sum, p) => sum + p.coordinates[0], 0) / partners.length;
    const avgLat =
      partners.reduce((sum, p) => sum + p.coordinates[1], 0) / partners.length;
    const totalSample = partners.reduce((sum, p) => sum + p.sampleSize, 0);
    const avgRatio =
      partners.reduce((sum, p) => sum + p.incomeToWageRatio, 0) /
      partners.length;

    return {
      country,
      coordinates: [avgLng, avgLat] as [number, number],
      partners,
      avgIncomeToWageRatio: avgRatio,
      totalSampleSize: totalSample,
    };
  });
}

/**
 * Filter enriched locations by global filters.
 */
export function filterLocations(
  locations: EnrichedGeoLocation[],
  filters: {
    location: string | null;
    partnerId: string | null;
    gender: "all" | "men" | "women";
  }
): EnrichedGeoLocation[] {
  return locations.filter((loc) => {
    if (filters.location && loc.country !== filters.location) return false;
    if (filters.partnerId && loc.partnerId !== filters.partnerId) return false;
    return true;
  });
}
