import * as S from "./styles";

interface Props {
  message?: string;
}

export const ProcessingScreen = ({
  message = "Processando pagamento...",
}: Props) => {
  return (
    <S.Overlay>
      <S.Container>
        <S.Spinner>
          <S.SpinnerRing />
          <S.SpinnerRing />
          <S.SpinnerRing />
        </S.Spinner>
        <S.Message>{message}</S.Message>
        <S.SubMessage>Aguarde, isso pode levar alguns segundos</S.SubMessage>
      </S.Container>
    </S.Overlay>
  );
};
