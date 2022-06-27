import React, { useState } from "react";
import { Box, Button, FormHelperText } from "@mui/material";
import { register } from "../services/userService";
import { useDispatch } from "react-redux";
import { login } from "../redux/userSlice";
import CustomTextField from "../components/ui/CustomTextField";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

function Register() {
  const { control, handleSubmit, getValues } = useForm();
  const [error, setError] = useState("");
  const router = useNavigate();
  const dispatch = useDispatch();

  const loginNav = () => {
    router.push("/login");
  };

  const submitEvent = async (data) => {
    try {
      setError("");
      const res = await register(data);
      dispatch(login(res));
      router("/", { replace: true });
    } catch (error) {
      setError(error.response.data);
    }
  };

  return (
    <div className="register">
      <Box component="form" className="form">
        <CustomTextField
          type="number"
          control={control}
          rules={{ required: "Campo requerido" }}
          name="legajo"
          label="Legajo"
        />
        <CustomTextField
          control={control}
          name="nombre"
          rules={{ required: "Campo requerido" }}
          label="Nombre"
        />
        <CustomTextField
          control={control}
          name="apellido"
          rules={{ required: "Campo requerido" }}
          label="Apellido"
        />
        <CustomTextField
          type="number"
          control={control}
          name="telefono"
          rules={{ required: "Campo requerido" }}
          label="Telefono"
        />
        <CustomTextField
          type="password"
          control={control}
          name="password"
          rules={{ required: "Campo requerido" }}
          label="Contraseña"
        />
        <CustomTextField
          type="pasword"
          control={control}
          name="confirmPassword"
          rules={{
            validate: {
              confirmPassword: (value) => value === getValues("password"),
            },
          }}
          label="Confirmar contraseña"
        />
        {error && <FormHelperText error>{error}</FormHelperText>}
        <div className="buttons">
          <Button onClick={loginNav}>
            Ya te registraste? ir a iniciar Sesion
          </Button>
          <Button onClick={handleSubmit(submitEvent)} variant="contained">
            Registrarse
          </Button>
        </div>
      </Box>
    </div>
  );
}

Register.public = true;

export default Register;
