import React, { useState } from "react";
import { Box, Button, FormHelperText } from "@mui/material";
import { register } from "../services/userService";
import { useRouter } from "next/router";
import style from "../styles/Register.module.css";
import { useDispatch } from "react-redux";
import { login } from "../redux/userSlice";
import CustomTextField from "../components/ui/CustomTextField";
import { useForm } from "react-hook-form";

function Register() {
  const { control, handleSubmit, getValues } = useForm();
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const loginNav = () => {
    router.push("/login");
  };

  const submitEvent = async (data) => {
    try {
      setError("");
      const res = await register(data);
      dispatch(login(res));
    } catch (error) {
      setError(error.response.data);
    }
  };

  return (
    <div className={style.register}>
      <Box component="form" className={style.form}>
        <CustomTextField
          type="number"
          control={control}
          rules={{ required: "Campo requerido" }}
          name="legajo"
          label="Legajo"
          className={style["MuiTextField-root"]}
        />
        <CustomTextField
          control={control}
          name="nombre"
          rules={{ required: "Campo requerido" }}
          label="Nombre"
          className={style["MuiTextField-root"]}
        />
        <CustomTextField
          control={control}
          name="apellido"
          rules={{ required: "Campo requerido" }}
          label="Apellido"
          className={style["MuiTextField-root"]}
        />
        <CustomTextField
          type="number"
          control={control}
          name="telefono"
          rules={{ required: "Campo requerido" }}
          label="Telefono"
          className={style["MuiTextField-root"]}
        />
        <CustomTextField
          type="password"
          control={control}
          name="password"
          rules={{ required: "Campo requerido" }}
          label="Contraseña"
          className={style["MuiTextField-root"]}
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
          className={style["MuiTextField-root"]}
        />
        {error && <FormHelperText error>{error}</FormHelperText>}
        <div className={style.buttons}>
          <Button className={style["MuiButton-root"]} onClick={loginNav}>
            Ya te registraste? ir a iniciar Sesion
          </Button>
          <Button
            className={style["MuiButton-root"]}
            onClick={handleSubmit(submitEvent)}
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
