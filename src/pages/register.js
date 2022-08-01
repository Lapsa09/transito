import React, { useEffect, useState } from "react";
import { Box, Button, FormHelperText } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../redux/userSlice";
import CustomTextField from "../components/ui/CustomTextField";
import { useForm } from "react-hook-form";
import { history } from "../utils";
import "../styles/register.css";

function Register() {
  const { control, handleSubmit, getValues } = useForm();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const authUser = useSelector((x) => x.user.user);
  const authError = useSelector((x) => x.user.error);

  const loginNav = () => {
    history.navigate("/login");
  };

  useEffect(() => {
    // redirect to home if already logged in
    if (authUser) history.navigate("/");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitEvent = async (data) => {
    setError("");
    // const res = await register(data);
    dispatch(authActions.register(data));
    history.navigate("/", { replace: true });
    if (authError) {
      setError(authError.message);
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
