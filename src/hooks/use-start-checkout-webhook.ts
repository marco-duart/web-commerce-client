import { useCallback } from "react";
interface StartCheckoutPayload {
  name: string;
  email: string;
  phone: string;
  ddi: string;
  location: string | null | undefined;
  product_name: string;
  cart_value: number;
  checkout_url: string;
  flow: "chat" | "cart_recovery" | null;
}

const DDI_DIGIT_REQUIREMENTS: Record<string, { min: number; max: number }> = {
  "+55": { min: 13, max: 13 },
  "+1": { min: 11, max: 11 },
  "+351": { min: 12, max: 12 },
};

export const useStartCheckoutWebhook = () => {
  const validatePhoneNumber = useCallback(
    (phoneNumber: string, ddi: string): boolean => {
      const cleanPhone = phoneNumber.replace(/\D/g, "");

      const requirements = DDI_DIGIT_REQUIREMENTS[ddi];

      if (!requirements) {
        const hasMinimumDigits = cleanPhone.length >= 9;
        if (!hasMinimumDigits) {
        }
        return hasMinimumDigits;
      }

      const isValid =
        cleanPhone.length >= requirements.min &&
        cleanPhone.length <= requirements.max;
      if (!isValid) {
      }
      return isValid;
    },
    [],
  );

  const sendWebhook = useCallback(
    async (payload: StartCheckoutPayload) => {
      try {
        if (!validatePhoneNumber(payload.phone, payload.ddi)) {
          return false;
        }

        await Promise.resolve({
          ...payload,
          event: "checkout_started",
          timestamp: new Date().toISOString(),
        });

        return true;
      } catch {
        return false;
      }
    },
    [validatePhoneNumber],
  );

  return { sendWebhook, validatePhoneNumber };
};
