import React, { useEffect } from "react";
import { Box, Button, FormHelperText } from "@mui/material";
import { authActions } from "../redux/userSlice";
import { CustomTextField } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { history } from "../utils";
import "../styles/login.css";

function Login() {
  const { control, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const authUser = useSelector((x) => x.user.user);
  const authError = useSelector((x) => x.user.error);

  useEffect(() => {
    // redirect to home if already logged in
    if (authUser) history.navigate("/");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitEvent = async (data) => {
    dispatch(authActions.login(data));
  };

  const register = () => {
    history.navigate("/register");
  };
  return (
    <div className="login">
      <Box component="form" className="form">
        <CustomTextField
          type="number"
          control={control}
          name="legajo"
          label="Legajo"
          className="MuiTextField-root"
        />
        <CustomTextField
          type="password"
          control={control}
          name="password"
          label="Contraseña"
          className="MuiTextField-root"
        />
        {authError && (
          <FormHelperText error>{authError.message}</FormHelperText>
        )}
        <div className="buttons">
          <Button
            className="MuiButton-root"
            onClick={handleSubmit(submitEvent)}
            type="submit"
            variant="contained"
          >
            Iniciar sesion
          </Button>
          <Button className="MuiButton-root" onClick={register}>
            No te registraste? Registrarse
          </Button>
        </div>
      </Box>
    </div>
  );
}

export default Login;
