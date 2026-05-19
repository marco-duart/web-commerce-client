import React from "react";
import * as S from "./styles";

type Props = {
  banner?: string;
  message?: string;
};

export const UNAVAILABLE_OFFER_MESSAGES = {
  expired: "OFERTA ENCERRADA!",
  closed: "OFERTA ESGOTADA!",
};

export const OfferUnavailable: React.FC<Props> = ({
  banner,
  message = UNAVAILABLE_OFFER_MESSAGES.expired,
}) => {
  return (
    <S.Container>
      <S.Card>
        <S.BannerWrapper hasImage={!!banner}>
          {banner && (
            <S.BannerImage src={banner} alt="Banner do pacote promocional" />
          )}
        </S.BannerWrapper>

        <S.Content>
          <S.Title>{message}</S.Title>

          <S.Description>Esta oferta não está mais disponível.</S.Description>

          <S.SubDescription>
            Consulte outras campanhas disponiveis neste prototipo.
          </S.SubDescription>
        </S.Content>
      </S.Card>
    </S.Container>
  );
};
