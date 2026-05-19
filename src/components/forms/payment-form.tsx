import React, { useState, useMemo, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import * as S from "./styles";
import { CreditCard } from "../credit-card";
import {
  formatCardNumber,
  formatExpiry,
  formatCVC,
  parseCurrency,
  formatCurrency,
} from "../../utils/masks";
import { detectCardIssuer, type CardIssuer } from "../../utils/card-issuer";
import { getNestedError, hasNestedError } from "../../utils/form-errors";
import { type CheckoutFormData } from "../../schemas/checkout.schema";
import { FaQrcode } from "react-icons/fa";
import { useRegionalConfig } from "../../contexts/regional-config-context";

interface Props {
  totalAmount: number;
  onMethodChange: (method: "credit_card" | "two_cards" | "pix") => void;
}

export const PaymentForm: React.FC<Props> = ({
  totalAmount,
  onMethodChange,
}) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CheckoutFormData>();

  const paymentMethod = watch("paymentMethod");
  const creditCard = watch("creditCard");
  const twoCards = watch("twoCards");

  const [focusedField, setFocusedField] = useState<
    "number" | "name" | "expiry" | "cvc"
  >("number");

  const [singleIssuer, setSingleIssuer] = useState<CardIssuer>("default");
  const [duoIssuer1, setDuoIssuer1] = useState<CardIssuer>("default");
  const [duoIssuer2, setDuoIssuer2] = useState<CardIssuer>("default");

  const [amount1Display, setAmount1Display] = useState("");

  const { selectedCountry } = useRegionalConfig();

  const amount2 = useMemo(() => {
    const val1 = parseCurrency(amount1Display);
    const remaining = totalAmount - val1;
    return remaining > 0 ? remaining : 0;
  }, [amount1Display, totalAmount]);

  useEffect(() => {
    const val1 = parseCurrency(amount1Display);
    if (val1 > totalAmount) {
      setAmount1Display("");
      setValue("twoCards.amount1", 0);
    }
  }, [totalAmount, setValue]);

  const handleAmount1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const numeric = raw.replace(/\D/g, "");
    const currency = (Number(numeric) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    setAmount1Display(currency);
    setValue("twoCards.amount1", Number(numeric) / 100);
  };

  const handleTabChange = (method: "credit_card" | "two_cards" | "pix") => {
    setValue("paymentMethod", method);
    onMethodChange(method);
  };

  return (
    <div>
      <S.TabsContainer>
        <S.Tab
          isActive={paymentMethod === "credit_card"}
          type="button"
          onClick={() => handleTabChange("credit_card")}
        >
          1 Cartão
        </S.Tab>
        <S.Tab
          isActive={paymentMethod === "two_cards"}
          type="button"
          onClick={() => handleTabChange("two_cards")}
        >
          2 Cartões
        </S.Tab>

        {selectedCountry === "BR" && (
          <S.Tab
            isActive={paymentMethod === "pix"}
            type="button"
            onClick={() => handleTabChange("pix")}
          >
            Pix
          </S.Tab>
        )}
      </S.TabsContainer>

      {paymentMethod === "credit_card" && (
        <S.FadeIn>
          <div style={{ marginBottom: "24px" }}>
            <CreditCard
              number={creditCard?.number || ""}
              name={creditCard?.name || ""}
              expiry={creditCard?.expiry || ""}
              focused={focusedField}
              issuer={singleIssuer}
            />
          </div>

          <S.FormGrid>
            <S.GridItem span={12}>
              <S.FormGroup>
                <S.Label>Número do Cartão</S.Label>
                <S.Input
                  placeholder="0000 0000 0000 0000"
                  hasError={hasNestedError(errors, ["creditCard", "number"])}
                  {...register("creditCard.number", {
                    onChange: (e) => {
                      const fmt = formatCardNumber(e.target.value);
                      setValue("creditCard.number", fmt);
                      setSingleIssuer(detectCardIssuer(fmt));
                    },
                  })}
                  onFocus={() => setFocusedField("number")}
                  maxLength={19}
                />
                {getNestedError(errors, ["creditCard", "number"]) && (
                  <S.ErrorMessage>
                    {getNestedError(errors, ["creditCard", "number"])?.message}
                  </S.ErrorMessage>
                )}
              </S.FormGroup>
            </S.GridItem>

            <S.GridItem span={12}>
              <S.FormGroup>
                <S.Label>Nome do Titular</S.Label>
                <S.Input
                  placeholder="COMO ESTÁ NO CARTÃO"
                  style={{ textTransform: "uppercase" }}
                  hasError={hasNestedError(errors, ["creditCard", "name"])}
                  {...register("creditCard.name")}
                  onFocus={() => setFocusedField("name")}
                />
                {hasNestedError(errors, ["creditCard", "name"]) && (
                  <S.ErrorMessage>
                    {getNestedError(errors, ["creditCard", "name"])?.message}
                  </S.ErrorMessage>
                )}
              </S.FormGroup>
            </S.GridItem>

            <S.GridItem span={6}>
              <S.FormGroup>
                <S.Label>Validade</S.Label>
                <S.Input
                  placeholder="MM/AA"
                  maxLength={5}
                  hasError={hasNestedError(errors, ["creditCard", "expiry"])}
                  {...register("creditCard.expiry", {
                    onChange: (e) =>
                      setValue(
                        "creditCard.expiry",
                        formatExpiry(e.target.value),
                      ),
                  })}
                  onFocus={() => setFocusedField("expiry")}
                />
                {hasNestedError(errors, ["creditCard", "expiry"]) && (
                  <S.ErrorMessage>
                    {getNestedError(errors, ["creditCard", "expiry"])?.message}
                  </S.ErrorMessage>
                )}
              </S.FormGroup>
            </S.GridItem>

            <S.GridItem span={6}>
              <S.FormGroup>
                <S.Label>CVV</S.Label>
                <S.Input
                  placeholder="123"
                  maxLength={4}
                  hasError={hasNestedError(errors, ["creditCard", "cvc"])}
                  {...register("creditCard.cvc", {
                    onChange: (e) =>
                      setValue(
                        "creditCard.cvc",
                        formatCVC(e.target.value, creditCard?.number || ""),
                      ),
                  })}
                  onFocus={() => setFocusedField("cvc")}
                />
                {hasNestedError(errors, ["creditCard", "cvc"]) && (
                  <S.ErrorMessage>
                    {getNestedError(errors, ["creditCard", "cvc"])?.message}
                  </S.ErrorMessage>
                )}
              </S.FormGroup>
            </S.GridItem>
          </S.FormGrid>
        </S.FadeIn>
      )}

      {paymentMethod === "two_cards" && (
        <S.FadeIn>
          <S.FormGroup style={{ marginBottom: 20 }}>
            <S.Label>Quanto cobrar no 1º Cartão?</S.Label>
            <S.Input
              value={amount1Display}
              onChange={handleAmount1Change}
              placeholder="R$ 0,00"
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: "#27AE60",
              }}
            />
            <S.HelperText>
              Restante no 2º cartão: <strong>{formatCurrency(amount2)}</strong>
            </S.HelperText>
          </S.FormGroup>

          <S.SectionTitle>1º Cartão</S.SectionTitle>
          <div style={{ marginBottom: "20px" }}>
            <CreditCard
              number={twoCards?.card1?.number || ""}
              name={twoCards?.card1?.name || ""}
              expiry={twoCards?.card1?.expiry || ""}
              focused={focusedField}
              issuer={duoIssuer1}
            />
          </div>

          <S.FormGrid
            style={{
              marginBottom: "30px",
              borderBottom: "1px dashed #ccc",
              paddingBottom: "20px",
            }}
          >
            <S.GridItem span={12}>
              <S.FormGroup>
                <S.Label>Número</S.Label>
                <S.Input
                  hasError={hasNestedError(errors, [
                    "twoCards",
                    "card1",
                    "number",
                  ])}
                  {...register("twoCards.card1.number", {
                    onChange: (e) => {
                      const fmt = formatCardNumber(e.target.value);
                      setValue("twoCards.card1.number", fmt);
                      setDuoIssuer1(detectCardIssuer(fmt));
                    },
                  })}
                  onFocus={() => setFocusedField("number")}
                  placeholder="0000 0000 0000 0000"
                />
              </S.FormGroup>
            </S.GridItem>
            <S.GridItem span={12}>
              <S.FormGroup>
                <S.Label>Nome</S.Label>
                <S.Input
                  hasError={hasNestedError(errors, [
                    "twoCards",
                    "card1",
                    "name",
                  ])}
                  {...register("twoCards.card1.name")}
                  onFocus={() => setFocusedField("name")}
                  style={{ textTransform: "uppercase" }}
                />
              </S.FormGroup>
            </S.GridItem>
            <S.GridItem span={6}>
              <S.FormGroup>
                <S.Label>Validade</S.Label>
                <S.Input
                  hasError={hasNestedError(errors, [
                    "twoCards",
                    "card1",
                    "expiry",
                  ])}
                  {...register("twoCards.card1.expiry", {
                    onChange: (e) =>
                      setValue(
                        "twoCards.card1.expiry",
                        formatExpiry(e.target.value),
                      ),
                  })}
                  onFocus={() => setFocusedField("expiry")}
                  placeholder="MM/AA"
                />
              </S.FormGroup>
            </S.GridItem>
            <S.GridItem span={6}>
              <S.FormGroup>
                <S.Label>CVV</S.Label>
                <S.Input
                  hasError={hasNestedError(errors, [
                    "twoCards",
                    "card1",
                    "cvc",
                  ])}
                  {...register("twoCards.card1.cvc", {
                    onChange: (e) =>
                      setValue(
                        "twoCards.card1.cvc",
                        formatCVC(
                          e.target.value,
                          twoCards?.card1?.number || "",
                        ),
                      ),
                  })}
                  onFocus={() => setFocusedField("cvc")}
                  placeholder="123"
                />
              </S.FormGroup>
            </S.GridItem>
          </S.FormGrid>

          <S.SectionTitle>2º Cartão</S.SectionTitle>
          <div style={{ marginBottom: "20px" }}>
            <CreditCard
              number={twoCards?.card2?.number || ""}
              name={twoCards?.card2?.name || ""}
              expiry={twoCards?.card2?.expiry || ""}
              focused={focusedField}
              issuer={duoIssuer2}
            />
          </div>

          <S.FormGrid>
            <S.GridItem span={12}>
              <S.FormGroup>
                <S.Label>Número</S.Label>
                <S.Input
                  hasError={hasNestedError(errors, [
                    "twoCards",
                    "card2",
                    "number",
                  ])}
                  {...register("twoCards.card2.number", {
                    onChange: (e) => {
                      const fmt = formatCardNumber(e.target.value);
                      setValue("twoCards.card2.number", fmt);
                      setDuoIssuer2(detectCardIssuer(fmt));
                    },
                  })}
                  onFocus={() => setFocusedField("number")}
                  placeholder="0000 0000 0000 0000"
                />
              </S.FormGroup>
            </S.GridItem>
            <S.GridItem span={12}>
              <S.FormGroup>
                <S.Label>Nome</S.Label>
                <S.Input
                  hasError={hasNestedError(errors, [
                    "twoCards",
                    "card2",
                    "name",
                  ])}
                  {...register("twoCards.card2.name")}
                  onFocus={() => setFocusedField("name")}
                  style={{ textTransform: "uppercase" }}
                />
              </S.FormGroup>
            </S.GridItem>
            <S.GridItem span={6}>
              <S.FormGroup>
                <S.Label>Validade</S.Label>
                <S.Input
                  hasError={hasNestedError(errors, [
                    "twoCards",
                    "card2",
                    "expiry",
                  ])}
                  {...register("twoCards.card2.expiry", {
                    onChange: (e) =>
                      setValue(
                        "twoCards.card2.expiry",
                        formatExpiry(e.target.value),
                      ),
                  })}
                  onFocus={() => setFocusedField("expiry")}
                  placeholder="MM/AA"
                />
              </S.FormGroup>
            </S.GridItem>
            <S.GridItem span={6}>
              <S.FormGroup>
                <S.Label>CVV</S.Label>
                <S.Input
                  hasError={hasNestedError(errors, [
                    "twoCards",
                    "card2",
                    "cvc",
                  ])}
                  {...register("twoCards.card2.cvc", {
                    onChange: (e) =>
                      setValue(
                        "twoCards.card2.cvc",
                        formatCVC(
                          e.target.value,
                          twoCards?.card2?.number || "",
                        ),
                      ),
                  })}
                  onFocus={() => setFocusedField("cvc")}
                  placeholder="123"
                />
              </S.FormGroup>
            </S.GridItem>
          </S.FormGrid>
        </S.FadeIn>
      )}

      {paymentMethod === "pix" && (
        <S.FadeIn>
          <div
            style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}
          >
            <FaQrcode size={64} color="#27AE60" style={{ marginBottom: 20 }} />
            <h3>Pagamento Instantâneo</h3>
            <p>
              Ao clicar em <strong>Gerar Pix</strong>, um QR Code será gerado
              para você realizar o pagamento.
            </p>
            <p style={{ fontSize: "0.9rem", marginTop: 10 }}>
              A confirmação é feita em alguns segundos.
            </p>
          </div>
        </S.FadeIn>
      )}
    </div>
  );
};
