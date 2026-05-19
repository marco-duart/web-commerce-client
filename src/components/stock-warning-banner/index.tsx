import React from "react";
import * as S from "./styles";

const FireIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      className="outer-flame"
      d="M12 23C15.866 23 19 19.866 19 16C19 12.134 16.5 9.5 14 6C13 4.5 12 2 12 2C12 2 11 4.5 10 6C7.5 9.5 5 12.134 5 16C5 19.866 8.134 23 12 23Z"
      fill="#FFFFFF"
    />
    <path
      className="inner-flame"
      d="M12 23C14.2091 23 16 21.2091 16 19C16 16.7909 14.5 15 13 13C12.5 12 12 10 12 10C12 10 11.5 12 11 13C9.5 15 8 16.7909 8 19C8 21.2091 9.79086 23 12 23Z"
      fill="#FFC107"
    />
  </svg>
);

export const StockWarningBanner: React.FC = () => {
  return (
    <S.Container>
      <S.LabelWrapper>
        <S.Label>Atenção</S.Label>
      </S.LabelWrapper>
      <S.TimeCapsule>
        <S.Icon>
          <S.FireIconWrapper>
            <FireIcon />
          </S.FireIconWrapper>
        </S.Icon>
        <S.Time>Últimas vagas!</S.Time>
        <S.Spark position="topRight" />
        <S.Spark position="topLeft" />
        <S.Spark position="bottomRight" />
        <S.Spark position="bottomLeft" />
      </S.TimeCapsule>
    </S.Container>
  );
};
