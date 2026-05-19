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
  .max(50, "Nome muito longo")
  .transform((val) => val.toUpperCase());

export const paymentMethodSchema = z.enum(["credit_card", "two_cards", "pix", "courtesy"]);

export const creditCardSchema = z.object({
  number: cardNumberSchema,
  name: nameSchema,
  expiry: expirySchema,
  cvc: cvcSchema,
});

export const twoCardsSchema = z.object({
  amount1: z.number().min(0.01, "Valor inválido"),
  card1: creditCardSchema,
  card2: creditCardSchema,
});

export type CreditCardData = z.infer<typeof creditCardSchema>;
export type TwoCardsData = z.infer<typeof twoCardsSchema>;
