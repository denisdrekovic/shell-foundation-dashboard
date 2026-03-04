export const CHART_COLORS = {
  men: "#2A1055",
  women: "#910D63",
  all: "#00A17D",

  stronglyAgree: "#00A17D",
  agree: "#D4F0E7",
  disagree: "#FFC000",
  stronglyDisagree: "#910D63",

  resilience: ["#00A17D", "#2A1055", "#910D63", "#FFC000", "#6D6A6A"],

  referenceLines: {
    extremePoverty: "#DC2626",
    poverty: "#F59E0B",
    livingWage: "#00A17D",
    mean: "#6D6A6A",
    median: "#2A1055",
  },

  categories: {
    "smallholder-farmers": "#00A17D",
    transporters: "#910D63",
    microentrepreneurs: "#2A1055",
  },
} as const;
