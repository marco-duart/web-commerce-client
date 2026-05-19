import { useEffect } from "react";
import { useRegionalConfig } from "../contexts/regional-config-context";
import { mapTargetCountryToCountry } from "../utils/country-mapper";

export const useLocationFromTargetCountry = (targetCountry?: number) => {
  const { setCountry, selectedCountry } = useRegionalConfig();

  useEffect(() => {
    if (targetCountry !== undefined && targetCountry !== null) {
      const mappedCountry = mapTargetCountryToCountry(targetCountry);
      if (mappedCountry !== selectedCountry) {
        setCountry(mappedCountry);
      }
    }
  }, [targetCountry, selectedCountry, setCountry]);

  return selectedCountry;
};
