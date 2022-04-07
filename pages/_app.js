import "../styles/globals.css";
import store from "../utils/store";
import { Provider } from "react-redux";
import Redirect from "../components/Redirect";
import Head from "next/head";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

let persistor = persistStore(store);

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Head>
          <title>TransitoVL</title>
          <link rel="icon" href="/logo.ico" />
        </Head>
        <Redirect>
          <Component {...pageProps} />
        </Redirect>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
