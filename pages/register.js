import React, { useState } from "react";
import { Box, Button, FormHelperText, TextField } from "@mui/material";
import { register } from "../services/userService";
import { useRouter } from "next/router";
import style from "../styles/Register.module.css";
import { useDispatch } from "react-redux";
import { login } from "../utils/redux/userSlice";
import jwt_decode from "jwt-decode";

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
  const router = useRouter();
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
    router.push("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== confirmaPassword) {
      setError("Las contraseñas no coinciden");
    } else {
      try {
        setError("");
        const res = await register(form);
        dispatch(login(res));
      } catch (error) {
        setError(error.response.data);
      }
    }
  };

  return (
    <div className={style.register}>
      <Box component="form" className={`form ${style.form}`}>
        <TextField
          type="number"
          value={form.legajo}
          className={style["MuiTextField-root"]}
          onChange={handleChange("legajo")}
          label="Legajo"
        />
        <TextField
          value={form.nombre}
          onChange={handleChange("nombre")}
          className={style["MuiTextField-root"]}
          label="Nombre"
        />
        <TextField
          value={form.apellido}
          onChange={handleChange("apellido")}
          className={style["MuiTextField-root"]}
          label="Apellido"
        />
        <TextField
          type="number"
          value={form.telefono}
          onChange={handleChange("telefono")}
          className={style["MuiTextField-root"]}
          label="Telefono"
        />
        <TextField
          type="password"
          value={form.password}
          className={style["MuiTextField-root"]}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          label="Contraseña"
        />
        <TextField
          type="password"
          value={confirmaPassword}
          className={style["MuiTextField-root"]}
          onChange={(e) => setConfirmaPassword(e.target.value)}
          label="Confirmar contraseña"
        />
        {error && <FormHelperText error>{error}</FormHelperText>}
        <div className={`buttons ${style.buttons}`}>
          <Button className={style["MuiButton-root"]} onClick={loginNav}>
            Ya te registraste? ir a iniciar Sesion
          </Button>
          <Button
            className={style["MuiButton-root"]}
            onClick={handleSubmit}
            variant="contained"
          >
            Registrarse
          </Button>
        </div>
      </Box>
    </div>
  );
}

export default Register;
