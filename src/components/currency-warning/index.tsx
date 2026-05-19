import React from "react";
import { useRegionalConfig } from "../../contexts/regional-config-context";
import * as S from "./styles";

export const CurrencyWarning: React.FC = () => {
  const { selectedCountry } = useRegionalConfig();

  if (selectedCountry === "BR") {
    return null;
  }

  return (
    <S.WarningContainer>
      O valor exibido em Euro (€) / Dólar (U$) é uma conversão de referência
      baseada na cotação oficial do Banco Central do Brasil (PTAX) do dia. O valor final
      cobrado no seu cartão pode ser diferente, pois será definido pela taxa de
      câmbio utilizada pela operadora do seu cartão de crédito e pelo seu banco
      emissor, no momento da transação, e poderá incluir taxas operacionais
      (spread) e impostos.
    </S.WarningContainer>
  );
};
