

import "@/styles/globals.css";
import { Provider } from "react-redux";
import { store } from "../config/redux/store";
import NotificationSocketBridge from "@/Components/NotificationSocketBridge";
import NotificationToasts from "@/Components/NotificationToasts";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <NotificationSocketBridge />
      <NotificationToasts />
      <Toaster position="top-center" reverseOrder={false} />
      <Component {...pageProps} />
    </Provider>
  );
}
