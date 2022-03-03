import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { verifyAuth } from "../services/index";
import { login, logout, selectUser } from "../utils/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import jwtDecode from "jwt-decode";

function Redirect({ children }) {
  const router = useRouter();
  let token;
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [authorized, setAuthorized] = useState(false);
  useEffect(() => {
    token = localStorage.getItem("token");
    const hideContent = () => setAuthorized(false);
    authCheck(router.asPath);
    router.events.on("routeChangeStart", hideContent);
    router.events.on("routeChangeComplete", authCheck);
    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };
  }, [token]);

  async function authCheck(url) {
    const publicPaths = ["/login", "/register"];
    const adminPaths = [
      "/operativos/autos",
      "/operativos/motos",
      "/operativos/camiones",
    ];
    const path = url.split("?")[0];
    if (token) {
      await checkAuthenticated();
      if (publicPaths.includes(path)) {
        setAuthorized(false);
        router.push("/");
      } else if (user && user.rol !== "ADMIN" && adminPaths.includes(path)) {
        setAuthorized(false);
        router.push("/");
      } else {
        setAuthorized(true);
      }
    } else if (!token) {
      if (!publicPaths.includes(path)) {
        setAuthorized(false);
        router.push("/login");
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
        dispatch(login(localStorage.getItem("token")));
      }
    } catch (err) {
      dispatch(logout());
    }
  };

  return authorized && children;
}

export default Redirect;
