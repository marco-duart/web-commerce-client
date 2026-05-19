export namespace GetPromotionalPackageBySlug {
  export type Request = {
    slug: string;
  };

  export type BonusItem = {
    type: "bonus";
    id: number;
    promotional_product_id: number;
    parent_product_id: number;
    promotional_package_id: number;
    classification: string | null;
    is_courtesy: true;
    financial: {
      value_cash: 0;
      value_parcel: 0;
      quantity: number;
    };
    product: {
      id: number;
      name: string;
      code: string;
      image_url: string | null;
    };
    grade: {
      id: number;
      code: string;
      start_date: string;
      location: string | null;
    } | null;
  };

  export type ProductItem = {
    type: "product";
    id: number;
    promotional_package_id: number;
    promotional_offer_id: number;
    classification: string | null;
    subtitle: string;
    is_courtesy: false;
    limit: number | null;
    financial: {
      value_cash: number;
      value_parcel: number;
      quantity: number;
    };
    product: {
      id: number;
      name: string;
      code: string;
      image_url: string | null;
    };
    grade: {
      id: number;
      code: string;
      start_date: string;
      end_date: string;
      location: string | null;
    } | null;
    bonuses: BonusItem[];
  };

  export type OfferItem = {
    id: number;
    start_at: string;
    end_at: string | null;
    show_validity: boolean;
    products: ProductItem[] | null;
  };

  export type CouponItem = {
    type: "coupon";
    id: number;
    name: string;
    code: string;
    discount_percentage?: number | null;
    discount_value?: number | null;
    discount_type?: number | null;
    description: string;
  };

  export type Response = {
    id: number;
    name: string | null;
    slug: string;
    user_id: number;
    quantity_parcel: number;
    gtm_id: string;
    courtesy: boolean;
    installment_limit: boolean;
    target_country: 0 | 1 | 2;
    offer: OfferItem | null;
    coupons: CouponItem[];
  };

  export type Return =
    | {
        success: true;
        message: string;
        data: Response;
      }
    | {
        success: false;
        message: string;
        data: null;
      };
}

export namespace GetOrderDetails {
  export type Customer = {
    name: string;
    email: string;
    cpf: string;
    phone: string;
    nationality: "Brasileira" | "Estrangeira";
  };

  export type Item = {
    name: string;
    quantity: number;
    is_bonus: boolean;
    product_id: number;
    total_value: number;
  };

  export type Seller = {
    name: string;
    email: string;
  };

  export type InstallmentSummary = {
    date: string;
    amount_cents: number;
    method: string;
  };

  export type TransactionHistory = {
    date: string;
    message: string;
    code: string;
    success: boolean;
    tid?: string;
    flag?: string;
    last4?: string;
  };

  export type PixData = {
    image: string;
    code: string;
    expiration: string;
  };

  export type GatewayStatus = "paid" | "open";

  export type GatewayInfo = {
    id: string;
    status: GatewayStatus;
    amount_cents: number;
    payment_type: "credit" | "pix" | "courtesy";
    seller?: Seller;
    installments: InstallmentSummary[];
    history: TransactionHistory[];
  };

  export type Request = {
    orderId: string | number;
  };

  export type Response = {
    order_id: number;
    order_code: string | number;
    student_id: number;
    created_at: string;
    total_value: number;
    reception_link: string;
    gtm_id: string;
    target_country: 0 | 1 | 2;
    package_slug: string;
    local_status: string;
    customer: Customer;
    items: Item[];
    gateway_info?: GatewayInfo;
    gateway_unavailable?: boolean;
    gateway_message?: string;
    pix?: PixData;
  };

  export type Return = {
    success: boolean;
    message: string;
    data: Response | null;
  };
}

export namespace RetryCheckout {
  export type CardData = {
    name: string;
    number: string;
    expiration_month: string;
    expiration_year: string;
    cvv: string;
    card_type?: string;
  };

  export type SingleRequest = {
    paymentOrderId: string | number;
    orderId: string | number;
    payment: {
      card: CardData;
      installments?: number;
    };
  };

  export type DuoPaymentItem = {
    card: CardData;
    amount: number;
  };

  export type DuoRequest = {
    paymentOrderId: string | number;
    orderId: string | number;
    payments: DuoPaymentItem[];
  };

  export type Response = {
    message: string;
    details?: Record<string, unknown>;
  };

  export type Return =
    | { success: true; message: string; data: Response }
    | { success: false; message: string; data: null };
}

export namespace Checkout {
  export type LegacyCustomer = {
    name: string;
    email01: string;
    nacionality: "1" | "2";
    cpf: string;
    phone: string;
    doc_international?: string;
  };

  export type LegacyCreditCard = {
    card_name: string;
    card_number: string;
    card_date: string;
    card_code: string;
    card_type: string;
  };

  export type LegacyItem = {
    product_id: number;
    id_product: number;
    promotional_package_id: number;
    promotional_offer_id: number;
    user_id: number;
    quantity: number;
    quantity_assessment: number;
    quantity_extra?: number;
    cortesia: "true" | "false";
    classification: string;
    total_value: number;
    total_value_parcel: number;
    turma_id?: number;
    promotional_product_id?: number;
  };

  export type LegacyItemsAttributes = Record<string, LegacyItem>;

  export type LegacyOrder = {
    customer: LegacyCustomer;
    order_items_attributes: LegacyItemsAttributes;
    pay_type: "credit_card" | "two_cards" | "pix" | "courtesy";
    payment_type: "credit" | "pix" | "courtesy";
    installments_amount: number;
    ip_address?: string;
    latitude?: number;
    longitude?: number;
    credit_card?: LegacyCreditCard;
    credit_card_two?: LegacyCreditCard & { amount?: number };
    card_one_amount?: number;
    refer_url: string;
    pg_origem: string;
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    utm_content: string;
    utm_term: string;
    source?: string;
    coupon_id?: number;
  };

  export type Request = {
    utf8: string;
    order: LegacyOrder;
    promotional_package: { slug: string };
  };

  export type Response = {
    success: boolean;
    message: string;
    order_id: number;
  };

  export type Return =
    | { success: boolean; message: string; data: Response }
    | { success: boolean; message: string; data: null };
}
