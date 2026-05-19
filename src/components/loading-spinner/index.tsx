import * as S from "./styles";

interface Props {
  size?: "small" | "medium" | "large";
  message?: string;
}

export const LoadingSpinner = ({
  size = "medium",
  message,
}: Props) => {
  return (
    <S.Container>
      <S.SpinnerWrapper size={size}>
        <S.OrbitalRing size={size} />
        <S.PulseRing size={size} />
        <S.LogoBadge size={size}>Logo</S.LogoBadge>
      </S.SpinnerWrapper>
      {message && <S.LoadingMessage>{message}</S.LoadingMessage>}
    </S.Container>
  );
};
