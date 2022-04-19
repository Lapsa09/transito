import React, { useState } from "react";
import { Box, Button, FormHelperText } from "@mui/material";
import { loginCall } from "../services/userService";
import style from "../styles/Login.module.css";
import { login } from "../redux/userSlice";
import { useRouter } from "next/router";
import CustomTextField from "../components/ui/CustomTextField";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

function Login() {
  const { control, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const submitEvent = async (data) => {
    try {
      setError("");
      const res = await loginCall(data);
      dispatch(login(res));
      // router.replace("/");
    } catch (error) {
      setError(error.response.data);
    }
  };

  const register = () => {
    router.push("/register");
  };
  return (
    <div className={style.login}>
      <Box component="form" className={style.form}>
        <CustomTextField
          type="number"
          control={control}
          name="legajo"
          label="Legajo"
          className={style["MuiTextField-root"]}
        />
        <CustomTextField
          type="password"
          control={control}
          name="password"
          label="Contraseña"
          className={style["MuiTextField-root"]}
        />
        {error && <FormHelperText error>{error}</FormHelperText>}
        <div className={style.buttons}>
          <Button
            className={style["MuiButton-root"]}
            onClick={handleSubmit(submitEvent)}
            type="submit"
            variant="contained"
          >
            Iniciar sesion
          </Button>
          <Button className={style["MuiButton-root"]} onClick={register}>
            No te registraste? Registrarse
          </Button>
        </div>
      </Box>
    </div>
  );
}

export default Login;
