import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { verifyAuth } from "../services/index";
import { login, logout, selectUser } from "../utils/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

function Redirect({ children }) {
  const router = useRouter();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [authorized, setAuthorized] = useState(false);
  useEffect(() => {
    const hideContent = () => setAuthorized(false);
    router.events.on("routeChangeStart", hideContent);
    router.events.on("routeChangeComplete", authCheck);
    authCheck(router.asPath);
    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };
  }, [user]);

  async function authCheck(url) {
    const publicPaths = ["/login", "/register"];
    const path = url.split("?")[0];
    await checkAuthenticated();
    if (!user && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push("/login");
    } else if (user && publicPaths.includes(path)) {
      setAuthorized(false);
      router.push("/");
    } else {
      setAuthorized(true);
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
      console.error(err.response.data.msg);
    }
  };

  return authorized && children;
}

export default Redirect;
