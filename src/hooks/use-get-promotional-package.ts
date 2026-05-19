import { useEffect, useState, useCallback } from "react";
import type { GetPromotionalPackageBySlug } from "../mocks/types";
import { getPrototypePackageBySlug } from "../mocks/prototype-data";
import toast from "react-hot-toast";

export type PromotionalPackageUI = GetPromotionalPackageBySlug.Response & {
  cover_image?: string | null;
};

interface State {
  promotionalPackage: PromotionalPackageUI | null;
  loading: boolean;
  stock?: number | null;
}

const INITIAL_STATE: State = {
  promotionalPackage: null,
  loading: true,
  stock: null,
};

export const useGetPromotionalPackage = (slug: string) => {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const fetchPromotionalPackage = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    const { success, data, message } = await getPrototypePackageBySlug({
      slug,
    });

    if (success && data) {
      let stock: number | null = null;

      if (data.offer?.products) {
        for (const product of data.offer.products) {
          if (product.limit && product.limit <= 3) {
            stock = product.limit;
            break;
          }
        }
      }

      const finalPackage: PromotionalPackageUI = {
        ...data,
        cover_image: null,
      };
      setState({ promotionalPackage: finalPackage, loading: false, stock });
    } else {
      setState({ promotionalPackage: null, loading: false, stock: null });
      toast.error(message);
    }
  }, [slug]);

  useEffect(() => {
    fetchPromotionalPackage();
  }, [fetchPromotionalPackage]);

  return state;
};
