import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { FaCopy, FaCheckCircle, FaSync } from "react-icons/fa";
import * as S from "./styles";

interface Props {
  qrCodeImage: string;
  qrCodeData: string;
  expiration: string;
  onRefreshStatus?: () => void;
}

export const PixPayment: React.FC<Props> = ({
  qrCodeImage,
  qrCodeData,
  expiration,
  onRefreshStatus,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(qrCodeData);
    setCopied(true);
    toast.success("Código Pix copiado!");
    setTimeout(() => setCopied(false), 3000);
  };

  const formattedDate = new Date(expiration).toLocaleString("pt-BR");

  return (
    <S.Container>
      <h3>Pagamento via Pix</h3>
      <p>Abra o app do seu banco e escaneie o QRCode abaixo:</p>

      <S.QrCodeImage
        src={
          qrCodeImage.startsWith("data:")
            ? qrCodeImage
            : `data:image/png;base64,${qrCodeImage}`
        }
        alt="QR Code Pix"
      />

      <p>Ou copie o código "Copia e Cola":</p>
      <S.CodeBox onClick={handleCopy} title="Clique para copiar">
        {qrCodeData}
      </S.CodeBox>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <S.CopyButton onClick={handleCopy}>
          {copied ? <FaCheckCircle /> : <FaCopy />}
          {copied ? "Copiado!" : "Copiar Código"}
        </S.CopyButton>

        {onRefreshStatus && (
          <S.CopyButton
            onClick={onRefreshStatus}
            style={{ background: "#3498db" }}
          >
            <FaSync /> Atualizar Status
          </S.CopyButton>
        )}
      </div>

      <S.ExpiryText>Válido até: {formattedDate}</S.ExpiryText>
    </S.Container>
  );
};
