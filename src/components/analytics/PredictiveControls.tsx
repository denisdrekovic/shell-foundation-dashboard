"use client";

import {
  PredictiveInputs,
  CROP_CONFIGS,
  ACTOR_TYPE_CONFIG,
  COUNTRY_CONFIG,
  Country,
  DEFAULT_INPUTS,
  FarmerInputs,
  TransporterInputs,
  MicroentrepreneurInputs,
} from "@/types/analytics";
import { PortfolioCategory } from "@/types/partner";
import { Sprout, Truck, Store, Globe } from "lucide-react";

const ACTOR_ICONS: Record<PortfolioCategory, React.ReactNode> = {
  "smallholder-farmers": <Sprout size={14} />,
  transporters: <Truck size={14} />,
  microentrepreneurs: <Store size={14} />,
};

interface PredictiveControlsProps {
  inputs: PredictiveInputs;
  onChange: (inputs: PredictiveInputs) => void;
}

export default function PredictiveControls({
  inputs,
  onChange,
}: PredictiveControlsProps) {
  const actorConf = ACTOR_TYPE_CONFIG[inputs.actorType];

  const setActorType = (actorType: PortfolioCategory) => {
    // When switching actor type, reset country if it doesn't support the new actor type
    const countryConf = COUNTRY_CONFIG[inputs.country];
    const countryValid =
      inputs.country === "all" ||
      countryConf.baselinesByActor[actorType] !== undefined;
    onChange({ ...inputs, actorType, country: countryValid ? inputs.country : "all" });
  };

  const setCountry = (country: Country) => {
    onChange({ ...inputs, country });
  };

  // Countries available for the selected actor type
  const availableCountries = (Object.keys(COUNTRY_CONFIG) as Country[]).filter(
    (c) =>
      c === "all" ||
      COUNTRY_CONFIG[c].baselinesByActor[inputs.actorType] !== undefined
  );

  const updateFarmer = (partial: Partial<FarmerInputs>) =>
    onChange({ ...inputs, farmer: { ...inputs.farmer, ...partial } });

  const updateTransporter = (partial: Partial<TransporterInputs>) =>
    onChange({ ...inputs, transporter: { ...inputs.transporter, ...partial } });

  const updateMicro = (partial: Partial<MicroentrepreneurInputs>) =>
    onChange({
      ...inputs,
      microentrepreneur: { ...inputs.microentrepreneur, ...partial },
    });

  return (
    <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-5 space-y-5">
      {/* Actor type selector */}
      <div>
        <h3 className="text-sm font-bold font-[var(--font-heading)] text-title">
          Actor Type
        </h3>
        <p className="text-[10px] text-gray mt-0.5 mb-3">
          Select the population segment to model
        </p>
        <div className="grid grid-cols-1 gap-1.5" role="radiogroup" aria-label="Actor type">
          {(
            Object.keys(ACTOR_TYPE_CONFIG) as PortfolioCategory[]
          ).map((key) => {
            const conf = ACTOR_TYPE_CONFIG[key];
            const isActive = inputs.actorType === key;
            return (
              <button
                key={key}
                role="radio"
                aria-checked={isActive}
                onClick={() => setActorType(key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-[var(--radius-button)] border text-left transition-all text-[11px] ${
                  isActive
                    ? "border-current font-semibold shadow-sm"
                    : "border-surface-alt text-gray hover:border-gray/40"
                }`}
                style={isActive ? { color: conf.color, borderColor: conf.color, backgroundColor: conf.color + "0A" } : undefined}
              >
                <span
                  className="flex-shrink-0"
                  style={{ color: isActive ? conf.color : undefined }}
                >
                  {ACTOR_ICONS[key]}
                </span>
                <span>{conf.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-surface-alt" />

      {/* Country selector */}
      <div>
        <h3 className="text-sm font-bold font-[var(--font-heading)] text-title flex items-center gap-1.5">
          <Globe size={14} className="text-gray" />
          Country
        </h3>
        <p className="text-[10px] text-gray mt-0.5 mb-2">
          Filter projections by operating market
        </p>
        <select
          value={inputs.country}
          onChange={(e) => setCountry(e.target.value as Country)}
          className="w-full text-xs border border-surface-alt rounded-[var(--radius-button)] px-3 py-2 bg-white text-body focus:outline-none focus:ring-2 focus:ring-plum/30"
        >
          {availableCountries.map((c) => (
            <option key={c} value={c}>
              {COUNTRY_CONFIG[c].label}
            </option>
          ))}
        </select>
        {inputs.country !== "all" && (
          <p className="text-[9px] text-gray mt-1">
            Living wage: ${COUNTRY_CONFIG[inputs.country].livingWage.toFixed(2)}/day
            {" \u00B7 "}
            Partners: {COUNTRY_CONFIG[inputs.country].partners.join(", ")}
          </p>
        )}
      </div>

      <hr className="border-surface-alt" />

      {/* Context description */}
      <div>
        <h3 className="text-sm font-bold font-[var(--font-heading)] text-title">
          Income Drivers
        </h3>
        <p className="text-[10px] text-gray mt-0.5">
          {actorConf.description}
        </p>
      </div>

      {/* Actor-specific controls */}
      {inputs.actorType === "smallholder-farmers" && (
        <FarmerControls inputs={inputs.farmer} onChange={updateFarmer} />
      )}
      {inputs.actorType === "transporters" && (
        <TransporterControls
          inputs={inputs.transporter}
          onChange={updateTransporter}
        />
      )}
      {inputs.actorType === "microentrepreneurs" && (
        <MicroentrepreneurControls
          inputs={inputs.microentrepreneur}
          onChange={updateMicro}
        />
      )}

      <hr className="border-surface-alt" />

      {/* Shared: Beneficiaries */}
      <SliderControl
        label="Number of Beneficiaries"
        value={inputs.numBeneficiaries}
        min={100}
        max={2000}
        step={50}
        unit=""
        onChange={(v) => onChange({ ...inputs, numBeneficiaries: v })}
        color="#910D63"
        formatValue={(v) => v.toLocaleString()}
      />

      {/* Reset */}
      <button
        onClick={() => onChange(DEFAULT_INPUTS)}
        className="w-full text-xs text-gray hover:text-title py-2 border border-surface-alt rounded-[var(--radius-button)] hover:bg-surface transition-all"
      >
        Reset to defaults
      </button>
    </div>
  );
}

// ── Farmer-specific controls ──

function FarmerControls({
  inputs,
  onChange,
}: {
  inputs: FarmerInputs;
  onChange: (partial: Partial<FarmerInputs>) => void;
}) {
  return (
    <div className="space-y-4">
      <SliderControl
        label="Productivity Change"
        value={inputs.productivityChange}
        min={-50}
        max={100}
        step={5}
        unit="%"
        onChange={(v) => onChange({ productivityChange: v })}
        color={inputs.productivityChange >= 0 ? "#00A17D" : "#DC2626"}
      />
      <div>
        <label className="text-[11px] font-semibold text-title uppercase tracking-wide block mb-1.5">
          Crop Type
        </label>
        <select
          value={inputs.cropType}
          onChange={(e) =>
            onChange({
              cropType: e.target.value as FarmerInputs["cropType"],
              cropPricePerUnit:
                CROP_CONFIGS[e.target.value as FarmerInputs["cropType"]]
                  .basePricePerUnit,
            })
          }
          className="w-full text-xs border border-surface-alt rounded-[var(--radius-button)] px-3 py-2 bg-white text-body focus:outline-none focus:ring-2 focus:ring-plum/30"
        >
          {Object.entries(CROP_CONFIGS).map(([id, conf]) => (
            <option key={id} value={id}>
              {conf.label} (base yield: {conf.baseYieldPerHa} t/ha)
            </option>
          ))}
        </select>
      </div>
      <SliderControl
        label="Crop Yield Change"
        value={inputs.cropYieldChange}
        min={-50}
        max={100}
        step={5}
        unit="%"
        onChange={(v) => onChange({ cropYieldChange: v })}
        color={inputs.cropYieldChange >= 0 ? "#00A17D" : "#DC2626"}
      />
      <SliderControl
        label="Crop Price"
        value={inputs.cropPricePerUnit}
        min={0.1}
        max={5.0}
        step={0.1}
        unit="$/kg"
        onChange={(v) => onChange({ cropPricePerUnit: v })}
        color="#2A1055"
        formatValue={(v) => `$${v.toFixed(2)}/kg`}
      />
      <SliderControl
        label="Farm Size"
        value={inputs.farmSizeHectares}
        min={0.5}
        max={10}
        step={0.5}
        unit="ha"
        onChange={(v) => onChange({ farmSizeHectares: v })}
        color="#2A1055"
        formatValue={(v) => `${v.toFixed(1)} ha`}
      />
    </div>
  );
}

// ── Transporter-specific controls ──

function TransporterControls({
  inputs,
  onChange,
}: {
  inputs: TransporterInputs;
  onChange: (partial: Partial<TransporterInputs>) => void;
}) {
  return (
    <div className="space-y-4">
      <SliderControl
        label="Trips per Day"
        value={inputs.tripsPerDay}
        min={1}
        max={20}
        step={1}
        unit=""
        onChange={(v) => onChange({ tripsPerDay: v })}
        color="#910D63"
        formatValue={(v) => `${v} trips`}
      />
      <SliderControl
        label="Revenue per Trip"
        value={inputs.revenuePerTrip}
        min={1}
        max={50}
        step={0.5}
        unit=""
        onChange={(v) => onChange({ revenuePerTrip: v })}
        color="#910D63"
        formatValue={(v) => `$${v.toFixed(2)}`}
      />
      <SliderControl
        label="Fuel Cost Change"
        value={inputs.fuelCostChange}
        min={-50}
        max={100}
        step={5}
        unit="%"
        onChange={(v) => onChange({ fuelCostChange: v })}
        color={inputs.fuelCostChange <= 0 ? "#00A17D" : "#DC2626"}
      />
      <SliderControl
        label="Vehicle Utilization"
        value={inputs.vehicleUtilization}
        min={20}
        max={100}
        step={5}
        unit="%"
        onChange={(v) => onChange({ vehicleUtilization: v })}
        color="#910D63"
        formatValue={(v) => `${v}%`}
      />
      <SliderControl
        label="Fleet Size"
        value={inputs.fleetSize}
        min={1}
        max={10}
        step={1}
        unit=""
        onChange={(v) => onChange({ fleetSize: v })}
        color="#910D63"
        formatValue={(v) => `${v} vehicle${v !== 1 ? "s" : ""}`}
      />
    </div>
  );
}

// ── Microentrepreneur-specific controls ──

function MicroentrepreneurControls({
  inputs,
  onChange,
}: {
  inputs: MicroentrepreneurInputs;
  onChange: (partial: Partial<MicroentrepreneurInputs>) => void;
}) {
  return (
    <div className="space-y-4">
      <SliderControl
        label="Customers per Day"
        value={inputs.customersPerDay}
        min={5}
        max={100}
        step={1}
        unit=""
        onChange={(v) => onChange({ customersPerDay: v })}
        color="#2A1055"
        formatValue={(v) => `${v} customers`}
      />
      <SliderControl
        label="Avg Transaction Value"
        value={inputs.avgTransactionValue}
        min={0.5}
        max={20}
        step={0.5}
        unit=""
        onChange={(v) => onChange({ avgTransactionValue: v })}
        color="#2A1055"
        formatValue={(v) => `$${v.toFixed(2)}`}
      />
      <SliderControl
        label="Operating Cost Change"
        value={inputs.operatingCostChange}
        min={-50}
        max={100}
        step={5}
        unit="%"
        onChange={(v) => onChange({ operatingCostChange: v })}
        color={inputs.operatingCostChange <= 0 ? "#00A17D" : "#DC2626"}
      />
      <SliderControl
        label="Product Lines"
        value={inputs.productDiversification}
        min={1}
        max={5}
        step={1}
        unit=""
        onChange={(v) => onChange({ productDiversification: v })}
        color="#2A1055"
        formatValue={(v) => `${v} line${v !== 1 ? "s" : ""}`}
      />
      <SliderControl
        label="Market Access Change"
        value={inputs.marketAccessChange}
        min={-50}
        max={100}
        step={5}
        unit="%"
        onChange={(v) => onChange({ marketAccessChange: v })}
        color={inputs.marketAccessChange >= 0 ? "#00A17D" : "#DC2626"}
      />
    </div>
  );
}

// ── Shared slider component ──

function SliderControl({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  color,
  formatValue,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
  color: string;
  formatValue?: (v: number) => string;
}) {
  const displayValue = formatValue
    ? formatValue(value)
    : `${value > 0 ? "+" : ""}${value}${unit}`;

  const pct = ((value - min) / (max - min)) * 100;
  const sliderId = `slider-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor={sliderId}
          className="text-[11px] font-semibold text-title uppercase tracking-wide"
        >
          {label}
        </label>
        <span
          className="text-xs font-bold"
          style={{ color }}
          aria-live="polite"
        >
          {displayValue}
        </span>
      </div>
      <input
        id={sliderId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        aria-label={`${label}: ${displayValue}`}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={displayValue}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-plum/40"
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, #EDEBEF ${pct}%, #EDEBEF 100%)`,
          accentColor: color,
        }}
      />
      <div
        className="flex justify-between text-[9px] text-gray mt-0.5"
        aria-hidden="true"
      >
        <span>{formatValue ? formatValue(min) : `${min}${unit}`}</span>
        <span>{formatValue ? formatValue(max) : `${max}${unit}`}</span>
      </div>
    </div>
  );
}
