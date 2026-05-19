import { z } from "zod";
import type { Country } from "../contexts/regional-config-context.types";

const baseSchema = z.object({
  nationality: z.string(),
  name: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .transform((name) => {
      return name
        .trim()
        .split(" ")
        .map((word) => word[0].toLocaleUpperCase().concat(word.substring(1)))
        .join(" ");
    }),
  email: z.string().email("Informe um e-mail válido"),
  ddi: z.string().min(1, "Selecione o DDI"),
  document: z.string(),
});

export const brClientFormSchema = baseSchema.extend({
  ddi: z.literal("+55", {
    errorMap: () => ({ message: "DDI inválido para Brasil" }),
  }),
  phone: z
    .string()
    .min(11, "Telefone deve ter 11 dígitos (DDD + 9 dígitos)")
    .refine(
      (val) => val.replace(/\D/g, "").length === 11,
      "Telefone deve ter exatamente 11 dígitos",
    )
    .transform((val) => val.replace(/\D/g, "")),
  document: z
    .string()
    .min(11, "CPF deve ter 11 dígitos")
    .refine(
      (val) => val.replace(/\D/g, "").length === 11,
      "CPF deve ter exatamente 11 dígitos",
    )
    .transform((val) => val.replace(/\D/g, "")),
});

export const usaClientFormSchema = baseSchema.extend({
  ddi: z.literal("+1", {
    errorMap: () => ({ message: "DDI inválido para EUA" }),
  }),
  phone: z
    .string()
    .min(10, "Telefone deve ter 10 dígitos")
    .refine(
      (val) => val.replace(/\D/g, "").length === 10,
      "Telefone deve ter exatamente 10 dígitos",
    )
    .transform((val) => val.replace(/\D/g, "")),
  document: z
    .string()
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, "");
        return digits.length === 0 || digits.length === 11;
      },
      "CPF deve ter exatamente 11 dígitos",
    )
    .transform((val) => val.replace(/\D/g, "")),
});

export const ptClientFormSchema = baseSchema.extend({
  ddi: z.literal("+351", {
    errorMap: () => ({ message: "DDI inválido para Portugal" }),
  }),
  phone: z
    .string()
    .min(9, "Telefone deve ter 9 dígitos")
    .refine(
      (val) => val.replace(/\D/g, "").length === 9,
      "Telefone deve ter exatamente 9 dígitos",
    )
    .transform((val) => val.replace(/\D/g, "")),
  document: z
    .string()
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, "");
        return digits.length === 0 || digits.length === 9;
      },
      "NIF deve ter exatamente 9 dígitos",
    )
    .transform((val) => val.replace(/\D/g, "")),
});

export const getClientFormSchema = (country: Country) => {
  const schemas: Record<Country, z.ZodSchema> = {
    BR: brClientFormSchema,
    USA: usaClientFormSchema,
    PT: ptClientFormSchema,
  };
  return schemas[country];
};

export const dynamicClientFormSchema = z.discriminatedUnion("nationality", [
  brClientFormSchema.extend({ nationality: z.literal("BR") }),
  usaClientFormSchema.extend({ nationality: z.literal("USA") }),
  ptClientFormSchema.extend({ nationality: z.literal("PT") }),
]);

export type BRClientFormData = z.infer<typeof brClientFormSchema>;
export type USAClientFormData = z.infer<typeof usaClientFormSchema>;
export type PTClientFormData = z.infer<typeof ptClientFormSchema>;
export type DynamicClientFormData = z.infer<typeof dynamicClientFormSchema>;
