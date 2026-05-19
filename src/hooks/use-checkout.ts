import { useState } from "react";
import { createPrototypeOrder } from "../mocks/prototype-data";
import { type Checkout, type GetPromotionalPackageBySlug } from "../mocks/types";
import { type CheckoutFormData } from "../schemas/checkout.schema";
import { detectCardIssuer } from "../utils/card-issuer";
import { calculateInstallment } from "../utils/finance";
import toast from "react-hot-toast";
import {
  applyPercentageDiscount,
  getCouponEffectivePercent,
  resolveCoupon,
} from "../utils/coupons";
import type { CouponLike } from "../utils/coupons";

const cleanNumber = (val: string) => val.replace(/\D/g, "");

const formatLegacyExpiry = (expiry: string) => {
  const clean = cleanNumber(expiry);
  if (clean.length === 4) return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
  return expiry;
};

const applyInterestToValue = (
  value: number,
  installments: number,
  isPix: boolean,
) => {
  if (isPix || installments <= 1) return value;
  const { total } = calculateInstallment(value, installments);
  return total;
};

const buildOrderItems = (
  formData: CheckoutFormData,
  packageData: GetPromotionalPackageBySlug.Response,
  appliedCoupon?: CouponLike | null,
): Checkout.LegacyItemsAttributes => {
  const itemsAttributes: Checkout.LegacyItemsAttributes = {};
  let index = 0;
  const isPix = formData.paymentMethod === "pix";
  const installments = isPix ? 1 : formData.installments;
  const offer = packageData.offer;
  const products = offer?.products ?? [];

  if (!offer) return itemsAttributes;

  const productsById = new Map(
    products.map((product) => [product.id, product]),
  );
  const subtotal = Object.entries(formData.productQuantities).reduce(
    (acc, [promotionalProductIdStr, qty]) => {
      if (qty <= 0) return acc;
      const fullProduct = productsById.get(Number(promotionalProductIdStr));
      if (!fullProduct) return acc;
      return acc + (fullProduct.financial.value_cash || 0) * qty;
    },
    0,
  );
  const discountPercent = getCouponEffectivePercent(subtotal, appliedCoupon);

  Object.entries(formData.productQuantities).forEach(
    ([promotionalProductIdStr, qty]) => {
      if (qty > 0) {
        const promProductId = Number(promotionalProductIdStr);
        const fullProduct = productsById.get(promProductId);

        if (fullProduct) {
          const discountedValue = applyPercentageDiscount(
            fullProduct.financial.value_cash,
            discountPercent,
          ).final;
          const unitValueWithInterest = applyInterestToValue(
            discountedValue,
            installments,
            isPix,
          );

          itemsAttributes[String(index)] = {
            product_id: fullProduct.product.id,
            id_product: fullProduct.id,
            promotional_package_id: packageData.id,
            promotional_offer_id: offer.id,
            user_id: packageData.user_id,
            quantity: qty,
            quantity_assessment: fullProduct.financial.quantity || 1,
            cortesia: "false",
            classification: fullProduct.classification || "0",
            total_value: unitValueWithInterest,
            total_value_parcel: unitValueWithInterest,
            turma_id: fullProduct.grade?.id,
          };
          index++;

          if (fullProduct.bonuses && fullProduct.bonuses.length > 0) {
            fullProduct.bonuses.forEach((bonus) => {
              itemsAttributes[String(index)] = {
                product_id: bonus.product.id,
                id_product: fullProduct.id,
                promotional_product_id: fullProduct.id,
                promotional_package_id: packageData.id,
                promotional_offer_id: offer.id,
                user_id: packageData.user_id,
                quantity: (bonus.financial.quantity || 1) * qty,
                quantity_extra: bonus.financial.quantity || 1,
                quantity_assessment: 0,
                cortesia: "true",
                classification: bonus.classification || "1",
                total_value: 0,
                total_value_parcel: 0,
                turma_id: bonus.grade?.id,
              };
              index++;
            });
          }
        }
      }
    },
  );

  return itemsAttributes;
};

const buildLegacyCustomer = (
  formData: CheckoutFormData,
): Checkout.LegacyCustomer => ({
  name: formData.name,
  email01: formData.email,
  nacionality: formData.nationality === "BR" ? "1" : "2",
  cpf: cleanNumber(formData.document),
  phone: `${formData.ddi} ${cleanNumber(formData.phone)}`,
});

const buildCardPayload = (
  cardData: { number: string; name: string; expiry: string; cvc: string },
  amount?: number,
): Checkout.LegacyCreditCard & { amount?: number } => {
  const issuer = detectCardIssuer(cardData.number);
  return {
    card_name: cardData.name,
    card_number: cleanNumber(cardData.number),
    card_date: formatLegacyExpiry(cardData.expiry),
    card_code: cardData.cvc,
    card_type: issuer === "default" ? "mastercard" : issuer,
    ...(amount !== undefined && { amount }),
  };
};

const validateAndBuildCard = (
  card:
    | { number?: string; name?: string; expiry?: string; cvc?: string }
    | undefined,
): { number: string; name: string; expiry: string; cvc: string } | null => {
  if (!card || !card.number || !card.name || !card.expiry || !card.cvc) {
    return null;
  }
  return {
    number: card.number,
    name: card.name,
    expiry: card.expiry,
    cvc: card.cvc,
  };
};

export type CheckoutMetadata = {
  ip_address: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  source?: string | null;
  flow?: "chat" | "cart_recovery" | null;
  coupon_id?: number;
  geolocation?: {
    latitude: number;
    longitude: number;
  } | null;
};

type Payload = {
  utf8: "✓";
  promotional_package: { slug: string };
  order: Checkout.LegacyOrder;
  amount: number;
};

export const useCheckout = () => {
  const [loading, setLoading] = useState(false);

  const submitOrder = async (
    formData: CheckoutFormData,
    packageData: GetPromotionalPackageBySlug.Response,
    totalAmount: number,
    metadata?: CheckoutMetadata,
  ) => {
    setLoading(true);

    try {
      const appliedCoupon = resolveCoupon(packageData.coupons, {
        couponId: formData.coupon_id,
        couponCode: formData.coupon,
      });
      const itemsAttributes = buildOrderItems(
        formData,
        packageData,
        appliedCoupon,
      );

      if (Object.keys(itemsAttributes).length === 0) {
        toast.error("Selecione pelo menos um produto.");
        setLoading(false);
        return;
      }

      const payment_type =
        formData.paymentMethod === "credit_card" ||
        formData.paymentMethod === "two_cards"
          ? "credit"
          : formData.paymentMethod;

      const orderPayload: Checkout.LegacyOrder = {
        customer: buildLegacyCustomer(formData),
        order_items_attributes: itemsAttributes,
        pay_type: formData.paymentMethod,
        payment_type: payment_type,
        installments_amount:
          formData.paymentMethod === "pix" ? 1 : formData.installments,
        ip_address: metadata?.ip_address,
        latitude: metadata?.geolocation?.latitude,
        longitude: metadata?.geolocation?.longitude,
        refer_url: document.referrer || "",
        pg_origem: window.location.href,
        utm_source: metadata?.utm_source || "",
        utm_medium: metadata?.utm_medium || "",
        utm_campaign: metadata?.utm_campaign || "",
        utm_content: metadata?.utm_content || "",
        utm_term: metadata?.utm_term || "",
        ...(appliedCoupon?.id && { coupon_id: appliedCoupon.id }),
        ...(metadata?.source && { source: metadata.source }),
        ...(metadata?.flow && { flow: metadata?.flow }),
      };

      if (formData.paymentMethod === "credit_card" && formData.creditCard) {
        const validCard = validateAndBuildCard(formData.creditCard);
        if (validCard) {
          orderPayload.credit_card = buildCardPayload(validCard);
        }
      } else if (formData.paymentMethod === "two_cards" && formData.twoCards) {
        const validCard1 = validateAndBuildCard(formData.twoCards.card1);
        const validCard2 = validateAndBuildCard(formData.twoCards.card2);

        if (validCard1) {
          orderPayload.credit_card = buildCardPayload(validCard1);
        }

        if (validCard2 && formData.twoCards.amount1) {
          orderPayload.card_one_amount = formData.twoCards.amount1;
          const amount2 = totalAmount - formData.twoCards.amount1;
          orderPayload.credit_card_two = buildCardPayload(validCard2, amount2);
        }
      }

      const payload: Payload = {
        utf8: "✓",
        promotional_package: { slug: packageData.slug },
        order: orderPayload,
        amount: totalAmount,
      };

      const result = await createPrototypeOrder(payload, packageData, totalAmount);

      if (result.data?.order_id) {
        toast.success(result.message || "Pedido realizado com sucesso!");
        return result.data.order_id;
      } else {
        toast.error(result.message || "Erro ao criar pedido.");
      }
    } catch (err) {
      toast.error("Erro inesperado ao processar pedido.");
    } finally {
      setLoading(false);
    }
  };

  return { submitOrder, loading };
};
