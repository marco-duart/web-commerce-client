import React from "react";
import { styled } from "../../assets/styles/stitches.config";
import { FaTimes } from "react-icons/fa";

const Overlay = styled("div", {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.6)",
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
});

const ModalContainer = styled("div", {
  backgroundColor: "#fff",
  width: "100%",
  maxWidth: "800px",
  maxHeight: "90vh",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
});

const ModalHeader = styled("div", {
  padding: "20px",
  borderBottom: "1px solid #eee",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  h3: { margin: 0, color: "$primaryDark" },
  svg: { cursor: "pointer", color: "#666" },
});

const ModalContent = styled("div", {
  padding: "20px",
  overflowY: "auto",
  whiteSpace: "pre-line",
  lineHeight: "1.6",
  fontSize: "0.9rem",
  color: "#333",
  fontFamily: "monospace",
});

const ModalFooter = styled("div", {
  padding: "15px 20px",
  borderTop: "1px solid #eee",
  textAlign: "right",
});

const Button = styled("button", {
  padding: "10px 20px",
  backgroundColor: "$primary",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  fontWeight: "bold",
  cursor: "pointer",
  "&:hover": { backgroundColor: "$primaryDark" },
});

interface Props {
  onClose: () => void;
}

export const TermsModal: React.FC<Props> = ({ onClose }) => {
  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>Termos de Uso do Prototipo</h3>
          <FaTimes size={20} onClick={onClose} />
        </ModalHeader>
        <ModalContent>
          {`TERMO DE USO - AMBIENTE DE PROTOTIPO

1. Este sistema e uma demonstracao de fluxo de compra para apresentacao comercial.
2. Nenhum pagamento real e processado neste ambiente.
3. Os dados exibidos (produtos, pedidos e status) sao simulados para testes de navegacao.
4. O preenchimento do formulario neste prototipo nao gera contratacao real.
5. O uso deste ambiente e permitido apenas para avaliacao funcional e visual.

POLITICA DE DADOS
1. Informacoes fornecidas durante o teste podem ser armazenadas localmente no navegador para simular continuidade de sessao.
2. Nao ha integracao obrigatoria com gateways de pagamento neste modo.

LIMITES DO PROTOTIPO
1. Valores, prazos e disponibilidade apresentados sao ficticios.
2. Regras de aprovacao, recusas e tentativas de pagamento sao simuladas.

ACEITE
Ao marcar o aceite, voce confirma que compreende que este ambiente e apenas um prototipo funcional para demonstracao.`}
        </ModalContent>
        <ModalFooter>
          <Button onClick={onClose}>Li e Concordo</Button>
        </ModalFooter>
      </ModalContainer>
    </Overlay>
  );
};