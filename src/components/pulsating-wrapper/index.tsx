import React from "react";
import * as S from "./styles";

interface PulsatingWrapperProps {
  children: React.ReactNode;
}

export const PulsatingWrapper: React.FC<PulsatingWrapperProps> = ({
  children,
}) => {
  return (
    <S.Wrapper>
      {children}
      <S.Tooltip className="tooltip">Últimas Unidades!</S.Tooltip>
    </S.Wrapper>
  );
};
