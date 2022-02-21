import "../styles/globals.css";
import store from "../utils/store";
import { Provider } from "react-redux";
import Redirect from "../components/Redirect";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Redirect>
        <Component {...pageProps} />
      </Redirect>
    </Provider>
  );
}

export default MyApp;
