import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { useGetPromotionalPackage } from "../../hooks/use-get-promotional-package";
import { useLocationFromTargetCountry } from "../../hooks/use-location-from-target-country";
import { useCheckout, type CheckoutMetadata } from "../../hooks/use-checkout";
import { useRegionalConfig } from "../../contexts/regional-config-context";
import { mapTargetCountryToCountry } from "../../utils/country-mapper";
import { initializeGTM, pushEvent } from "../../utils/gtm";
import { useStartCheckoutWebhook } from "../../hooks/use-start-checkout-webhook";
import { ClientForm } from "../../components/forms/client-form";
import { ProductForm } from "../../components/forms/product-form";
import { ProductCourtesyForm } from "../../components/forms/product-courtesy-form";
import { calculateInstallment } from "../../utils/finance";
import { PaymentForm } from "../../components/forms/payment-form";
import { CourtesyPaymentForm } from "../../components/forms/courtesy-payment-form";
import { CurrencyWarning } from "../../components/currency-warning";
import {
  getCheckoutResolverSafe,
  type CheckoutFormDataUnion,
} from "../../utils/checkout-resolvers";
import * as S from "./styles";
import { LoadingSpinner } from "../../components/loading-spinner";
import toast from "react-hot-toast";
import { TermsModal } from "../../components/terms-modal";
import { ProcessingScreen } from "../../components/processing-screen";
import { format, parseISO } from "date-fns";
import {
  OfferUnavailable,
  UNAVAILABLE_OFFER_MESSAGES,
} from "../../components/offer-unavailable";
import { OfferValidityBanner } from "../../components/offer-validity-banner";
import {
  applyPercentageDiscount,
  getCouponDiscount,
  getCouponEffectivePercent,
  resolveCoupon,
} from "../../utils/coupons";

const Icons = {
  Lock: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  ),
  Gift: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 12 20 22 4 22 4 12"></polyline>
      <rect x="2" y="7" width="20" height="5"></rect>
      <line x1="12" y1="22" x2="12" y2="7"></line>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
    </svg>
  ),
  Box: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  ),
  CreditCard: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
      <line x1="1" y1="10" x2="23" y2="10"></line>
    </svg>
  ),
  User: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  Cart: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
  ),
};

const formatGradeDate = (date?: string | null) => {
  if (!date) return "";

  try {
    const parsed = parseISO(date);
    return format(parsed, "dd/MM/yyyy");
  } catch {
    return date;
  }
};

const parseCityState = (location?: string | null) => {
  if (!location) return { city: null, state: null };

  const [cityRaw, stateRaw] = location.split("/");
  const city = cityRaw?.trim() || null;
  const state = stateRaw?.trim() || null;

  return { city, state };
};

const getDDIMinDigits = (ddiValue: string): number => {
  const ddiMap: Record<string, number> = {
    "+55": 11,
    "+1": 10,
    "+351": 9,
  };
  return ddiMap[ddiValue] || 9;
};

const formatRemainingTime = (remainingMs: number) => {
  if (remainingMs <= 0) return "Oferta encerrando agora";

  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  if (days > 0) return `${days}d ${hh}h ${mm}m ${ss}s`;
  return `${hh}:${mm}:${ss}`;
};

export const PromotionalPackagePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    promotionalPackage,
    loading,
    stock: shouldShowStockWarningBanner,
  } = useGetPromotionalPackage(slug || "");
  const { submitOrder, loading: processingPayment } = useCheckout();
  const { sendWebhook } = useStartCheckoutWebhook();
  const { formatValue } = useRegionalConfig();

  useLocationFromTargetCountry(promotionalPackage?.target_country);

  const [isContractAccepted, setIsContractAccepted] = useState(true);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [personalDataFilled, setPersonalDataFilled] = useState(false);
  const [offerRemainingMs, setOfferRemainingMs] = useState<number | null>(null);
  const [lastPaymentMethodTracked, setLastPaymentMethodTracked] = useState<
    string | null
  >(null);
  const [lastPhoneNumberTracked, setLastPhoneNumberTracked] = useState<
    string | null
  >(null);
  const [userMetadata, setUserMetadata] = useState<CheckoutMetadata>({
    ip_address: "",
    utm_source: searchParams.get("utm_source"),
    utm_medium: searchParams.get("utm_medium"),
    utm_campaign: searchParams.get("utm_campaign"),
    utm_content: searchParams.get("utm_content"),
    utm_term: searchParams.get("utm_term"),
    source: searchParams.get("source"),
    flow: (searchParams.get("flow") as "chat" | "cart_recovery") || null,
    coupon_id: searchParams.get("coupon_id")
      ? Number(searchParams.get("coupon_id"))
      : undefined,
  });
  const products = promotionalPackage?.offer?.products ?? [];
  const activeOffer = promotionalPackage?.offer;

  useEffect(() => {
    if (promotionalPackage?.gtm_id) {
      initializeGTM(promotionalPackage.gtm_id);
    }
  }, [promotionalPackage?.gtm_id]);

  useEffect(() => {
    if (!activeOffer?.show_validity || !activeOffer.end_at) {
      setOfferRemainingMs(null);
      return;
    }

    const endTimestamp = new Date(activeOffer.end_at).getTime();

    if (Number.isNaN(endTimestamp)) {
      setOfferRemainingMs(null);
      return;
    }

    const tick = () => {
      const remaining = endTimestamp - Date.now();
      setOfferRemainingMs(remaining > 0 ? remaining : 0);
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [activeOffer?.show_validity, activeOffer?.end_at]);

  const shouldShowValidityBanner =
    !!activeOffer?.show_validity &&
    !!activeOffer?.end_at &&
    offerRemainingMs !== null;

  const validityText = shouldShowValidityBanner
    ? formatRemainingTime(offerRemainingMs)
    : "";

  useEffect(() => {
    if (
      offerRemainingMs === 0 &&
      !processingPayment &&
      shouldShowValidityBanner
    ) {
      const timeoutId = setTimeout(() => {
        window.location.reload();
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [offerRemainingMs, processingPayment, shouldShowValidityBanner]);

  const country = useMemo(
    () =>
      promotionalPackage?.target_country !== undefined
        ? mapTargetCountryToCountry(promotionalPackage.target_country)
        : "BR",
    [promotionalPackage?.target_country],
  );

  const packageLocation = useMemo(() => {
    if (!promotionalPackage) return { city: null, state: null };

    const location = products.find((product) => !!product.grade?.location)
      ?.grade?.location;

    return parseCityState(location);
  }, [promotionalPackage, products]);

  const methods = useForm<CheckoutFormDataUnion>({
    resolver: getCheckoutResolverSafe(country),
    defaultValues: {
      nationality: undefined,
      ddi: country === "BR" ? "+55" : country === "USA" ? "+1" : "+351",
      productQuantities: {},
      installments: 1,
      paymentMethod: "credit_card",
      creditCard: { number: "", name: "", expiry: "", cvc: "" },
      twoCards: {
        amount1: 0,
        card1: { number: "", name: "", expiry: "", cvc: "" },
        card2: { number: "", name: "", expiry: "", cvc: "" },
      },
      document: "",
      name: "",
      email: "",
      phone: "",
    },
    mode: "onChange",
  });

  // ERROS NO FORM?
  // useEffect(() => {
  //   console.log('Form Errors:', methods.formState.errors);
  // }, [methods.formState.errors]);

  useEffect(() => {
    if (promotionalPackage?.target_country !== undefined) {
      const mappedCountry = mapTargetCountryToCountry(
        promotionalPackage.target_country,
      );

      const ddiMap: Record<string, "+55" | "+1" | "+351"> = {
        BR: "+55",
        USA: "+1",
        PT: "+351",
      };

      methods.setValue("nationality", mappedCountry);
      methods.setValue("ddi", ddiMap[mappedCountry]);
    }
  }, [promotionalPackage?.target_country, methods]);

  const allValues = methods.watch();
  const productQuantities = methods.watch("productQuantities");
  const paymentMethod = methods.watch("paymentMethod");
  const installments = methods.watch("installments");
  const couponId = methods.watch("coupon_id");
  const couponCode = methods.watch("coupon");

  const appliedCoupon = useMemo(
    () =>
      resolveCoupon(promotionalPackage?.coupons, {
        couponId,
        couponCode,
      }),
    [promotionalPackage?.coupons, couponId, couponCode],
  );

  const { totalAmount } = useMemo(() => {
    if (!promotionalPackage) return { totalAmount: 0 };

    const valueProduct = products.reduce((acc, prod) => {
      const qty = productQuantities[String(prod.id)] || 0;
      return acc + (prod.financial.value_cash || 0) * qty;
    }, 0);

    const discountInfo = getCouponDiscount(valueProduct, appliedCoupon);
    const baseAmount = discountInfo.final;
    const isPix = paymentMethod === "pix";
    const isCourtesy = paymentMethod === "courtesy";
    const { total } = calculateInstallment(
      baseAmount,
      isPix || isCourtesy ? 1 : installments,
    );

    return { totalAmount: total };
  }, [
    promotionalPackage,
    allValues,
    paymentMethod,
    installments,
    appliedCoupon?.discount_percentage,
    appliedCoupon?.discount_type,
    appliedCoupon?.discount_value,
    appliedCoupon?.id,
  ]);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) =>
        setUserMetadata((prev) => ({ ...prev, ip_address: data.ip })),
      )
      .catch((err) => console.error("Erro ao obter IP", err));

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserMetadata((prev) => ({
            ...prev,
            geolocation: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          }));
        },
        (error) => console.warn("Geolocalização não permitida", error),
      );
    }
  }, []);

  useEffect(() => {
    if (promotionalPackage) {
      const items = products.map((p, index) => ({
        item_id: String(p.id),
        item_name: p.product.name,
        price: p.financial.value_cash,
        quantity: 1,
        item_brand: "Template Commerce",
        item_category: "Promotional Package",
        item_category2: slug,
        index: index,
      }));

      const totalValue = items.reduce(
        (acc, item) => acc + (item.price || 0),
        0,
      );

      pushEvent("begin_checkout", {
        event: "begin_checkout",
        timestamp: new Date().toISOString(),
        page_type: "checkout",
        package_slug: slug,
        customer: {
          city: packageLocation.city,
          state: packageLocation.state,
          country: country,
        },
        ecommerce: {
          currency: "BRL",
          value: totalValue,
          tax: 0,
          shipping: 0,
          items: items,
        },
      });
    }
  }, [promotionalPackage, slug, country, packageLocation]);

  const trackAddPaymentInfo = useCallback(
    (method: "credit_card" | "two_cards" | "pix" | "courtesy") => {
      if (!promotionalPackage) return;

      const { name, email, document, phone, ddi } = methods.getValues();

      const minPhoneDigits = getDDIMinDigits(ddi);
      const cleanPhone = phone ? phone.replace(/\D/g, "") : "";

      if (!cleanPhone || cleanPhone.length < minPhoneDigits) return;

      const formattedPhone = ddi && phone ? `${ddi}${phone}` : "";

      const selectedProductIds = Object.keys(productQuantities).filter(
        (id) => productQuantities[id] > 0,
      );
      if (selectedProductIds.length === 0) return;

      const paymentTypeMap: Record<string, string> = {
        credit_card: "Credit Card",
        two_cards: "Two Credit Cards",
        pix: "Pix",
        courtesy: "Courtesy",
      };

      const isPix = method === "pix";

      const subtotal = products.reduce((acc, product) => {
        const qty = productQuantities[String(product.id)] || 0;
        return acc + (product.financial.value_cash || 0) * qty;
      }, 0);

      const discountPercent = getCouponEffectivePercent(
        subtotal,
        appliedCoupon,
      );

      const items = products
        .filter((p) => (productQuantities[String(p.id)] || 0) > 0)
        .map((p, index) => {
          const qty = productQuantities[String(p.id)];
          const discountedValue = applyPercentageDiscount(
            p.financial.value_cash,
            discountPercent,
          ).final;
          const { total: priceWithInterest } = calculateInstallment(
            discountedValue,
            isPix ? 1 : installments,
          );

          return {
            item_id: String(p.id),
            item_name: p.product.name,
            price: priceWithInterest,
            item_brand: "Template Commerce",
            item_category: "Promotional Package",
            item_category2: slug,
            quantity: qty,
            index: index,
          };
        });

      const selectedLocation = products.find(
        (p) =>
          (productQuantities[String(p.id)] || 0) > 0 && !!p.grade?.location,
      )?.grade?.location;

      const { city, state } = parseCityState(selectedLocation);

      pushEvent("add_payment_info", {
        event: "add_payment_info",
        timestamp: new Date().toISOString(),
        package_slug: slug,
        customer: {
          name: name || "",
          email: email || "",
          phone: formattedPhone.replace(/\D/g, ""),
          city: city,
          state: state,
          country: country,
          document: document ? document.replace(/\D/g, "") : "",
        },
        ecommerce: {
          currency: "BRL",
          value: totalAmount,
          tax: 0,
          shipping: 0,
          payment_type: paymentTypeMap[method] || "Other",
          items: items,
        },
      });
    },
    [
      promotionalPackage,
      productQuantities,
      installments,
      slug,
      totalAmount,
      appliedCoupon?.discount_percentage,
      appliedCoupon?.discount_type,
      appliedCoupon?.discount_value,
      appliedCoupon?.id,
      methods,
      country,
    ],
  );

  useEffect(() => {
    const name = allValues.name;
    const email = allValues.email;
    const document = allValues.document;
    const phone = allValues.phone;
    const ddi = allValues.ddi;

    const minPhoneDigits = getDDIMinDigits(ddi);
    const isFormFilled = !!(
      name &&
      name.trim().length >= 3 &&
      email &&
      email.includes("@") &&
      document &&
      document.replace(/\D/g, "").length >= 9 &&
      phone &&
      phone.replace(/\D/g, "").length >= minPhoneDigits &&
      ddi
    );

    if (isFormFilled && !personalDataFilled) {
      setPersonalDataFilled(true);
      setLastPaymentMethodTracked(paymentMethod);

      if (promotionalPackage && paymentMethod) {
        trackAddPaymentInfo(
          paymentMethod as "credit_card" | "two_cards" | "pix" | "courtesy",
        );
      }
    }

    if (isFormFilled && promotionalPackage) {
      const currentPhoneNumber = `${allValues.ddi}${allValues.phone}`;

      if (currentPhoneNumber !== lastPhoneNumberTracked) {
        const selectedProducts = products.filter(
          (p) => (productQuantities[String(p.id)] || 0) > 0,
        );

        if (selectedProducts.length > 0) {
          selectedProducts.forEach((product) => {
            sendWebhook({
              name: allValues.name,
              email: allValues.email,
              phone: currentPhoneNumber,
              ddi: allValues.ddi,
              location: product.grade?.location,
              product_name: product.product.name,
              cart_value: totalAmount,
              checkout_url: window.location.href,
              flow: userMetadata.flow || null,
            });
          });

          setLastPhoneNumberTracked(currentPhoneNumber);
        }
      }
    }

    if (
      isFormFilled &&
      personalDataFilled &&
      paymentMethod !== lastPaymentMethodTracked
    ) {
      setLastPaymentMethodTracked(paymentMethod);

      if (promotionalPackage && paymentMethod) {
        trackAddPaymentInfo(
          paymentMethod as "credit_card" | "two_cards" | "pix" | "courtesy",
        );
      }
    }

    if (!isFormFilled && personalDataFilled) {
      setPersonalDataFilled(false);
      setLastPaymentMethodTracked(null);
      setLastPhoneNumberTracked(null);
    }
  }, [
    allValues,
    personalDataFilled,
    promotionalPackage,
    paymentMethod,
    lastPaymentMethodTracked,
    lastPhoneNumberTracked,
    trackAddPaymentInfo,
    sendWebhook,
    productQuantities,
  ]);

  useEffect(() => {
    if (promotionalPackage?.courtesy) {
      methods.setValue("paymentMethod", "courtesy");
    }
  }, [promotionalPackage, methods]);

  const onSubmit = async (data: CheckoutFormDataUnion) => {
    if (!slug || !promotionalPackage) return;
    if (!isContractAccepted) {
      toast.error("Você precisa aceitar os termos do contrato para continuar.");
      return;
    }

    const orderId = await submitOrder(
      data,
      promotionalPackage,
      totalAmount,
      userMetadata,
    );

    if (orderId) {
      navigate(`/order/${orderId}`);
    }
  };

  if (loading) return <LoadingSpinner size="large" />;
  if (processingPayment) {
    return (
      <ProcessingScreen
        message={promotionalPackage?.courtesy ? "Processando..." : undefined}
      />
    );
  }
  if (!promotionalPackage) {
    return (
      <S.Container>
        <div style={{ textAlign: "center", padding: "50px" }}>
          Pacote não encontrado.
        </div>
      </S.Container>
    );
  }

  const haveNoActiveOffer = !promotionalPackage.offer;
  const haveNoProducts =
    haveNoActiveOffer ||
    !promotionalPackage.offer?.products ||
    promotionalPackage.offer.products.length === 0;

  if (haveNoActiveOffer) {
    return (
      <OfferUnavailable banner={promotionalPackage.cover_image ?? undefined} />
    );
  }

  if (haveNoProducts) {
    return (
      <OfferUnavailable
        message={UNAVAILABLE_OFFER_MESSAGES.closed}
        banner={promotionalPackage.cover_image ?? undefined}
      />
    );
  }
  const isPix = paymentMethod === "pix";

  return (
    <S.Container>
      <S.Header>
        <div>
          <Icons.Lock /> Checkout Seguro
        </div>
      </S.Header>

      {shouldShowValidityBanner && (
        <OfferValidityBanner validityText={validityText} />
      )}

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <S.ContentWrapper>
            <S.ProductColumn>
              <S.ProductCard>
                <S.BannerWrapper hasImage={!!promotionalPackage.cover_image}>
                  {promotionalPackage.cover_image && (
                    <S.BannerImage
                      src={promotionalPackage.cover_image}
                      alt={`Capa do pacote ${promotionalPackage.name}`}
                    />
                  )}
                </S.BannerWrapper>
                <S.ProductInfo>
                  <h1>Pacote Demonstrativo</h1>
                  <p>
                    Fluxo de compra em modo prototipo para simulacao completa
                    da jornada de checkout.
                  </p>
                  <S.ItemList>
                    {products.map((prod) => (
                      <React.Fragment key={`prod-group-${prod.id}`}>
                        <S.ItemRow isBonus={false}>
                          <S.ItemName>
                            <S.IconWrapper css={{ color: "$primary" }}>
                              <Icons.Box />
                            </S.IconWrapper>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <span>{prod.product.name}</span>
                              {prod.product.id === 1 &&
                                prod.financial.quantity && (
                                  <span
                                    style={{ fontSize: "0.85em", opacity: 0.7 }}
                                  >
                                    {prod.financial.quantity} créditos
                                  </span>
                                )}
                              {prod.grade && prod.product.id !== 1 && (
                                <span
                                  style={{ fontSize: "0.85em", opacity: 0.7 }}
                                >
                                  Turma: {prod.grade.code}
                                </span>
                              )}

                              {prod.grade && prod.product.id !== 1 && (
                                <span
                                  style={{ fontSize: "0.85em", opacity: 0.7 }}
                                >
                                  <strong>{prod.grade.location}</strong> -{" "}
                                  {formatGradeDate(prod.grade.start_date)} -{" "}
                                  {formatGradeDate(prod.grade.end_date)}
                                </span>
                              )}
                            </div>
                          </S.ItemName>
                          <S.ItemTag type="product">Produto</S.ItemTag>
                        </S.ItemRow>
                        {prod.bonuses.map((bonus) => (
                          <S.ItemRow
                            key={`bonus-${bonus.id}`}
                            isBonus={true}
                            style={{
                              marginLeft: "16px",
                              borderLeft: "3px solid #F39C12",
                            }}
                          >
                            <S.ItemName>
                              <S.IconWrapper css={{ color: "$warning" }}>
                                <Icons.Gift />
                              </S.IconWrapper>
                              <span>{bonus.product.name}</span>
                            </S.ItemName>
                            <S.ItemTag type="bonus">Bonus</S.ItemTag>
                          </S.ItemRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </S.ItemList>
                </S.ProductInfo>
              </S.ProductCard>

              <S.CheckoutCard highlight={false}>
                <S.StepHeader>
                  <Icons.User />
                  <h2>Dados Pessoais</h2>
                </S.StepHeader>
                <S.StepContent>
                  <ClientForm />
                </S.StepContent>
              </S.CheckoutCard>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "10px",
                  justifyContent: "center",
                  opacity: 0.6,
                }}
              >
                <div
                  style={{
                    width: 62,
                    height: 40,
                    border: "1px solid #A8B7C8",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    color: "#23415F",
                    background: "#EEF5FB",
                  }}
                >
                  Logo
                </div>
                <div
                  style={{
                    width: 62,
                    height: 40,
                    border: "1px solid #A8B7C8",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    color: "#23415F",
                    background: "#EEF5FB",
                  }}
                >
                  Logo
                </div>
              </div>
            </S.ProductColumn>

            <S.CheckoutColumn>
              <S.CheckoutCard highlight={false}>
                <S.StepHeader>
                  <Icons.Cart />
                  <h2>Detalhes do Pedido</h2>
                </S.StepHeader>
                <S.StepContent>
                  {promotionalPackage?.courtesy ? (
                    <ProductCourtesyForm packageData={promotionalPackage} />
                  ) : (
                    <ProductForm packageData={promotionalPackage} />
                  )}
                </S.StepContent>
              </S.CheckoutCard>

              <S.CheckoutCard highlight={true}>
                {promotionalPackage?.courtesy ? (
                  <>
                    <S.StepHeader>
                      <Icons.Gift />
                      <h2>Conclusão do Pedido</h2>
                    </S.StepHeader>
                    <CourtesyPaymentForm />
                    <CurrencyWarning />
                    <S.PriceSummary>
                      <span>Total a pagar:</span>
                      <strong>{formatValue(totalAmount)}</strong>
                    </S.PriceSummary>
                    <S.TermsWrapper>
                      <S.TermsLabel>
                        <input
                          type="checkbox"
                          checked={isContractAccepted}
                          onChange={(e) =>
                            setIsContractAccepted(e.target.checked)
                          }
                        />
                        <span>
                          Li e concordo com os{" "}
                          <b
                            onClick={(e) => {
                              e.preventDefault();
                              setIsTermsModalOpen(true);
                            }}
                          >
                            termos do contrato de prestação de serviços
                          </b>
                          .
                        </span>
                      </S.TermsLabel>
                    </S.TermsWrapper>
                    <S.SubmitButton
                      type="submit"
                      disabled={processingPayment || !isContractAccepted}
                    >
                      Concluir Pedido
                    </S.SubmitButton>
                  </>
                ) : (
                  <>
                    <S.StepHeader>
                      <Icons.CreditCard />
                      <h2>Dados do Pagamento</h2>
                    </S.StepHeader>
                    <PaymentForm
                      totalAmount={totalAmount}
                      onMethodChange={trackAddPaymentInfo}
                    />
                    <CurrencyWarning />
                    <S.PriceSummary>
                      <span>Total a pagar:</span>
                      <strong>{formatValue(totalAmount)}</strong>
                    </S.PriceSummary>
                    <S.TermsWrapper>
                      <S.TermsLabel>
                        <input
                          type="checkbox"
                          checked={isContractAccepted}
                          onChange={(e) =>
                            setIsContractAccepted(e.target.checked)
                          }
                        />
                        <span>
                          Li e concordo com os{" "}
                          <b
                            onClick={(e) => {
                              e.preventDefault();
                              setIsTermsModalOpen(true);
                            }}
                          >
                            termos do contrato de prestação de serviços
                          </b>
                          .
                        </span>
                      </S.TermsLabel>

                      {!isPix && (
                        <S.InstallmentDisclaimer>
                          *Simulacao de parcelamento com acrescimo ilustrativo.
                        </S.InstallmentDisclaimer>
                      )}
                    </S.TermsWrapper>
                    <S.SubmitButton
                      type="submit"
                      disabled={processingPayment || !isContractAccepted}
                    >
                      {processingPayment
                        ? "PROCESSANDO..."
                        : paymentMethod === "pix"
                          ? "GERAR PIX"
                          : "FINALIZAR"}
                    </S.SubmitButton>
                  </>
                )}
              </S.CheckoutCard>
            </S.CheckoutColumn>
          </S.ContentWrapper>
        </form>
      </FormProvider>

      {isTermsModalOpen && (
        <TermsModal onClose={() => setIsTermsModalOpen(false)} />
      )}
    </S.Container>
  );
};
