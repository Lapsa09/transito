import { NavLink } from "react-router-dom";

function App() {
  return (
    <div>
      <h1>Home</h1>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/accidentes">Accidentes</NavLink>
        <NavLink to="/operativos">Operativos</NavLink>
        <NavLink to="/control">Control Diario</NavLink>
      </nav>
    </div>
  );
}

export default App;
