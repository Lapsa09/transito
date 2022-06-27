import { useEffect, useState } from "react";
import { verifyAuth } from "../services/index";
import { login, logout, selectUser } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocalStorage } from "../hooks";
import { useNavigate } from "react-router-dom";

function Redirect({ children }) {
  const router = useNavigate();
  const [token] = useLocalStorage("token");
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [authorized, setAuthorized] = useState(false);
  useEffect(() => {
    async function authCheck(url) {
      const publicPaths = ["/login", "/register"];
      const adminPaths = [
        "/operativos/autos",
        "/operativos/motos",
        "/operativos/camiones",
        "/control/paseo/data",
      ];
      const path = url.split("?")[0];
      await checkAuthenticated();
      if (token) {
        if (publicPaths.includes(path)) {
          setAuthorized(false);
          router("/");
        } else if (user?.rol !== "ADMIN" && adminPaths.includes(path)) {
          setAuthorized(false);
          router("/");
        } else {
          setAuthorized(true);
        }
      } else if (!token) {
        if (!publicPaths.includes(path)) {
          setAuthorized(false);
          router("/login");
        } else {
          setAuthorized(true);
        }
      }
    }

    const checkAuthenticated = async () => {
      try {
        const parseRes = await verifyAuth();
        if (!parseRes) {
          dispatch(logout());
        } else if (!user) {
          dispatch(login(token));
        }
      } catch (err) {
        dispatch(logout());
      }
    };
    const hideContent = () => setAuthorized(false);
    authCheck(router.asPath);
    router.events.on("routeChangeStart", hideContent);
    router.events.on("routeChangeComplete", authCheck);
    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };
  }, [token]);

  return authorized && children;
}

export default Redirect;
