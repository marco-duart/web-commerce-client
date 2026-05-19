import React from "react";
import { FaCheckCircle, FaWhatsapp } from "react-icons/fa";
import * as S from "./styles";
import toast from "react-hot-toast";

interface Props {
  receptionLink: string;
  voucherLink: string | null;
  onClose: () => void;
  orderId?: string | number;
}

const Icons = {
  Coupon: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        marginRight: "8px",
        verticalAlign: "middle",
      }}
    >
      <path d="M15 5v2" />
      <path d="M15 11v2" />
      <path d="M15 17v2" />
      <path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z" />
    </svg>
  ),
};

export const SuccessModal: React.FC<Props> = ({
  receptionLink,
  voucherLink,
  onClose,
}) => {
  const handleVoucherClick = () => {
    if (!voucherLink) {
      toast.error("Ingresso ainda não disponível para este pedido.");
      return;
    }

    window.open(voucherLink, "_blank", "noopener,noreferrer");
  };

  const isVoucherAvailable = !!voucherLink;

  return (
    <S.Overlay>
      <S.ModalContainer>
        <S.IconWrapper>
          <FaCheckCircle />
        </S.IconWrapper>
        <S.Title>Pagamento Confirmado!</S.Title>
        <S.Message>
          Sua inscrição foi realizada com sucesso. <br />
          Agora, entre no grupo exclusivo de participantes para receber os
          próximos passos.
        </S.Message>

        <S.ActionButton
          href={receptionLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp size={24} />
          ENTRAR NO GRUPO AGORA
        </S.ActionButton>

        <S.ActionButtonVoucher
          onClick={handleVoucherClick}
          disabled={!isVoucherAvailable}
          title={!isVoucherAvailable ? "Ingresso sendo preparado..." : ""}
        >
          <Icons.Coupon />
          VISUALIZAR INGRESSO
        </S.ActionButtonVoucher>

        <S.CloseButton onClick={onClose}>
          Continuar navegando no pedido
        </S.CloseButton>
      </S.ModalContainer>
    </S.Overlay>
  );
};
