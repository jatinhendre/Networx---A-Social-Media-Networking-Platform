

import "@/styles/globals.css";
import { Provider } from "react-redux";
import { store } from "../config/redux/store";
import NotificationSocketBridge from "@/Components/NotificationSocketBridge";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <NotificationSocketBridge />
      <Component {...pageProps} />
    </Provider>
  );
}
