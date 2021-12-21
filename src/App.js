import "./App.css";
import { NavLink } from "react-router-dom";

function App() {
  return (
    <div>
      <h1>Home</h1>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/accidentes">Accidentes</NavLink>
      </nav>
    </div>
  );
}

export default App;
