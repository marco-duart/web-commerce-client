import type { Country } from "../contexts/regional-config-context.types";

export const mapTargetCountryToCountry = (
  targetCountry: number | string,
): Country => {
  switch (String(targetCountry)) {
    case "0":
      return "BR";
    case "1":
      return "PT";
    case "2":
      return "USA";
    default:
      return "BR";
  }
};

export const mapCountryToTargetCountry = (country: Country): number => {
  switch (country) {
    case "BR":
      return 0;
    case "PT":
      return 1;
    case "USA":
      return 2;
    default:
      return 0;
  }
};
