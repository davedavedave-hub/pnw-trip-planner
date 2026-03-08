export const fixedCostDefaults = {
  flights: { label: "Flights (PHL → SEA round trip, 2 people)", default: 700, editable: true },
  rentalCar: { label: "Rental Car (8 days)", default: 450, editable: true },
  gas: { label: "Gas (estimated)", default: 200, editable: true },
  parkPass: { label: "National Parks Pass", default: 30, editable: true },
  travelInsurance: { label: "Travel Insurance (optional)", default: 0, editable: true }
};

export const priceRangeLabels = {
  "$": "Budget-Friendly",
  "$$": "Moderate",
  "$$$": "Upscale",
  "$$$$": "Luxury / Splurge"
};
