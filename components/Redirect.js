import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { verifyAuth } from "../services/index";
import { login, logout, selectUser } from "../utils/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

function Redirect({ children }) {
  const router = useRouter();
  let token;
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
      ];
      const path = url.split("?")[0];
      await checkAuthenticated();
      if (token) {
        if (publicPaths.includes(path)) {
          setAuthorized(false);
          router.replace("/");
        } else if (user && user.rol !== "ADMIN" && adminPaths.includes(path)) {
          setAuthorized(false);
          router.replace("/");
        } else {
          setAuthorized(true);
        }
      } else if (!token) {
        if (!publicPaths.includes(path)) {
          setAuthorized(false);
          router.replace("/login");
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
    token = localStorage.getItem("token");
    const hideContent = () => setAuthorized(false);
    authCheck(router.asPath);
    router.events.on("routeChangeStart", hideContent);
    router.events.on("routeChangeComplete", authCheck);
    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };
  }, [user]);

  return authorized && children;
}

export default Redirect;
