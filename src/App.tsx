import { globalStyles } from "./assets/styles/global";
import { Toaster } from "react-hot-toast";
import { toastConfig } from "./configs/toast-config";
import Router from "./routes";

globalStyles();

function App() {
  return (
    <>
      <Toaster toastOptions={toastConfig} />
      <Router />
    </>
  );
}

export default App;
