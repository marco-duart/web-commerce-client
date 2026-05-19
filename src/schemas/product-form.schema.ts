import { z } from "zod";

export const productFormSchema = z
  .object({
    productQuantities: z.record(z.string(), z.number()),
    installments: z.number().min(1, "Selecione o parcelamento"),
    coupon: z.string().optional(),
    discount_percentage: z.number().optional(),
    discount_value: z.number().optional(),
    discount_type: z.number().optional(),
    coupon_id: z.number().optional(),
  })
  .refine(
    (data) => {
      const totalItems = Object.values(data.productQuantities).reduce(
        (acc, curr) => acc + (curr || 0),
        0,
      );
      return totalItems > 0;
    },
    {
      message: "Selecione pelo menos um produto para continuar",
      path: ["productQuantities"],
    },
  );

export type ProductFormData = z.infer<typeof productFormSchema>;
