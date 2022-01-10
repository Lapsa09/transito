import React, { useState } from "react";
import "./register.css";
import { Box, Button, FormHelperText, TextField } from "@mui/material";
import { register } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { login } from "../../utils/redux/userSlice";
import { useDispatch } from "react-redux";

function Register() {
  const [form, setForm] = useState({
    legajo: "",
    nombre: "",
    apellido: "",
    telefono: "",
    password: "",
  });
  const [confirmaPassword, setConfirmaPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (input) => (e) => {
    setForm({
      ...form,
      [input]:
        typeof e.target.value == "string"
          ? e.target.value.toUpperCase()
          : e.target.value,
    });
  };

  const loginNav = () => {
    navigate("/login");
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
          dispatch(
            login({
              legajo: form.legajo,
              nombre: form.nombre,
              apellido: form.apellido,
              telefono: form.telefono,
            })
          );
          navigate("/");
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
          <Button onClick={loginNav}>
            Ya te registraste? ir a iniciar Sesion
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Registrarse
          </Button>
        </div>
      </Box>
    </div>
  );
}

export default Register;
