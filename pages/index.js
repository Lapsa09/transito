import { Logout } from "@mui/icons-material";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../utils/redux/userSlice";
import styles from "../styles/Home.module.css";
import LogoVL from "../public/LOGO_V_LOPEZ.png";
import LogoOVT from "../public/OVT_LETRAS_NEGRAS.png";
import CustomPopover from "../components/Popover";

export default function Home() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  const controles = [
    { link: "/control/diario", title: "Diario" },
    { link: "/control/paseo", title: "Paseo" },
  ];

  const operativos = [
    { link: "/operativos/autos", title: "Autos" },
    { link: "/operativos/motos", title: "Motos" },
    { link: "/operativos/camiones", title: "Camiones" },
  ];

  return (
    <div className={styles.home}>
      <nav className={styles.header}>
        <Image src={LogoVL} width={300} height={70} layout="fixed" />
        <CustomPopover title="Control" links={controles} />
        {user.rol === "ADMIN" && (
          <CustomPopover title="Operativos" links={operativos} />
        )}
        <Logout className={styles.logout} onClick={handleLogout} />
        <Image src={LogoOVT} width={150} height={70} layout="fixed" />
      </nav>
      <h1>
        BIENVENIDO {user.nombre} {user.apellido} LP {user.legajo}
      </h1>
    </div>
  );
}
