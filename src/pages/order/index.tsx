import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaClock, FaSync } from "react-icons/fa";
import { useGetOrderDetails } from "../../hooks/use-get-order-details";
import { useLocationFromTargetCountry } from "../../hooks/use-location-from-target-country";
import { useRegionalConfig } from "../../contexts/regional-config-context";
import { initializeGTM, pushEvent } from "../../utils/gtm";
import { mapTargetCountryToCountry } from "../../utils/country-mapper";
import { PixPayment } from "../../components/pix-payment";
import { CurrencyWarning } from "../../components/currency-warning";
import { RetryPaymentForm } from "../../components/forms/retry-payment-form";
import * as S from "./styles";
import { LoadingSpinner } from "../../components/loading-spinner";
import { SuccessModal } from "../../components/success-modal";

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
};

export const OrderPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { formatValue, selectedCountry } = useRegionalConfig();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    orderDetails,
    loading,
    refetch,
    renewingPix,
    handleRenewPix,
    handleCheckPixStatus,
    retryingPayment,
    handleRetryCheckout,
    handleRetryDuoCheckout,
    checkingPixStatus,
  } = useGetOrderDetails(orderId);

  useLocationFromTargetCountry(orderDetails?.target_country);

  const currencyMap: Record<string, string> = {
    BR: "BRL",
    USA: "USD",
    PT: "EUR",
  };
  const gtmCurrency = selectedCountry ? currencyMap[selectedCountry] : "BRL";

  const [showRetryForm, setShowRetryForm] = useState(false);

  useEffect(() => {
    if (orderDetails?.gtm_id) {
      initializeGTM(orderDetails.gtm_id);
    }
  }, [orderDetails?.gtm_id]);

  useEffect(() => {
    if (
      orderDetails &&
      orderDetails.gateway_info?.status === "paid" &&
      orderDetails.gtm_id
    ) {
      const storageKey = `gtm_purchase_sent_${orderDetails.order_id}`;

      if (!localStorage.getItem(storageKey)) {
        const items = orderDetails.items.map((item, index) => ({
          item_id: String(item.product_id),
          item_name: item.name,
          price: item.quantity > 0 ? item.total_value / item.quantity : 0,
          quantity: item.quantity,
          item_brand: "Template Commerce",
          item_category: item.is_bonus ? "Bonus" : "Course",
          index: index,
        }));

        pushEvent("purchase", {
          event: "purchase",
          timestamp: new Date().toISOString(),
          package_slug: orderDetails.package_slug || "",
          customer: {
            name: orderDetails.customer.name || "",
            email: orderDetails.customer.email || "",
            phone: orderDetails.customer.phone
              ? orderDetails.customer.phone.replace(/\D/g, "")
              : "",
            city: null,
            state: null,
            country: mapTargetCountryToCountry(orderDetails.target_country),
            document: orderDetails.customer.cpf
              ? orderDetails.customer.cpf.replace(/\D/g, "")
              : "",
          },
          ecommerce: {
            transaction_id: String(orderDetails.order_code),
            value: orderDetails.total_value,
            currency: gtmCurrency,
            tax: 0,
            shipping: 0,
            items: items,
          },
        });

        localStorage.setItem(storageKey, "true");
      }
    }
  }, [orderDetails, gtmCurrency]);

  useEffect(() => {
    if (orderDetails && orderDetails.gateway_info?.status === "paid") {
      setIsModalOpen(true);
    }
  }, [orderDetails?.gateway_info?.status]);

  if (loading || checkingPixStatus) return <LoadingSpinner size="large" />;

  if (!orderDetails) {
    return (
      <S.Container>
        <S.Header>
          <div>Erro</div>
        </S.Header>
        <div style={{ textAlign: "center", padding: 50 }}>
          Pedido não encontrado.
        </div>
      </S.Container>
    );
  }

  const coverImage = orderDetails.cover_image;
  const isPaid = orderDetails.gateway_info?.status === "paid";
  const isOpen = orderDetails.gateway_info?.status === "open";

  const isPixOrder = orderDetails.gateway_info?.payment_type === "pix";
  const isCardOrder = ["credit"].includes(
    orderDetails.gateway_info?.payment_type || "",
  );

  const isPixExpired =
    isPixOrder && orderDetails.pix?.expiration
      ? new Date(orderDetails.pix.expiration) < new Date()
      : false;

  return (
    <S.Container>
      {isModalOpen && orderDetails?.reception_link && orderId && (
        <SuccessModal
          receptionLink={orderDetails.reception_link}
          voucherLink={orderDetails.voucher_link}
          onClose={() => setIsModalOpen(false)}
          orderId={orderId}
        />
      )}

      <S.Header>
        <div>
          <Icons.Lock /> Pedido #{orderDetails.order_code}
        </div>
      </S.Header>

      <S.ContentWrapper>
        <S.ProductColumn>
          <S.ProductCard>
            <S.BannerWrapper>
              {coverImage ? (
                <S.BannerImage src={coverImage} alt="Capa do Pedido" />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(135deg, #1E5A7A 0%, #0EA5A1 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.85)",
                    fontSize: "2rem",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Produto
                </div>
              )}
            </S.BannerWrapper>
          </S.ProductCard>

          <S.CheckoutCard highlight={false}>
            <S.StepHeader>
              <Icons.User />
              <h2>Dados Pessoais</h2>
            </S.StepHeader>
            <S.StepContent>
              <S.InfoGrid>
                <S.GridItem span={12}>
                  <S.InfoGroup>
                    <S.Label>Nome Completo</S.Label>
                    <S.Value>{orderDetails.customer.name}</S.Value>
                  </S.InfoGroup>
                </S.GridItem>
                <S.GridItem span={12}>
                  <S.InfoGroup>
                    <S.Label>Documento</S.Label>
                    <S.Value>{orderDetails.customer.cpf}</S.Value>
                  </S.InfoGroup>
                </S.GridItem>
                <S.GridItem span={12}>
                  <S.InfoGroup>
                    <S.Label>E-mail</S.Label>
                    <S.Value>{orderDetails.customer.email}</S.Value>
                  </S.InfoGroup>
                </S.GridItem>
                <S.GridItem span={12}>
                  <S.InfoGroup>
                    <S.Label>Telefone</S.Label>
                    <S.Value>{orderDetails.customer.phone}</S.Value>
                  </S.InfoGroup>
                </S.GridItem>
              </S.InfoGrid>
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
              <div style={{ display: "flex", flexDirection: "column" }}>
                {orderDetails.items.map((item, index) => (
                  <S.ProductRow key={index} isBonus={item.is_bonus}>
                    <S.ProductName>
                      {item.is_bonus ? "🎁 " : "📦 "}
                      <div>
                        {item.name}{" "}
                        {item.is_bonus && <S.BonusTag>BÔNUS</S.BonusTag>}
                      </div>
                    </S.ProductName>
                    <S.ProductPrice>
                      <strong>{item.quantity} un.</strong>
                    </S.ProductPrice>
                  </S.ProductRow>
                ))}
              </div>
            </S.StepContent>
          </S.CheckoutCard>

          <S.CheckoutCard highlight={true}>
            <S.StepHeader>
              <Icons.CreditCard /> <h2>Status do Pagamento</h2>
            </S.StepHeader>

            <S.StepContent>
              {isPixOrder && orderDetails.pix && !isPaid && (
                <>
                  <CurrencyWarning />
                  {isPixExpired ? (
                    <div style={{ textAlign: "center", padding: "30px 0" }}>
                      <S.StatusBox type="error">
                        <FaTimesCircle />
                        <h3>Código Pix Expirado</h3>
                        <p>
                          O tempo para pagamento expirou. Gere um novo código
                          abaixo.
                        </p>
                      </S.StatusBox>
                      <S.PixRenewButton
                        onClick={handleRenewPix}
                        disabled={renewingPix}
                      >
                        <FaSync className={renewingPix ? "fa-spin" : ""} />
                        {renewingPix ? "Gerando..." : "Gerar Novo Pix"}
                      </S.PixRenewButton>
                    </div>
                  ) : (
                    <PixPayment
                      qrCodeImage={orderDetails.pix.image}
                      qrCodeData={orderDetails.pix.code}
                      expiration={orderDetails.pix.expiration}
                      onRefreshStatus={handleCheckPixStatus}
                    />
                  )}
                </>
              )}

              {isPaid && (
                <S.StatusBox type="success">
                  <FaCheckCircle />
                  <h3>Confirmado! 🎉</h3>
                  <p>
                    Seu pagamento foi confirmado. Em breve você receberá um
                    e-mail com as informações.
                  </p>
                </S.StatusBox>
              )}

              {isCardOrder && isOpen && (
                <>
                  {!showRetryForm ? (
                    <S.StatusBox type="pending">
                      {orderDetails.gateway_info?.status === "open" ? (
                        <FaTimesCircle style={{ color: "#e74c3c" }} />
                      ) : (
                        <FaClock />
                      )}
                      <h3>Pagamento Pendente</h3>
                      <p>Aguardando pagamento.</p>
                      <div
                        style={{ display: "flex", gap: "10px", marginTop: 15 }}
                      >
                        <S.PixRefreshButton onClick={refetch}>
                          Atualizar Status
                        </S.PixRefreshButton>
                        <S.RetryPaymentButton
                          onClick={() => setShowRetryForm(true)}
                        >
                          Tentar Novamente
                        </S.RetryPaymentButton>
                      </div>
                    </S.StatusBox>
                  ) : (
                    <div style={{ marginTop: 20 }}>
                      <S.RetryPaymentTitle>
                        Realizar Pagamento
                      </S.RetryPaymentTitle>
                      <CurrencyWarning />
                      <RetryPaymentForm
                        totalAmount={orderDetails.total_value}
                        loading={retryingPayment}
                        onSubmitSingle={handleRetryCheckout}
                        onSubmitDuo={handleRetryDuoCheckout}
                      />
                      <S.CancelPaymentButton
                        onClick={() => setShowRetryForm(false)}
                        disabled={retryingPayment}
                      >
                        Voltar
                      </S.CancelPaymentButton>
                    </div>
                  )}
                </>
              )}
              <S.PriceSummary>
                <span>{isPaid ? "Total Pago:" : "Total a Pagar:"}</span>
                <strong>{formatValue(orderDetails.total_value)}</strong>
              </S.PriceSummary>
            </S.StepContent>
          </S.CheckoutCard>
        </S.CheckoutColumn>
      </S.ContentWrapper>
    </S.Container>
  );
};
