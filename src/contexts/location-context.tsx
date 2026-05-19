import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export interface LocationValidationRules {
  phoneLength: number;
  phoneMask: string;
  documentType: "cpf" | "passport" | "nif" | "id";
  documentLength: number;
  documentMask: string;
}

export interface LocationContextType {
  selectedDdi: string;
  selectedNationality: string;
  validationRules: LocationValidationRules;
  setLocation: (ddi: string, nationality: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
);

const DDI_CONFIG: Record<
  string,
  {
    ddi: string;
    nationality: string;
    rules: LocationValidationRules;
  }
> = {
  BR: {
    ddi: "+55",
    nationality: "Brasileiro",
    rules: {
      phoneLength: 11,
      phoneMask: "(00) 00000-0000",
      documentType: "cpf",
      documentLength: 11,
      documentMask: "000.000.000-00",
    },
  },
  US: {
    ddi: "+1",
    nationality: "Americano",
    rules: {
      phoneLength: 10,
      phoneMask: "(000) 000-0000",
      documentType: "id",
      documentLength: 9,
      documentMask: "000-000-000",
    },
  },
  PT: {
    ddi: "+351",
    nationality: "Português",
    rules: {
      phoneLength: 9,
      phoneMask: "0000 0000",
      documentType: "nif",
      documentLength: 9,
      documentMask: "000 000 000",
    },
  },
  UK: {
    ddi: "+44",
    nationality: "Britânico",
    rules: {
      phoneLength: 10,
      phoneMask: "(0000) 000000",
      documentType: "id",
      documentLength: 8,
      documentMask: "00000000",
    },
  },
  ES: {
    ddi: "+34",
    nationality: "Espanhol",
    rules: {
      phoneLength: 9,
      phoneMask: "000 00 00 00",
      documentType: "id",
      documentLength: 9,
      documentMask: "00000000-0",
    },
  },
};

const DEFAULT_COUNTRY = "BR";
const DEFAULT_DDI_CONFIG = DDI_CONFIG[DEFAULT_COUNTRY];

export function LocationProvider({ children }: { children: ReactNode }) {
  const [selectedDdi, setSelectedDdi] = useState(DEFAULT_DDI_CONFIG.ddi);
  const [selectedNationality, setSelectedNationality] = useState(
    DEFAULT_DDI_CONFIG.nationality,
  );
  const [validationRules, setValidationRules] = useState(
    DEFAULT_DDI_CONFIG.rules,
  );

  const setLocation = useCallback((ddi: string, nationality: string) => {
    setSelectedDdi(ddi);
    setSelectedNationality(nationality);

    const config = Object.values(DDI_CONFIG).find((c) => c.ddi === ddi);
    if (config) {
      setValidationRules(config.rules);
    }
  }, []);

  const value: LocationContextType = {
    selectedDdi,
    selectedNationality,
    validationRules,
    setLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation deve ser usado dentro de LocationProvider");
  }
  return context;
}

export function getDDIConfig(ddi: string) {
  return Object.values(DDI_CONFIG).find((c) => c.ddi === ddi) || null;
}

export function getDDIOptions() {
  return Object.entries(DDI_CONFIG).map(([_, config]) => ({
    value: config.ddi,
    label: `${config.nationality} (${config.ddi})`,
    ddi: config.ddi,
    nationality: config.nationality,
    rules: config.rules,
  }));
}

export const DDI_CONFIG_EXPORT = DDI_CONFIG;
