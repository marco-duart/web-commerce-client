import React from "react";
import * as S from "./styles";

interface Props {
  validityText: string;
}

const FireIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C12 2 6 9 6 14C6 17.31 8.69 20 12 20C15.31 20 18 17.31 18 14C18 9 12 2 12 2Z" />
    <path
      d="M12 2C12 2 9 8 9 12C9 14.21 10.13 16.16 11.81 17.29"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      opacity="0.6"
    />
  </svg>
);

export const OfferValidityBanner: React.FC<Props> = ({
  validityText,
}) => {
  return (
    <S.Container>
      <S.LabelWrapper>
        <S.Label>Oferta expira em</S.Label>
      </S.LabelWrapper>
      <S.TimeCapsule>
        <S.FireIcon>
          <FireIcon />
        </S.FireIcon>
        <S.Time>{validityText}</S.Time>
        <S.Spark position="topRight" />
        <S.Spark position="topLeft" />
        <S.Spark position="bottomRight" />
        <S.Spark position="bottomLeft" />
      </S.TimeCapsule>
    </S.Container>
  );
};
