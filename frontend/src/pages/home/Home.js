import { NavLink, useNavigate } from "react-router-dom";
import { Logout } from "@mui/icons-material";
import { logout } from "../../utils/redux/userSlice";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate(0);
  };
  return (
    <div className="home">
      <h1>Home</h1>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/accidentes">Accidentes</NavLink>
        <NavLink to="/operativos">Operativos</NavLink>
        <NavLink to="/control">Control Diario</NavLink>
        <Logout onClick={handleLogout} />
      </nav>
    </div>
  );
}

export default App;
