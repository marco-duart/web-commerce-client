import React from "react";
import { useFormContext } from "react-hook-form";
import * as S from "./styles";
import { type CheckoutFormData } from "../../schemas/checkout.schema";

export const CourtesyPaymentForm: React.FC = () => {
  const {} = useFormContext<CheckoutFormData>();
  return (
    <div>
        <S.FadeIn>
          <div
            style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}
          >
            <h3>Confirme seu pedido</h3>
            <p>
              Você recebeu este pedido como cortesia especial. Não será necessário informar dados de pagamento.
            </p>
          </div>
        </S.FadeIn>
    </div>
  );
};
