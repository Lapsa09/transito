import { Logout } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../redux/userSlice";
import LogoVL from "../assets/imgs/LOGO_V_LOPEZ.png";
import LogoOVT from "../assets/imgs/OVT_LETRAS_NEGRAS.png";
import CustomPopover from "../components/ui/Popover";
import { useState } from "react";
import "../styles/home.css";

export default function Home() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
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
    <div className="home">
      <nav className="header">
        <img src={LogoVL} style={{ width: "300px", height: "70px" }} />
        <div
          onMouseEnter={() => onMouseEnter("control")}
          onMouseLeave={onMouseLeave}
          className="nav-link"
        >
          <h3 className="item">Control</h3>
          {dropdown === "control" && <CustomPopover links={controles} />}
        </div>
        {user?.rol === "ADMIN" && (
          <div
            onMouseEnter={() => onMouseEnter("operativos")}
            onMouseLeave={onMouseLeave}
            className="nav-link"
          >
            <h3 className="item">Operativos</h3>
            {dropdown === "operativos" && <CustomPopover links={operativos} />}
          </div>
        )}
        <Logout className="logout" onClick={handleLogout} />
        <img src={LogoOVT} style={{ width: "150px", height: "70px" }} />
      </nav>
      <h1>
        BIENVENIDO {user?.nombre} {user?.apellido} LP {user?.legajo}
      </h1>
    </div>
  );
}
