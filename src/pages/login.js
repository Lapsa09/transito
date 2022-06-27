import React, { useState } from "react";
import { Box, Button, FormHelperText } from "@mui/material";
import { loginCall } from "../services/userService";
import { login } from "../redux/userSlice";
import CustomTextField from "../components/ui/CustomTextField";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const { control, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const router = useNavigate();
  const dispatch = useDispatch();

  const submitEvent = async (data) => {
    try {
      setError("");
      const res = await loginCall(data);
      dispatch(login(res));
      router("/", { replace: true });
    } catch (error) {
      setError(error.response?.data);
    }
  };

  const register = () => {
    router("/register");
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
        {error && <FormHelperText error>{error}</FormHelperText>}
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
