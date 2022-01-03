import React, { useEffect, useState } from "react";
import "./register.css";
import {
  Box,
  Button,
  FormHelperText,
  MenuItem,
  TextField,
} from "@mui/material";
import { register } from "../../services/userService";
import { getTurnos } from "../../services";

function Register({ setAuth }) {
  const [form, setForm] = useState({
    legajo: "",
    nombre: "",
    apellido: "",
    turno: "",
    telefono: "",
    password: "",
  });
  const [confirmaPassword, setConfirmaPassword] = useState("");
  const [error, setError] = useState("");
  const [turnos, setTurnos] = useState([]);

  const handleChange = (input) => (e) => {
    setForm({
      ...form,
      [input]:
        typeof e.target.value == "string"
          ? e.target.value.toUpperCase()
          : e.target.value,
    });
  };

  useEffect(() => {
    initialFetch();
  }, []);

  const initialFetch = async () => {
    setTurnos(await getTurnos());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== confirmaPassword) {
      setError("Las contraseñas no coinciden");
    } else {
      try {
        setError("");
        const res = await register(form);
        if (res.jwtToken) {
          localStorage.setItem("token", res.jwtToken);
          setAuth(true);
        } else {
          setError(res);
        }
      } catch (error) {
        setError(error.response.data);
      }
    }
  };

  return (
    <div className="register">
      <Box component="form" className="form">
        <TextField
          type="number"
          value={form.legajo}
          onChange={handleChange("legajo")}
          label="Legajo"
        />
        <TextField
          value={form.nombre}
          onChange={handleChange("nombre")}
          label="Nombre"
        />
        <TextField
          value={form.apellido}
          onChange={handleChange("apellido")}
          label="Apellido"
        />
        <TextField
          select
          value={form.turno}
          onChange={handleChange("turno")}
          label="Turno"
        >
          <MenuItem>ELIJA UNA OPCION</MenuItem>
          {turnos.map((turno, index) => (
            <MenuItem key={index} value={turno.enumlabel}>
              {turno.enumlabel}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          type="number"
          value={form.telefono}
          onChange={handleChange("telefono")}
          label="Telefono"
        />
        <TextField
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          label="Contraseña"
        />
        <TextField
          type="password"
          value={confirmaPassword}
          onChange={(e) => setConfirmaPassword(e.target.value)}
          label="Confirmar contraseña"
        />
        {error && <FormHelperText error>{error}</FormHelperText>}
        <div className="buttons">
          <Button>Ya te registraste? ir a iniciar Sesion</Button>
          <Button onClick={handleSubmit} variant="contained">
            Registrarse
          </Button>
        </div>
      </Box>
    </div>
  );
}

export default Register;
