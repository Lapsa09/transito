import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { verifyAuth } from "../services/index";
import { logout, selectUser } from "../utils/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

function Redirect({ children }) {
  const router = useRouter();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [authorized, setAuthorized] = useState(false);
  useEffect(() => {
    authCheck(router.asPath);
    const hideContent = () => setAuthorized(false);
    router.events.on("routeChangeStart", hideContent);
    router.events.on("routeChangeComplete", authCheck);
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
      router.push("/login");
    } else if (user && publicPaths.includes(path)) {
      router.push("/");
    } else {
      setAuthorized(true);
    }
  }

  const checkAuthenticated = async () => {
    try {
      const parseRes = await verifyAuth();
      if (!parseRes) {
        localStorage.removeItem("token");
        dispatch(logout());
      }
    } catch (err) {
      console.error(err.response.data.msg);
    }
  };

  return authorized && children;
}

export default Redirect;
