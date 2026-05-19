import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useRegionalConfig } from "../../contexts/regional-config-context";
import * as S from "./styles";
import { type GetPromotionalPackageBySlug } from "../../mocks/types";
import { type CheckoutFormData } from "../../schemas/checkout.schema";

interface Props {
  packageData: GetPromotionalPackageBySlug.Response;
}

export const ProductCourtesyForm: React.FC<Props> = ({ packageData }) => {
  const { watch, setValue} = useFormContext<CheckoutFormData>();

  const { formatValue } = useRegionalConfig();

  const productQuantities = watch("productQuantities") || {};

  const products = packageData.offer?.products ?? [];

  useEffect(() => {
    const currentQuantities = productQuantities || {};
    const hasAnySelection = Object.values(currentQuantities).some(
      (qty) => Number(qty) > 0
    );

    if (!hasAnySelection && products.length > 0) {
      const initialQuantities: Record<string, number> = {};

      products.forEach((prod) => {
        initialQuantities[String(prod.id)] = 1;
      });

      setValue("productQuantities", initialQuantities, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [products, setValue]);

  return (
    <S.FormGrid>
      <S.GridItem span={12}>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {products.map((prod) => {
            const userQty = productQuantities[String(prod.id)] || 0;
            return (
              <S.ProductSummaryWrapper key={`prod-${prod.id}`}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <span
                      className="name"
                      style={{
                        fontSize: "1rem",
                        fontWeight: "bold",
                        color: "#2D4068",
                      }}
                    >
                      📦 {prod.product.name}
                    </span>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "#666",
                        marginTop: "2px",
                      }}
                    >
                      {formatValue(prod.financial.value_cash)} un.
                      {prod.product.id === 1 && prod.financial.quantity && (
                        <span style={{ marginLeft: "8px", fontWeight: "bold" }}>
                          ({prod.financial.quantity} créditos)
                        </span>
                      )}
                    </div>
                  </div>

                </div>

                {userQty > 0 && prod.bonuses.length > 0 && (
                  <div
                    style={{
                      backgroundColor: "#FFFbf0",
                      padding: "8px",
                      borderRadius: "4px",
                      marginTop: "8px",
                      border: "1px dashed #F39C12",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        color: "#D68910",
                        display: "block",
                      }}
                    >
                      INCLUSO NESTA SELEÇÃO:
                    </span>
                    {prod.bonuses.map((bonus) => (
                      <S.BonusSummaryItem
                        key={`bonus-${bonus.id}`}
                        style={{ paddingLeft: 0, marginTop: "2px" }}
                      >
                        <span className="name" style={{ fontSize: "0.85rem" }}>
                          🎁 {bonus.product.name}
                        </span>
                        <span
                          style={{ fontSize: "0.8rem", fontWeight: "bold" }}
                        >
                          {(bonus.financial.quantity || 1) * userQty} un.
                        </span>
                      </S.BonusSummaryItem>
                    ))}
                  </div>
                )}
              </S.ProductSummaryWrapper>
            );
          })}
        </div>
      </S.GridItem>
    </S.FormGrid>
  );
};
