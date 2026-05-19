import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  retryPaymentSchema,
  type RetryPaymentFormValues,
  cardBaseSchema,
} from "../../schemas/retry-payment.schema";
import type { RetryCheckout } from "../../mocks/types";
import { z } from "zod";

interface Props {
  totalAmount: number;
  loading: boolean;
  onSubmitSingle: (data: {
    card: RetryCheckout.CardData;
    installments: number;
  }) => void;
  onSubmitDuo: (data: RetryCheckout.DuoPaymentItem[]) => void;
}

export const RetryPaymentForm: React.FC<Props> = ({
  totalAmount,
  loading,
  onSubmitSingle,
  onSubmitDuo,
}) => {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<RetryPaymentFormValues>({
    resolver: zodResolver(retryPaymentSchema),
    defaultValues: {
      paymentMethod: "credit_card",
      installments: 1,
      creditCard: { number: "", name: "", expiry: "", cvc: "" },
      twoCards: {
        amount1: 0,
        card1: { number: "", name: "", expiry: "", cvc: "" },
        card2: { number: "", name: "", expiry: "", cvc: "" },
      },
    },
  });

  const paymentMethod = watch("paymentMethod");
  const creditCardValues = watch("creditCard");
  const twoCardsValues = watch("twoCards");

  const [focusedField, setFocusedField] = useState<
    "number" | "name" | "expiry" | "cvc"
  >("number");

  const [singleIssuer, setSingleIssuer] = useState<CardIssuer>("default");
  const [duoIssuer1, setDuoIssuer1] = useState<CardIssuer>("default");
  const [duoIssuer2, setDuoIssuer2] = useState<CardIssuer>("default");

  const [amount1Display, setAmount1Display] = useState("");

  const amount2 = useMemo(() => {
    const val1 = parseCurrency(amount1Display);
    const remaining = totalAmount - val1;
    return remaining > 0 ? remaining : 0;
  }, [amount1Display, totalAmount]);

  const handleAmount1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const numeric = raw.replace(/\D/g, "");
    const floatVal = Number(numeric) / 100;

    setAmount1Display(
      floatVal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    );
    setValue("twoCards.amount1", floatVal);
  };

  const transformCardToDTO = (
    formCard: z.infer<typeof cardBaseSchema>
  ): RetryCheckout.CardData => {
    const [month, year] = formCard.expiry.split("/");
    return {
      name: formCard.name,
      number: formCard.number,
      cvv: formCard.cvc,
      expiration_month: month,
      expiration_year: `20${year}`,
      card_type: detectCardIssuer(formCard.number),
    };
  };

  const onFormSubmit = (data: RetryPaymentFormValues) => {
    if (data.paymentMethod === "credit_card" && data.creditCard) {
      const dtoCard = transformCardToDTO(data.creditCard);

      onSubmitSingle({
        card: dtoCard,
        installments: data.installments,
      });
    } else if (data.paymentMethod === "two_cards" && data.twoCards) {
      const amount2Calc = totalAmount - data.twoCards.amount1;

      const dtoCard1 = transformCardToDTO(data.twoCards.card1);
      const dtoCard2 = transformCardToDTO(data.twoCards.card2);

      onSubmitDuo([
        { card: dtoCard1, amount: data.twoCards.amount1 },
        { card: dtoCard2, amount: amount2Calc },
      ]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <S.TabsContainer>
        <S.Tab
          type="button"
          isActive={paymentMethod === "credit_card"}
          onClick={() => setValue("paymentMethod", "credit_card")}
        >
          1 Cartão
        </S.Tab>
        <S.Tab
          type="button"
          isActive={paymentMethod === "two_cards"}
          onClick={() => setValue("paymentMethod", "two_cards")}
        >
          2 Cartões
        </S.Tab>
      </S.TabsContainer>

      {paymentMethod === "credit_card" && (
        <S.FadeIn>
          <div
            style={{
              marginBottom: "24px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CreditCard
              number={creditCardValues?.number || ""}
              name={creditCardValues?.name || ""}
              expiry={creditCardValues?.expiry || ""}
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
                  hasError={!!errors.creditCard?.number}
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
                {errors.creditCard?.number && (
                  <S.ErrorMessage>
                    {errors.creditCard.number.message}
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
                  hasError={!!errors.creditCard?.name}
                  {...register("creditCard.name")}
                  onFocus={() => setFocusedField("name")}
                />
                {errors.creditCard?.name && (
                  <S.ErrorMessage>
                    {errors.creditCard.name.message}
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
                  hasError={!!errors.creditCard?.expiry}
                  {...register("creditCard.expiry", {
                    onChange: (e) =>
                      setValue(
                        "creditCard.expiry",
                        formatExpiry(e.target.value)
                      ),
                  })}
                  onFocus={() => setFocusedField("expiry")}
                />
                {errors.creditCard?.expiry && (
                  <S.ErrorMessage>
                    {errors.creditCard.expiry.message}
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
                  hasError={!!errors.creditCard?.cvc}
                  {...register("creditCard.cvc", {
                    onChange: (e) =>
                      setValue(
                        "creditCard.cvc",
                        formatCVC(
                          e.target.value,
                          creditCardValues?.number || ""
                        )
                      ),
                  })}
                  onFocus={() => setFocusedField("cvc")}
                />
                {errors.creditCard?.cvc && (
                  <S.ErrorMessage>
                    {errors.creditCard.cvc.message}
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
          <div style={{ marginBottom: 20 }}>
            <CreditCard
              number={twoCardsValues?.card1?.number || ""}
              name={twoCardsValues?.card1?.name || ""}
              expiry={twoCardsValues?.card1?.expiry || ""}
              focused={focusedField}
              issuer={duoIssuer1}
            />
          </div>
          <S.FormGrid
            style={{
              marginBottom: 20,
              borderBottom: "1px dashed #ccc",
              paddingBottom: 20,
            }}
          >
            <S.GridItem span={12}>
              <S.FormGroup>
                <S.Label>Número</S.Label>
                <S.Input
                  hasError={!!errors.twoCards?.card1?.number}
                  {...register("twoCards.card1.number", {
                    onChange: (e) => {
                      const fmt = formatCardNumber(e.target.value);
                      setValue("twoCards.card1.number", fmt);
                      setDuoIssuer1(detectCardIssuer(fmt));
                    },
                  })}
                  onFocus={() => setFocusedField("number")}
                />
                {errors.twoCards?.card1?.number && (
                  <S.ErrorMessage>
                    {errors.twoCards.card1.number.message}
                  </S.ErrorMessage>
                )}
              </S.FormGroup>
            </S.GridItem>
            <S.GridItem span={12}>
              <S.FormGroup>
                <S.Label>Nome</S.Label>
                <S.Input
                  hasError={!!errors.twoCards?.card1?.name}
                  {...register("twoCards.card1.name")}
                  style={{ textTransform: "uppercase" }}
                  onFocus={() => setFocusedField("name")}
                />
                {errors.twoCards?.card1?.name && (
                  <S.ErrorMessage>
                    {errors.twoCards.card1.name.message}
                  </S.ErrorMessage>
                )}
              </S.FormGroup>
            </S.GridItem>
            <S.GridItem span={6}>
              <S.FormGroup>
                <S.Label>Validade</S.Label>
                <S.Input
                  hasError={!!errors.twoCards?.card1?.expiry}
                  {...register("twoCards.card1.expiry", {
                    onChange: (e) =>
                      setValue(
                        "twoCards.card1.expiry",
                        formatExpiry(e.target.value)
                      ),
                  })}
                  onFocus={() => setFocusedField("expiry")}
                />
                {errors.twoCards?.card1?.expiry && (
                  <S.ErrorMessage>
                    {errors.twoCards.card1.expiry.message}
                  </S.ErrorMessage>
                )}
              </S.FormGroup>
            </S.GridItem>
            <S.GridItem span={6}>
              <S.FormGroup>
                <S.Label>CVV</S.Label>
                <S.Input
                  hasError={!!errors.twoCards?.card1?.cvc}
                  {...register("twoCards.card1.cvc", {
                    onChange: (e) =>
                      setValue(
                        "twoCards.card1.cvc",
                        formatCVC(
                          e.target.value,
                          twoCardsValues?.card1?.number || ""
                        )
                      ),
                  })}
                  onFocus={() => setFocusedField("cvc")}
                />
                {errors.twoCards?.card1?.cvc && (
                  <S.ErrorMessage>
                    {errors.twoCards.card1.cvc.message}
                  </S.ErrorMessage>
                )}
              </S.FormGroup>
            </S.GridItem>
          </S.FormGrid>

          <S.SectionTitle>2º Cartão</S.SectionTitle>
          <div style={{ marginBottom: 20 }}>
            <CreditCard
              number={twoCardsValues?.card2?.number || ""}
              name={twoCardsValues?.card2?.name || ""}
              expiry={twoCardsValues?.card2?.expiry || ""}
              focused={focusedField}
              issuer={duoIssuer2}
            />
          </div>
          <S.FormGrid>
            <S.GridItem span={12}>
              <S.FormGroup>
                <S.Label>Número</S.Label>
                <S.Input
                  hasError={!!errors.twoCards?.card2?.number}
                  {...register("twoCards.card2.number", {
                    onChange: (e) => {
                      const fmt = formatCardNumber(e.target.value);
                      setValue("twoCards.card2.number", fmt);
                      setDuoIssuer2(detectCardIssuer(fmt));
                    },
                  })}
                  onFocus={() => setFocusedField("number")}
                />
                {errors.twoCards?.card2?.number && (
                  <S.ErrorMessage>
                    {errors.twoCards.card2.number.message}
                  </S.ErrorMessage>
                )}
              </S.FormGroup>
            </S.GridItem>
            <S.GridItem span={12}>
              <S.FormGroup>
                <S.Label>Nome</S.Label>
                <S.Input
                  hasError={!!errors.twoCards?.card2?.name}
                  {...register("twoCards.card2.name")}
                  style={{ textTransform: "uppercase" }}
                  onFocus={() => setFocusedField("name")}
                />
                {errors.twoCards?.card2?.name && (
                  <S.ErrorMessage>
                    {errors.twoCards.card2.name.message}
                  </S.ErrorMessage>
                )}
              </S.FormGroup>
            </S.GridItem>
            <S.GridItem span={6}>
              <S.FormGroup>
                <S.Label>Validade</S.Label>
                <S.Input
                  hasError={!!errors.twoCards?.card2?.expiry}
                  {...register("twoCards.card2.expiry", {
                    onChange: (e) =>
                      setValue(
                        "twoCards.card2.expiry",
                        formatExpiry(e.target.value)
                      ),
                  })}
                  onFocus={() => setFocusedField("expiry")}
                />
                {errors.twoCards?.card2?.expiry && (
                  <S.ErrorMessage>
                    {errors.twoCards.card2.expiry.message}
                  </S.ErrorMessage>
                )}
              </S.FormGroup>
            </S.GridItem>
            <S.GridItem span={6}>
              <S.FormGroup>
                <S.Label>CVV</S.Label>
                <S.Input
                  hasError={!!errors.twoCards?.card2?.cvc}
                  {...register("twoCards.card2.cvc", {
                    onChange: (e) =>
                      setValue(
                        "twoCards.card2.cvc",
                        formatCVC(
                          e.target.value,
                          twoCardsValues?.card2?.number || ""
                        )
                      ),
                  })}
                  onFocus={() => setFocusedField("cvc")}
                />
                {errors.twoCards?.card2?.cvc && (
                  <S.ErrorMessage>
                    {errors.twoCards.card2.cvc.message}
                  </S.ErrorMessage>
                )}
              </S.FormGroup>
            </S.GridItem>
          </S.FormGrid>
        </S.FadeIn>
      )}

      <S.SubmitButton type="submit" disabled={loading}>
        {loading ? "PROCESSANDO..." : `PAGAR ${formatCurrency(totalAmount)}`}
      </S.SubmitButton>
    </form>
  );
};
