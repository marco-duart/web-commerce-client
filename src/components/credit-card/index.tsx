import React from "react";
import * as S from "./styles";
import chipImg from "../../assets/images/cards/chip.png";
import { CARD_STYLES, type CardIssuer } from "../../utils/card-issuer";

interface Props {
  number: string;
  name: string;
  expiry: string;
  focused?: "number" | "name" | "expiry" | "cvc";
  issuer?: CardIssuer;
}

export const CreditCard: React.FC<Props> = ({
  number,
  name,
  expiry,
  focused = "number",
  issuer = "default",
}) => {
  const cardStyle = CARD_STYLES[issuer] || CARD_STYLES.default;

  const formattedNumber = number || "•••• •••• •••• ••••";
  const formattedName = name || "NOME DO TITULAR";
  const formattedExpiry = expiry || "••/••";

  return (
    <S.CardContainer
      style={{
        background: cardStyle.gradient,
        color: cardStyle.textColor,
      }}
    >
      <S.CardHeader>
        <S.CardChip src={chipImg} alt="chip" />
        <S.CardLogoBadge>Logo</S.CardLogoBadge>
      </S.CardHeader>

      <S.CardNumber focused={focused === "number"}>
        {formattedNumber}
      </S.CardNumber>

      <S.CardDetails>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <S.CardLabel>Titular</S.CardLabel>
          <S.CardText focused={focused === "name"}>{formattedName}</S.CardText>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <S.CardLabel>Validade</S.CardLabel>
          <S.CardText focused={focused === "expiry"}>
            {focused === "cvc" ? "•••" : formattedExpiry}
          </S.CardText>
        </div>
      </S.CardDetails>
    </S.CardContainer>
  );
};
