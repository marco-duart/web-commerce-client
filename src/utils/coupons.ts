export type CouponLike = {
  id: number;
  code: string;
  discount_percentage?: number | null;
  discount_value?: number | null;
  discount_type?: number | null;
};

export const normalizeCouponCode = (code: string) => code.trim().toUpperCase();

export const clampPercentage = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
};

const toSafeNumber = (value: unknown) => {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return numeric;
};

const parseDiscountType = (value: unknown) => {
  const numeric = Number(value);
  if (numeric === 1 || numeric === 2) return numeric;
  return null;
};

const hasValidDiscountType = (coupon: CouponLike) =>
  parseDiscountType(coupon.discount_type) !== null;

export const resolveCoupon = (
  coupons: CouponLike[] | undefined | null,
  options: { couponId?: number; couponCode?: string },
) => {
  if (!coupons || coupons.length === 0) return null;

  if (options.couponId) {
    const byId = coupons.find(
      (coupon) => coupon.id === options.couponId && hasValidDiscountType(coupon),
    );
    if (byId) return byId;
  }

  if (options.couponCode) {
    const normalized = normalizeCouponCode(options.couponCode);
    if (normalized) {
      const byCode = coupons.find(
        (coupon) => normalizeCouponCode(coupon.code) === normalized,
      );
      if (byCode && hasValidDiscountType(byCode)) return byCode;
    }
  }

  return null;
};

export const applyPercentageDiscount = (amount: number, percent: number) => {
  const safePercent = clampPercentage(percent);
  const discount = (amount * safePercent) / 100;
  const final = Math.max(0, amount - discount);

  return {
    percent: safePercent,
    discount,
    final,
  };
};

export type CouponDiscountInfo = {
  type: "percentage" | "value" | "none";
  percent: number;
  value: number;
  discount: number;
  final: number;
};

export const getCouponDiscount = (
  amount: number,
  coupon?: CouponLike | null,
): CouponDiscountInfo => {
  const baseAmount = Number.isFinite(amount) ? Math.max(0, amount) : 0;

  if (!coupon) {
    return {
      type: "none",
      percent: 0,
      value: 0,
      discount: 0,
      final: baseAmount,
    };
  }

  const discountType = parseDiscountType(coupon.discount_type);

  if (discountType === 2) {
    const rawValue = toSafeNumber(coupon.discount_value);
    const safeValue = Math.max(0, rawValue);
    const discount = Math.min(baseAmount, safeValue);
    const percent =
      baseAmount > 0 ? clampPercentage((discount / baseAmount) * 100) : 0;

    return {
      type: "value",
      percent,
      value: safeValue,
      discount,
      final: Math.max(0, baseAmount - discount),
    };
  }

  if (discountType !== 1) {
    return {
      type: "none",
      percent: 0,
      value: 0,
      discount: 0,
      final: baseAmount,
    };
  }

  const percent = clampPercentage(toSafeNumber(coupon.discount_percentage));
  const discount = (baseAmount * percent) / 100;

  return {
    type: "percentage",
    percent,
    value: 0,
    discount,
    final: Math.max(0, baseAmount - discount),
  };
};

export const getCouponEffectivePercent = (
  amount: number,
  coupon?: CouponLike | null,
) => getCouponDiscount(amount, coupon).percent;
