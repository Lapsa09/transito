import "../styles/globals.css";
import store from "../utils/store";
import { Provider } from "react-redux";
import Redirect from "../components/Redirect";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head>
        <title>TransitoVL</title>
        <link rel="icon" href="/logo.ico" />
      </Head>
      <Redirect>
        <Component {...pageProps} />
      </Redirect>
    </Provider>
  );
}

export default MyApp;
