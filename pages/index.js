import { Logout } from "@mui/icons-material";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../utils/redux/userSlice";
import styles from "../styles/Home.module.css";
import LogoVL from "../public/LOGO_V_LOPEZ.png";
import LogoOVT from "../public/OVT_LETRAS_NEGRAS.png";
import CustomPopover from "../components/Popover";
import { useState } from "react";

export default function Home() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [dropdown, setDropdown] = useState(null);
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

  const onMouseEnter = (_menu) => {
    if (window.innerWidth < 960) {
      setDropdown(null);
    } else {
      setDropdown(_menu);
    }
  };

  const onMouseLeave = () => {
    if (window.innerWidth < 960) {
      setDropdown(false);
    } else {
      setDropdown(false);
    }
  };

  return (
    <div className={styles.home}>
      <nav className={styles.header}>
        <Image src={LogoVL} width={300} height={70} layout="fixed" />
        <div
          onMouseEnter={() => onMouseEnter("control")}
          onMouseLeave={onMouseLeave}
          className={styles["nav-link"]}
        >
          <h3 className={styles.item}>Control</h3>
          {dropdown === "control" && <CustomPopover links={controles} />}
        </div>
        {user.rol === "ADMIN" && (
          <div
            onMouseEnter={() => onMouseEnter("operativos")}
            onMouseLeave={onMouseLeave}
            className={styles["nav-link"]}
          >
            <h3 className={styles.item}>Operativos</h3>
            {dropdown === "operativos" && <CustomPopover links={operativos} />}
          </div>
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
