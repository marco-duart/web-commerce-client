import { useEffect, useState, useCallback, useRef } from "react";
import {
  checkPrototypePixStatus,
  getPrototypeOrderDetails,
  getPrototypeVoucherLink,
  renewPrototypePix,
  retryPrototypeCheckout,
  retryPrototypeDuoCheckout,
} from "../mocks/prototype-data";
import type { GetOrderDetails, RetryCheckout } from "../mocks/types";
import toast from "react-hot-toast";

export type OrderItemUI = GetOrderDetails.Item & {
  image_url?: string;
};

export type OrderDetailsUI = Omit<GetOrderDetails.Response, "items"> & {
  items: OrderItemUI[];
  cover_image?: string | null;
  voucher_link: string | null;
};

interface State {
  orderDetails: OrderDetailsUI | null;
  loading: boolean;
  renewingPix: boolean;
  retryingPayment: boolean;
  checkingPixStatus: boolean;
}

const INITIAL_STATE: State = {
  orderDetails: null,
  loading: true,
  renewingPix: false,
  retryingPayment: false,
  checkingPixStatus: false,
};

export const useGetOrderDetails = (orderId: string | number | undefined) => {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [paymentOrderId, setPaymentOrderId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchOrderDetails = useCallback(async () => {
    if (!orderId) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setState((prev) => ({
      ...prev,
      loading: !prev.orderDetails,
    }));

    try {
      const { success, data, message } = await getPrototypeOrderDetails({
        orderId,
      });

      if (success && data) {
        const enrichedItems: OrderItemUI[] = data.items.map((item) => ({
          ...item,
          image_url: undefined,
        }));

        const finalOrder: OrderDetailsUI = {
          ...data,
          items: enrichedItems,
          voucher_link: getPrototypeVoucherLink(data.order_id),
          cover_image: null,
        };

        if (data.gateway_unavailable) {
          toast.error(
            data.gateway_message ||
              "Nao foi possivel consultar o gateway agora. Atualize a pagina e tente novamente.",
            { id: "gateway-unavailable-order-details" },
          );
        }

        const finalOrderId = finalOrder.gateway_info?.id || null;

        setPaymentOrderId(finalOrderId);
        setState((prev) => ({
          ...prev,
          orderDetails: finalOrder,
          loading: false,
        }));
      } else {
        setState((prev) => ({ ...prev, orderDetails: null, loading: false }));
        toast.error(
          message || "Não foi possível carregar os detalhes do pedido.",
        );
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        setState((prev) => ({ ...prev, orderDetails: null, loading: false }));
        toast.error("Erro ao carregar detalhes do pedido.");
        console.error("fetchOrderDetails error:", error);
      }
    }
  }, [orderId]);

  const handleRenewPix = useCallback(async () => {
    if (!orderId) return;

    setState((prev) => ({ ...prev, renewingPix: true }));

    const { success, message } = await renewPrototypePix(orderId);

    if (success) {
      toast.success(message);
      await fetchOrderDetails();
    } else {
      toast.error(message);
    }

    setState((prev) => ({ ...prev, renewingPix: false }));
  }, [orderId, fetchOrderDetails]);

  const handleRetryCheckout = useCallback(
    async (data: RetryCheckout.SingleRequest["payment"]) => {
      if (!paymentOrderId || !orderId) return;
      setState((prev) => ({ ...prev, retryingPayment: true }));

      const { success, message } = await retryPrototypeCheckout({
        paymentOrderId,
        orderId,
        payment: data,
      });

      if (success) {
        toast.success(message);
        await fetchOrderDetails();
      } else {
        toast.error(message);
      }
      setState((prev) => ({ ...prev, retryingPayment: false }));
    },
    [paymentOrderId, fetchOrderDetails],
  );

  const handleRetryDuoCheckout = useCallback(
    async (payments: RetryCheckout.DuoRequest["payments"]) => {
      if (!paymentOrderId || !orderId) return;
      setState((prev) => ({ ...prev, retryingPayment: true }));

      const { success, message } = await retryPrototypeDuoCheckout({
        paymentOrderId,
        orderId,
        payments,
      });

      if (success) {
        toast.success(message);
        await fetchOrderDetails();
      } else {
        toast.error(message);
      }
      setState((prev) => ({ ...prev, retryingPayment: false }));
    },
    [paymentOrderId, orderId, fetchOrderDetails],
  );

  const handleCheckPixStatus = useCallback(async () => {
    if (!orderId) return;

    setState((prev) => ({ ...prev, checkingPixStatus: true }));

    const { success, message } = await checkPrototypePixStatus(orderId);

    if (success) {
      await fetchOrderDetails();
    } else {
      toast.error(message);
    }

    setState((prev) => ({ ...prev, checkingPixStatus: false }));
  }, [orderId, fetchOrderDetails]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    refetch: fetchOrderDetails,
    handleRenewPix,
    handleRetryCheckout,
    handleRetryDuoCheckout,
    handleCheckPixStatus,
  };
};
