import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useRegionalConfig } from "../../contexts/regional-config-context";
import * as S from "./styles";
import { type GetPromotionalPackageBySlug } from "../../mocks/types";
import { type CheckoutFormData } from "../../schemas/checkout.schema";
import { calculateInstallment } from "../../utils/finance";
import {
  getCouponDiscount,
  normalizeCouponCode,
  resolveCoupon,
} from "../../utils/coupons";
import { PulsatingWrapper } from "../../components/pulsating-wrapper";

interface Props {
  packageData: GetPromotionalPackageBySlug.Response;
}

const Icons = {
  Coupon: () => (
    <svg
      width="18"
      height="18"
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

export const ProductForm: React.FC<Props> = ({ packageData }) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CheckoutFormData>();

  const [searchParams] = useSearchParams();

  const products = packageData.offer?.products ?? [];

  const [couponMessage, setCouponMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const { formatValue } = useRegionalConfig();

  const productQuantities = watch("productQuantities") || {};
  const selectedInstallments = watch("installments") || 1;
  const paymentMethod = watch("paymentMethod") || "credit_card";
  const couponId = watch("coupon_id");
  const couponValue = watch("coupon") || "";
  const maxInstallments = packageData.quantity_parcel || 1;

  const availableInstallments = useMemo(() => {
    if (packageData.installment_limit) {
      return [1, 12].filter((installment) => installment <= maxInstallments);
    }

    return Array.from({ length: maxInstallments }, (_, index) => index + 1);
  }, [packageData.installment_limit, maxInstallments]);

  const fallbackInstallments = availableInstallments[0] || 1;
  const effectiveInstallments =
    paymentMethod === "pix"
      ? 1
      : availableInstallments.includes(selectedInstallments)
        ? selectedInstallments
        : fallbackInstallments;

  const appliedCoupon = useMemo(
    () => resolveCoupon(packageData.coupons, { couponId }),
    [packageData.coupons, couponId],
  );

  useEffect(() => {
    const currentQuantities = productQuantities || {};

    const hasAnySelection = Object.values(currentQuantities).some(
      (qty) => Number(qty) > 0,
    );

    if (!hasAnySelection && products.length > 0) {
      const initialQuantities: Record<string, number> = {};

      products.forEach((prod) => {
        initialQuantities[String(prod.id)] = 1;
      });

      setValue("productQuantities", initialQuantities, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [products, setValue]);

  const totals = useMemo(() => {
    let subtotal = 0;
    let hasItemsSelected = false;

    products.forEach((prod) => {
      const qty = productQuantities[String(prod.id)] || 0;
      if (qty > 0) {
        hasItemsSelected = true;
        subtotal += (prod.financial.value_cash || 0) * qty;
      }
    });

    const discountInfo = getCouponDiscount(subtotal, appliedCoupon);
    const baseAmount = discountInfo.final;

    const isPix = paymentMethod === "pix";

    const { total, installmentValue } = calculateInstallment(
      baseAmount,
      isPix ? 1 : effectiveInstallments,
    );

    return {
      subtotal,
      discountAmount: discountInfo.discount,
      discountPercentage: discountInfo.percent,
      baseAmount,
      finalAmount: total,
      installmentValue,
      hasItemsSelected,
    };
  }, [
    packageData,
    JSON.stringify(productQuantities),
    effectiveInstallments,
    paymentMethod,
    appliedCoupon?.discount_percentage,
    appliedCoupon?.discount_type,
    appliedCoupon?.discount_value,
    appliedCoupon?.id,
  ]);

  const handleIncrement = (productId: number) => {
    const idStr = String(productId);
    const currentQty = productQuantities[idStr] || 0;
    setValue(`productQuantities.${idStr}`, currentQty + 1, {
      shouldValidate: true,
    });
  };

  const handleDecrement = (productId: number) => {
    const idStr = String(productId);
    const currentQty = productQuantities[idStr] || 0;
    if (currentQty > 0) {
      setValue(`productQuantities.${idStr}`, currentQty - 1, {
        shouldValidate: true,
      });
    }
  };

  const installmentOptions = useMemo(() => {
    const options = [];
    if (totals.baseAmount === 0)
      return [{ value: 1, label: "Selecione produtos acima" }];

    for (const i of availableInstallments) {
      const { installmentValue } = calculateInstallment(totals.baseAmount, i);

      options.push({
        value: i,
        label: `${i}x de ${formatValue(installmentValue)} ${
          i === 1 ? "(À vista Crédito)" : "*"
        }`,
      });
    }
    return options;
  }, [availableInstallments, totals.baseAmount, formatValue]);

  useEffect(() => {
    if (!availableInstallments.includes(selectedInstallments)) {
      setValue("installments", fallbackInstallments, {
        shouldValidate: true,
      });
    }
  }, [
    availableInstallments,
    selectedInstallments,
    fallbackInstallments,
    setValue,
  ]);

  const quantitiesError =
    errors.productQuantities?.message || errors.root?.message;
  const isPix = paymentMethod === "pix";
  const showInstallments = totals.hasItemsSelected && !isPix;

  const clearCoupon = useCallback(
    (clearInput: boolean) => {
      setValue("coupon_id", undefined, { shouldDirty: true });
      setValue("discount_percentage", 0, { shouldDirty: true });
      setValue("discount_value", 0, { shouldDirty: true });
      setValue("discount_type", undefined, { shouldDirty: true });
      if (clearInput) {
        setValue("coupon", "", { shouldDirty: true });
      }
    },
    [setValue],
  );

  useEffect(() => {
    if (!appliedCoupon) return;
    const normalizedInput = normalizeCouponCode(couponValue || "");
    const normalizedApplied = normalizeCouponCode(appliedCoupon.code);

    if (!normalizedInput || normalizedInput !== normalizedApplied) {
      clearCoupon(false);
      setCouponMessage(null);
    }
  }, [appliedCoupon, couponValue, clearCoupon]);

  const handleRequestCoupon = () => {
    const normalized = normalizeCouponCode(couponValue);
    if (!normalized) {
      clearCoupon(true);
      setCouponMessage({
        text: "✗ Digite um cupom para validar",
        type: "error",
      });
      return;
    }

    const coupon = resolveCoupon(packageData.coupons, {
      couponCode: normalized,
    });

    if (coupon) {
      const discountInfo = getCouponDiscount(totals.subtotal, coupon);
      const discountLabel =
        discountInfo.type === "value"
          ? `Desconto de ${formatValue(discountInfo.discount)}`
          : `Desconto de ${discountInfo.percent}%`;

      setValue("coupon", coupon.code, { shouldDirty: true });
      setValue("coupon_id", coupon.id, { shouldDirty: true });
      setValue("discount_percentage", discountInfo.percent, {
        shouldDirty: true,
      });
      setValue("discount_value", Number(coupon.discount_value ?? 0), {
        shouldDirty: true,
      });
      setValue("discount_type", Number(coupon.discount_type ?? undefined), {
        shouldDirty: true,
      });
      setCouponMessage({
        text: `✓ Cupom "${coupon.code}" aplicado! ${discountLabel}`,
        type: "success",
      });
    } else {
      clearCoupon(false);
      setCouponMessage({
        text: "✗ Cupom inválido ou não encontrado",
        type: "error",
      });
    }
  };

  const handleRemoveCoupon = () => {
    clearCoupon(true);
    setCouponMessage({ text: "Cupom removido.", type: "success" });
  };

  const [status, setStatus] = useState(false);

  useEffect(() => {
    const couponUrl = searchParams.get("cupom");
    if (!couponUrl) return;

    const normalized = normalizeCouponCode(couponUrl);
    if (!normalized) return;

    const coupon = resolveCoupon(packageData.coupons, {
      couponCode: normalized,
    });

    if (coupon) {
      setValue("coupon", coupon.code, { shouldDirty: true });
      setValue("coupon_id", coupon.id, { shouldDirty: true });
      setValue("discount_percentage", coupon.discount_percentage || 0, {
        shouldDirty: true,
      });
      setValue("discount_value", Number(coupon.discount_value ?? 0), {
        shouldDirty: true,
      });
      setValue("discount_type", Number(coupon.discount_type ?? undefined), {
        shouldDirty: true,
      });
      setCouponMessage({
        text: `✓ Cupom "${coupon.code}" aplicado automaticamente!`,
        type: "success",
      });
      setStatus(true);
    } else {
    }
  }, [searchParams, packageData.coupons ? packageData.coupons.length : 0]);

  return (
    <S.FormGrid>
      <S.GridItem span={12}>
        <S.Label style={{ marginBottom: 12, display: "block" }}>
          Selecione os produtos:
        </S.Label>

        <S.LabelProduct>
          {(packageData.offer?.products ?? []).map((prod) => {
            const userQty = productQuantities[String(prod.id)] || 0;

            const isLowStock = prod.limit !== null && prod.limit <= 3;

            const productContent = (
              <S.ProductSummaryWrapper>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <span
                      className="name"
                      style={{
                        fontSize: "1rem",
                        fontWeight: "bold",
                        color: "#2D4068",
                      }}
                    >
                      📦 {prod.product.name}
                    </span>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "#666",
                        marginTop: "2px",
                      }}
                    >
                      {formatValue(prod.financial.value_cash)} un.
                      {prod.product.id === 1 && prod.financial.quantity && (
                        <span style={{ marginLeft: "8px", fontWeight: "bold" }}>
                          ({prod.financial.quantity} créditos)
                        </span>
                      )}
                    </div>
                  </div>

                  <S.CounterWrapper>
                    <S.CounterButton
                      type="button"
                      onClick={() => handleDecrement(prod.id)}
                      disabled={userQty <= 0}
                    >
                      -
                    </S.CounterButton>
                    <S.CounterValue>{userQty}</S.CounterValue>
                    <S.CounterButton
                      type="button"
                      onClick={() => handleIncrement(prod.id)}
                    >
                      +
                    </S.CounterButton>
                  </S.CounterWrapper>
                </div>

                {userQty > 0 && prod.bonuses.length > 0 && (
                  <div
                    style={{
                      backgroundColor: "#FFFbf0",
                      padding: "8px",
                      borderRadius: "4px",
                      marginTop: "8px",
                      border: "1px dashed #F39C12",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        color: "#D68910",
                        display: "block",
                      }}
                    >
                      INCLUSO NESTA SELEÇÃO:
                    </span>
                    {prod.bonuses.map((bonus) => (
                      <S.BonusSummaryItem
                        key={`bonus-${bonus.id}`}
                        style={{ paddingLeft: 0, marginTop: "2px" }}
                      >
                        <span className="name" style={{ fontSize: "0.85rem" }}>
                          🎁 {bonus.product.name}
                        </span>
                        <span
                          style={{ fontSize: "0.8rem", fontWeight: "bold" }}
                        >
                          {(bonus.financial.quantity || 1) * userQty} un.
                        </span>
                      </S.BonusSummaryItem>
                    ))}
                  </div>
                )}
              </S.ProductSummaryWrapper>
            );

            return isLowStock ? (
              <PulsatingWrapper key={`prod-pulse-${prod.id}`}>
                {productContent}
              </PulsatingWrapper>
            ) : (
              <React.Fragment key={`prod-${prod.id}`}>
                {productContent}
              </React.Fragment>
            );
          })}
        </S.LabelProduct>

        <S.Label
          onClick={() => setStatus((prev) => !prev)}
          style={{
            cursor: "pointer",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            fontSize: 11,
            color: "#2d4a89",
            fontWeight: "bold",
          }}
        >
          <Icons.Coupon />
          {status ? "Fechar Cupom" : "Cupom de Desconto?"}
        </S.Label>
        {status && (
          <S.CouponCard>
            <S.CouponHeader>
              <S.CouponContainer>
                <S.Label htmlFor="coupon">Cupom de Desconto</S.Label>
                <S.CouponHint>
                  Digite o codigo e valide para aplicar no total.
                </S.CouponHint>
              </S.CouponContainer>
              {appliedCoupon && (
                <S.CouponTag>Aplicado: {appliedCoupon.code}</S.CouponTag>
              )}
            </S.CouponHeader>

            <S.CouponInputRow>
              <S.Input
                id="coupon"
                type="text"
                placeholder="Digite o cupom para ganhar desconto"
                readOnly={!!appliedCoupon}
                aria-readonly={!!appliedCoupon}
                style={
                  !!appliedCoupon
                    ? {
                        backgroundColor: "#f0f0f0",
                        color: "#888",
                        cursor: "not-allowed",
                      }
                    : {}
                }
                {...register("coupon")}
              />
              <S.CouponButton
                type="button"
                onClick={handleRequestCoupon}
                disabled={!!appliedCoupon}
              >
                Validar
              </S.CouponButton>
              {appliedCoupon && (
                <S.CouponButton
                  type="button"
                  tone="neutral"
                  onClick={handleRemoveCoupon}
                >
                  Remover
                </S.CouponButton>
              )}
            </S.CouponInputRow>

            {couponMessage && (
              <S.CouponMessage tone={couponMessage.type}>
                {couponMessage.text}
              </S.CouponMessage>
            )}
          </S.CouponCard>
        )}

        {quantitiesError && (
          <S.SmallErrorMessage>
            ⚠️ {String(quantitiesError)}
          </S.SmallErrorMessage>
        )}
      </S.GridItem>

      {showInstallments && (
        <S.GridItem span={12}>
          <S.FormGroup>
            <S.Label htmlFor="installments">
              Parcelamento (Cartão de Crédito)
            </S.Label>
            <S.Select
              id="installments"
              {...register("installments", { valueAsNumber: true })}
            >
              {installmentOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </S.Select>
          </S.FormGroup>
        </S.GridItem>
      )}

      <S.GridItem span={12}>
        <S.PriceContainer>
          {isPix ? (
            <>
              {totals.discountAmount > 0 && (
                <S.PriceRow>
                  <span>Subtotal:</span>
                  <span>{formatValue(totals.subtotal)}</span>
                </S.PriceRow>
              )}
              {totals.discountAmount > 0 && (
                <S.PriceRow>
                  <span>
                    Desconto{appliedCoupon ? ` (${appliedCoupon.code})` : ""}:
                  </span>
                  <span>-{formatValue(totals.discountAmount)}</span>
                </S.PriceRow>
              )}
              <S.PriceRow highlight>
                <span>Total à Vista (Pix):</span>
                <strong>{formatValue(totals.baseAmount)}</strong>
              </S.PriceRow>
            </>
          ) : (
            <>
              {totals.discountAmount > 0 && (
                <S.PriceRow>
                  <span>Subtotal:</span>
                  <span>{formatValue(totals.subtotal)}</span>
                </S.PriceRow>
              )}
              {totals.discountAmount > 0 && (
                <S.PriceRow>
                  <span>
                    Desconto{appliedCoupon ? ` (${appliedCoupon.code})` : ""}:
                  </span>
                  <span>-{formatValue(totals.discountAmount)}</span>
                </S.PriceRow>
              )}
              <S.PriceRow>
                <span>Total no Cartão ({effectiveInstallments}x):</span>
                <strong>{formatValue(totals.finalAmount)}</strong>
              </S.PriceRow>
              {totals.hasItemsSelected && (
                <S.PriceRow highlight>
                  <span>Valor da Parcela:</span>
                  <span>{formatValue(totals.installmentValue)}</span>
                </S.PriceRow>
              )}
            </>
          )}
        </S.PriceContainer>
      </S.GridItem>
    </S.FormGrid>
  );
};
