import { z } from "zod";

const cardNumberSchema = z
  .string()
  .min(13, "Número inválido")
  .max(19, "Número inválido")
  .transform((v) => v.replace(/\D/g, ""))
  .refine((val) => /^[0-9]+$/.test(val), "Apenas números");

const expirySchema = z
  .string()
  .regex(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/, "Data inválida (MM/AA)");

const cvcSchema = z.string().min(3, "CVC inválido").max(4, "CVC inválido");

const nameSchema = z
  .string()
  .min(1, "Nome obrigatório")
  .transform((val) => val.toUpperCase());

export const cardBaseSchema = z.object({
  number: cardNumberSchema,
  name: nameSchema,
  expiry: expirySchema,
  cvc: cvcSchema,
});

export const twoCardsValuesSchema = z.object({
  amount1: z.number().min(0.01, "Valor inválido"),
  card1: cardBaseSchema,
  card2: cardBaseSchema,
});

const retryPaymentValidationSchema = z.object({
  paymentMethod: z.enum(["credit_card", "two_cards"]),
  installments: z.coerce.number().min(1, "Mínimo 1 parcela"),
  creditCard: cardBaseSchema.optional(),
  twoCards: twoCardsValuesSchema.optional(),
});

const retryPaymentTypeSchema = z.object({
  paymentMethod: z.enum(["credit_card", "two_cards"]),
  installments: z.coerce.number().min(1, "Mínimo 1 parcela"),
  creditCard: cardBaseSchema.optional(),
  twoCards: twoCardsValuesSchema.optional(),
});

export const retryPaymentSchema = retryPaymentValidationSchema.superRefine(
  (val, ctx) => {
    if (val.paymentMethod === "credit_card") {
      const result = cardBaseSchema.safeParse(val.creditCard);

      if (!result.success) {
        result.error.issues.forEach((issue) => {
          ctx.addIssue({ ...issue, path: ["creditCard", ...issue.path] });
        });
      }
    }

    if (val.paymentMethod === "two_cards") {
      const result = twoCardsValuesSchema.safeParse(val.twoCards);

      if (!result.success) {
        result.error.issues.forEach((issue) => {
          ctx.addIssue({ ...issue, path: ["twoCards", ...issue.path] });
        });
      }
    }
  },
);

export type RetryPaymentFormValues = z.infer<typeof retryPaymentTypeSchema>;
