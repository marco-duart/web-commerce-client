import type {
  Checkout,
  GetOrderDetails,
  GetPromotionalPackageBySlug,
  RetryCheckout,
} from "./types";

type StoredOrder = {
  data: GetOrderDetails.Response;
  pixChecks: number;
};

const ORDERS_STORAGE_KEY = "prototype_orders_v1";
const ORDER_SEQUENCE_KEY = "prototype_order_sequence";

const wait = async (ms = 350) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

const nowIso = () => new Date().toISOString();

const getFutureIso = (minutes: number) => {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
};

const loadOrders = (): Record<string, StoredOrder> => {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, StoredOrder>;
  } catch {
    return {};
  }
};

const saveOrders = (orders: Record<string, StoredOrder>) => {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
};

const nextOrderId = () => {
  const current = Number(localStorage.getItem(ORDER_SEQUENCE_KEY) || "10000");
  const next = current + 1;
  localStorage.setItem(ORDER_SEQUENCE_KEY, String(next));
  return next;
};

const createBaseProducts = (
  packageId: number,
  offerId: number,
): GetPromotionalPackageBySlug.ProductItem[] => {
  return [
    {
      type: "product",
      id: 501,
      promotional_package_id: packageId,
      promotional_offer_id: offerId,
      classification: "0",
      subtitle: "Trilha principal",
      is_courtesy: false,
      limit: 4,
      financial: {
        value_cash: 397,
        value_parcel: 397,
        quantity: 1,
      },
      product: {
        id: 9001,
        name: "Produto Essencial",
        code: "PROD-ESSENCIAL",
        image_url: null,
      },
      grade: {
        id: 701,
        code: "TURMA-A",
        start_date: getFutureIso(60 * 24 * 14),
        end_date: getFutureIso(60 * 24 * 16),
        location: "Sao Paulo/SP",
      },
      bonuses: [
        {
          type: "bonus",
          id: 951,
          promotional_product_id: 501,
          parent_product_id: 9001,
          promotional_package_id: packageId,
          classification: "1",
          is_courtesy: true,
          financial: {
            value_cash: 0,
            value_parcel: 0,
            quantity: 1,
          },
          product: {
            id: 9101,
            name: "Bônus de Implantacao",
            code: "BONUS-IMPL",
            image_url: null,
          },
          grade: null,
        },
      ],
    },
    {
      type: "product",
      id: 502,
      promotional_package_id: packageId,
      promotional_offer_id: offerId,
      classification: "0",
      subtitle: "Modulo complementar",
      is_courtesy: false,
      limit: 8,
      financial: {
        value_cash: 189,
        value_parcel: 189,
        quantity: 1,
      },
      product: {
        id: 9002,
        name: "Produto Avancado",
        code: "PROD-AVANCADO",
        image_url: null,
      },
      grade: {
        id: 702,
        code: "TURMA-B",
        start_date: getFutureIso(60 * 24 * 21),
        end_date: getFutureIso(60 * 24 * 23),
        location: "Lisboa/PT",
      },
      bonuses: [],
    },
  ];
};

const buildPackageBySlug = (
  slug: string,
): GetPromotionalPackageBySlug.Response => {
  const packageId = 300;
  const offerId = 401;
  const products = createBaseProducts(packageId, offerId);

  const hasCourtesy = slug.includes("courtesy") || slug.includes("cortesia");

  return {
    id: packageId,
    name: "Pacote Modelo",
    slug,
    user_id: 1,
    quantity_parcel: 12,
    gtm_id: "GTM-PROTOTYPE",
    courtesy: hasCourtesy,
    installment_limit: false,
    target_country: 0,
    offer: {
      id: offerId,
      start_at: nowIso(),
      end_at: getFutureIso(60 * 24),
      show_validity: true,
      products,
    },
    coupons: [
      {
        type: "coupon",
        id: 1,
        name: "Cupom Demo",
        code: "DEMO10",
        discount_percentage: 10,
        discount_type: 1,
        description: "Desconto de 10% para demonstracao",
      },
      {
        type: "coupon",
        id: 2,
        name: "Cupom Valor",
        code: "DEMO50",
        discount_value: 50,
        discount_type: 2,
        description: "Desconto fixo de R$ 50",
      },
    ],
  };
};

const toOrderItems = (payload: Checkout.LegacyOrder): GetOrderDetails.Item[] => {
  return Object.values(payload.order_items_attributes).map((item) => ({
    name:
      item.cortesia === "true"
        ? `Bonus do produto ${item.product_id}`
        : `Produto ${item.product_id}`,
    quantity: item.quantity,
    is_bonus: item.cortesia === "true",
    product_id: item.product_id,
    total_value: item.total_value,
  }));
};

const updateOrder = (
  orderId: string | number,
  updater: (stored: StoredOrder) => StoredOrder,
) => {
  const orders = loadOrders();
  const key = String(orderId);
  const current = orders[key];

  if (!current) return null;

  const next = updater(current);
  orders[key] = next;
  saveOrders(orders);

  return next;
};

export const getPrototypePackageBySlug = async (
  payload: GetPromotionalPackageBySlug.Request,
): Promise<GetPromotionalPackageBySlug.Return> => {
  await wait();

  if (!payload.slug) {
    return {
      success: false,
      message: "Pacote nao encontrado.",
      data: null,
    };
  }

  return {
    success: true,
    message: "Pacote carregado em modo prototipo.",
    data: buildPackageBySlug(payload.slug),
  };
};

export const createPrototypeOrder = async (
  payload: Checkout.Request,
  packageData: GetPromotionalPackageBySlug.Response,
  totalAmount: number,
): Promise<Checkout.Return> => {
  await wait();

  const orderId = nextOrderId();
  const paymentType = payload.order.payment_type;
  const isPaid = paymentType === "courtesy";
  const hasPix = paymentType === "pix";

  const orderData: GetOrderDetails.Response = {
    order_id: orderId,
    order_code: `P-${orderId}`,
    student_id: orderId,
    created_at: nowIso(),
    total_value: totalAmount,
    reception_link: "https://prototype.local/acesso",
    gtm_id: packageData.gtm_id,
    target_country: packageData.target_country,
    package_slug: packageData.slug,
    local_status: isPaid ? "paid" : "open",
    customer: {
      name: payload.order.customer.name,
      email: payload.order.customer.email01,
      cpf: payload.order.customer.cpf,
      phone: payload.order.customer.phone,
      nationality:
        payload.order.customer.nacionality === "1" ? "Brasileira" : "Estrangeira",
    },
    items: toOrderItems(payload.order),
    gateway_info: {
      id: `pay_${orderId}`,
      status: isPaid ? "paid" : "open",
      amount_cents: Math.round(totalAmount * 100),
      payment_type: paymentType,
      seller: {
        name: "Equipe de Atendimento",
        email: "contato@prototype.local",
      },
      installments: [
        {
          date: nowIso(),
          amount_cents: Math.round(totalAmount * 100),
          method: paymentType,
        },
      ],
      history: [
        {
          date: nowIso(),
          message: "Pedido criado em modo prototipo.",
          code: "CREATED",
          success: true,
        },
      ],
    },
    pix: hasPix
      ? {
          image:
            "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><rect width='240' height='240' fill='%23f3f3f3'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23222' font-size='18'>PIX MOCK</text></svg>",
          code: `00020126580014BR.GOV.BCB.PIX0114+55119999999990214PIXPROTOTYPE5204000053039865405${totalAmount.toFixed(2)}5802BR5925PROTOTIPO6009SAO PAULO62070503***6304ABCD`,
          expiration: getFutureIso(30),
        }
      : undefined,
  };

  const orders = loadOrders();
  orders[String(orderId)] = { data: orderData, pixChecks: 0 };
  saveOrders(orders);

  return {
    success: true,
    message: "Pedido criado com sucesso (prototipo).",
    data: {
      success: true,
      message: "Pedido criado.",
      order_id: orderId,
    },
  };
};

export const getPrototypeOrderDetails = async (
  payload: GetOrderDetails.Request,
): Promise<GetOrderDetails.Return> => {
  await wait(300);
  const orders = loadOrders();
  const found = orders[String(payload.orderId)];

  if (!found) {
    return {
      success: false,
      message: "Pedido nao encontrado.",
      data: null,
    };
  }

  return {
    success: true,
    message: "Pedido carregado.",
    data: found.data,
  };
};

export const renewPrototypePix = async (orderId: string | number) => {
  await wait(250);

  const updated = updateOrder(orderId, (stored) => {
    if (!stored.data.pix) return stored;

    return {
      ...stored,
      data: {
        ...stored.data,
        gateway_info: stored.data.gateway_info
          ? { ...stored.data.gateway_info, status: "open" }
          : undefined,
        local_status: "open",
        pix: {
          ...stored.data.pix,
          expiration: getFutureIso(30),
        },
      },
    };
  });

  if (!updated) {
    return { success: false as const, message: "Pedido nao encontrado.", data: null };
  }

  return {
    success: true as const,
    message: "Novo codigo PIX gerado (prototipo).",
    data: {
      message: "PIX renovado.",
      pix: updated.data.pix,
    },
  };
};

export const retryPrototypeCheckout = async (
  payload: RetryCheckout.SingleRequest,
): Promise<RetryCheckout.Return> => {
  await wait(300);

  const updated = updateOrder(payload.orderId, (stored) => ({
    ...stored,
    data: {
      ...stored.data,
      local_status: "paid",
      gateway_info: stored.data.gateway_info
        ? {
            ...stored.data.gateway_info,
            status: "paid",
            payment_type: "credit",
            history: [
              ...stored.data.gateway_info.history,
              {
                date: nowIso(),
                message: "Pagamento aprovado apos nova tentativa.",
                code: "RETRY_APPROVED",
                success: true,
                last4: payload.payment.card.number.slice(-4),
              },
            ],
          }
        : undefined,
    },
  }));

  if (!updated) {
    return { success: false, message: "Pedido nao encontrado.", data: null };
  }

  return {
    success: true,
    message: "Pagamento confirmado em modo prototipo.",
    data: { message: "Pagamento aprovado." },
  };
};

export const retryPrototypeDuoCheckout = async (
  payload: RetryCheckout.DuoRequest,
): Promise<RetryCheckout.Return> => {
  await wait(300);

  const updated = updateOrder(payload.orderId, (stored) => ({
    ...stored,
    data: {
      ...stored.data,
      local_status: "paid",
      gateway_info: stored.data.gateway_info
        ? {
            ...stored.data.gateway_info,
            status: "paid",
            payment_type: "credit",
            history: [
              ...stored.data.gateway_info.history,
              {
                date: nowIso(),
                message: "Pagamento aprovado com dois cartoes.",
                code: "DUO_APPROVED",
                success: true,
              },
            ],
          }
        : undefined,
    },
  }));

  if (!updated) {
    return { success: false, message: "Pedido nao encontrado.", data: null };
  }

  return {
    success: true,
    message: "Pagamento em dois cartoes confirmado (prototipo).",
    data: { message: "Pagamento aprovado." },
  };
};

export const checkPrototypePixStatus = async (orderId: string | number) => {
  await wait(250);

  const updated = updateOrder(orderId, (stored) => {
    const checks = stored.pixChecks + 1;
    const shouldMarkAsPaid = checks >= 2;

    if (!stored.data.gateway_info || stored.data.gateway_info.payment_type !== "pix") {
      return { ...stored, pixChecks: checks };
    }

    return {
      ...stored,
      pixChecks: checks,
      data: {
        ...stored.data,
        local_status: shouldMarkAsPaid ? "paid" : "open",
        gateway_info: {
          ...stored.data.gateway_info,
          status: shouldMarkAsPaid ? "paid" : "open",
        },
      },
    };
  });

  if (!updated) {
    return { success: false as const, message: "Pedido nao encontrado.", data: null };
  }

  return {
    success: true as const,
    message:
      updated.data.gateway_info?.status === "paid"
        ? "Pagamento PIX confirmado."
        : "Pagamento PIX ainda pendente.",
    data: {
      status: updated.data.gateway_info?.status || "open",
      paid: updated.data.gateway_info?.status === "paid",
      message: "Status atualizado.",
    },
  };
};

export const getPrototypeVoucherLink = (orderId: string | number) => {
  return `https://prototype.local/voucher/${orderId}`;
};
