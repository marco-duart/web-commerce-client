import { z } from "zod";
import {
  brClientFormSchema,
  usaClientFormSchema,
  ptClientFormSchema,
  dynamicClientFormSchema,
  getClientFormSchema,
} from "./client-form.schema";
import { productFormSchema } from "./product-form.schema";
import {
  paymentMethodSchema,
  creditCardSchema,
  twoCardsSchema,
} from "./payment-form.schema";
import type { Country } from "../contexts/regional-config-context.types";

const paymentValidationSchema = z.object({
  paymentMethod: paymentMethodSchema,
  creditCard: z
    .object({
      number: z.string().optional().or(z.literal("")),
      name: z.string().optional().or(z.literal("")),
      expiry: z.string().optional().or(z.literal("")),
      cvc: z.string().optional().or(z.literal("")),
    })
    .optional(),
  twoCards: z
    .object({
      amount1: z.number().optional(),
      card1: z
        .object({
          number: z.string().optional().or(z.literal("")),
          name: z.string().optional().or(z.literal("")),
          expiry: z.string().optional().or(z.literal("")),
          cvc: z.string().optional().or(z.literal("")),
        })
        .optional(),
      card2: z
        .object({
          number: z.string().optional().or(z.literal("")),
          name: z.string().optional().or(z.literal("")),
          expiry: z.string().optional().or(z.literal("")),
          cvc: z.string().optional().or(z.literal("")),
        })
        .optional(),
    })
    .optional(),
});

const createCheckoutSchema = (clientSchema: z.ZodSchema, country: Country) => {
  const mergedValidationSchema = z.lazy(() =>
    clientSchema.and(paymentValidationSchema).and(productFormSchema),
  );

  return mergedValidationSchema.superRefine((data, ctx) => {
    const isCourtesy = data.paymentMethod === "courtesy";
    const isNonBRLCurrency = country !== "BR";
    const canSkipDocument = isCourtesy && isNonBRLCurrency;
    const hasDocument = !!data.document?.replace(/\D/g, "");

    if (!canSkipDocument && !hasDocument) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["document"],
        message: "Documento é obrigatório",
      });
    }

    if (data.paymentMethod === "credit_card") {
      const result = creditCardSchema.safeParse(data.creditCard);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          ctx.addIssue({ ...issue, path: ["creditCard", ...issue.path] });
        });
      }
    }

    if (data.paymentMethod === "two_cards") {
      const result = twoCardsSchema.safeParse(data.twoCards);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          ctx.addIssue({ ...issue, path: ["twoCards", ...issue.path] });
        });
      }
    }
  });
};

export const usaCheckoutSchema = createCheckoutSchema(usaClientFormSchema, "USA");
export const ptCheckoutSchema = createCheckoutSchema(ptClientFormSchema, "PT");

export const brCheckoutSchema = createCheckoutSchema(brClientFormSchema, "BR");

export const dynamicCheckoutSchema = z
  .lazy(() =>
    dynamicClientFormSchema.and(paymentValidationSchema).and(productFormSchema),
  )
  .superRefine((data, ctx) => {
    const isCourtesy = data.paymentMethod === "courtesy";
    const isNonBRLCurrency = data.nationality !== "BR";
    const canSkipDocument = isCourtesy && isNonBRLCurrency;
    const hasDocument = !!data.document?.replace(/\D/g, "");

    if (!canSkipDocument && !hasDocument) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["document"],
        message: "Documento é obrigatório",
      });
    }

    if (data.paymentMethod === "credit_card") {
      const result = creditCardSchema.safeParse(data.creditCard);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          ctx.addIssue({ ...issue, path: ["creditCard", ...issue.path] });
        });
      }
    }

    if (data.paymentMethod === "two_cards") {
      const result = twoCardsSchema.safeParse(data.twoCards);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          ctx.addIssue({ ...issue, path: ["twoCards", ...issue.path] });
        });
      }
    }
  });

export const getCheckoutSchema = (country: Country) => {
  const clientSchema = getClientFormSchema(country);
  return createCheckoutSchema(clientSchema, country);
};

export type BRCheckoutFormData = z.infer<typeof brCheckoutSchema>;
export type USACheckoutFormData = z.infer<typeof usaCheckoutSchema>;
export type PTCheckoutFormData = z.infer<typeof ptCheckoutSchema>;
export type CheckoutFormData = z.infer<typeof dynamicCheckoutSchema>;
