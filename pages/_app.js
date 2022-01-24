import "../styles/globals.css";
import store from "../utils/store";
import { Provider } from "react-redux";
import persistStore from "redux-persist/lib/persistStore";
import { PersistGate } from "redux-persist/integration/react";
import Redirect from "../components/Redirect";

let persistor = persistStore(store);

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Redirect>
          <Component {...pageProps} />
        </Redirect>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
