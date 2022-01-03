import { NavLink, useNavigate } from "react-router-dom";
import { Logout } from "@mui/icons-material";

function App() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
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
        <Logout onClick={logout} />
      </nav>
    </div>
  );
}

export default App;
