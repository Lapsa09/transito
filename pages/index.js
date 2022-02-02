import { Logout } from "@mui/icons-material";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../utils/redux/userSlice";

export default function Home() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <div className="home">
      <h1>Home</h1>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/control">Control Diario</Link>
        {user.rol === "ADMIN" && <Link href="/operativos">Operativos</Link>}
        <Logout onClick={handleLogout} />
      </nav>
    </div>
  );
}
