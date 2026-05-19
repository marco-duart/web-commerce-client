import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PromotionalPackagePage, OrderPage } from "../pages";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/promotions/:slug" element={<PromotionalPackagePage />} />
        <Route path="/order/:orderId" element={<OrderPage />} />
      </Routes>
    </BrowserRouter>
  );
}
