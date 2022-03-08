import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  getLocalidades,
  getMotivos,
  getMotivosPaseo,
  nuevoControl,
  nuevoControlPaseo,
} from "../../services/controlDiarioService";
import { getResolucion, getTurnos } from "../../services/index";
import CustomDatePicker from "../ui/DatePicker";
import CustomTimePicker from "../ui/TimePicker";
import CustomSnackbar from "../ui/CustomSnackbar";
import style from "../../styles/controlDiarioForm.module.css";
import { selectUser } from "../../utils/redux/userSlice";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import CustomTextField from "../ui/CustomTextField";
import CustomSelect from "../ui/CustomSelect";
import CustomAutocomplete from "../ui/CustomAutocomplete";
import { useRouter } from "next/router";
import { DateTime } from "luxon";
import { DOMINIO_PATTERN, LEGAJO_PATTERN } from "../../utils/validations";
import Layout from "../../layouts/FormLayout";

function ControlDiarioForm({ handleClose, afterCreate }) {
  const { handleSubmit, control, reset, getValues, setValue } = useForm();
  const [resolucion, setResolucion] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [motivos, setMotivos] = useState([]);
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState({ severity: "", message: "" });
  const user = useSelector(selectUser);
  const router = useRouter();
  const handleRol = () => user.rol === "ADMIN";

  const submitting = async (data) => {
    try {
      checkPath() ? await nuevoControl(data) : await nuevoControlPaseo(data);
      reset({ ...data, dominio: "", localidadInfractor: null });
      if (handleRol()) {
        showSnackbar("success", "Cargado con exito");
        await afterCreate();
      } else {
        showSnackbar("success", "Cargado con exito");
        setTimeout(handleClose, 2000);
      }
    } catch (error) {
      showSnackbar("error", error.response.data);
    }
  };

  const checkPath = () => {
    const path = router.asPath.split("?")[0];
    return path === "/control/diario";
  };

  useEffect(() => {
    Promise.all([
      getLocalidades(),
      checkPath() ? getMotivos() : getMotivosPaseo(),
      getTurnos(),
      getResolucion(),
    ])
      .then(([barrios, motivos, turnos, resoluciones]) => {
        setLocalidades(barrios);
        setMotivos(motivos);
        setTurnos(turnos);
        setResolucion(resoluciones);
        setValue("lpcarga", user.legajo);
      })
      .catch((error) => {
        showSnackbar("error", error.message);
      });
  }, []);

  const getMotivo = () => {
    return (
      motivos.find((motivo) => motivo.id == getValues("motivo"))?.motivo || ""
    );
  };

  const showSnackbar = (severity, message) => {
    setResponse({ severity, message });
    setOpen(true);
  };

  const closeSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Layout classes={style.form}>
      <Box component="form" className="form__box">
        <CustomDatePicker
          control={control}
          label="Fecha"
          name="fecha"
          defaultValue={!handleRol() ? DateTime.now().setLocale("es-AR") : null}
          disabled={!handleRol()}
        />
        <CustomSelect
          control={control}
          name="turno"
          rules={{ required: "Elija una opcion" }}
          label="Turno"
          defaultValue={!handleRol() ? "MAÑANA" : ""}
          disabled={!handleRol()}
          options={turnos}
        />
        <CustomTimePicker
          control={control}
          name="hora"
          label="Hora"
          defaultValue={!handleRol() ? DateTime.now().setLocale("es-AR") : null}
          disabled={!handleRol()}
        />
        <CustomTextField
          control={control}
          name="direccion"
          disabled={!checkPath()}
          rules={{ required: "Ingrese una direccion valida" }}
          label="Direccion"
          defaultValue={!checkPath() ? "PASEO DE LA COSTA" : ""}
        />
        <CustomTextField
          control={control}
          name="dominio"
          label="Dominio"
          rules={{
            required: "Ingrese una patente valida",
            pattern: {
              value: DOMINIO_PATTERN,
              message: "Ingrese una patente valida",
            },
          }}
        />
        {handleRol() && (
          <CustomTextField
            type="number"
            control={control}
            name="lp"
            rules={{
              required: {
                value: handleRol(),
                message: "Inserte un legajo valido",
              },
              pattern: {
                value: LEGAJO_PATTERN,
                message: "Inserte un legajo valido",
              },
            }}
            label="Legajo planilla"
          />
        )}
        <CustomSelect
          control={control}
          name="resolucion"
          rules={{ required: "Elija una opcion valida" }}
          label="Resolucion"
          options={resolucion}
        />
        {getValues("resolucion") == "ACTA" && (
          <CustomTextField
            type="number"
            control={control}
            name="acta"
            rules={{
              required: {
                value: getValues("resolucion") == "ACTA",
                message: "Ingrese un Nro de Acta valido",
              },
            }}
            label="Acta"
          />
        )}
        <CustomSelect
          control={control}
          name="motivo"
          rules={{ required: "Elija una opcion" }}
          label="Motivo"
          options={motivos}
        />
        {motivos.length > 0 && getMotivo() == "OTRO" && (
          <CustomTextField
            control={control}
            name="otroMotivo"
            rules={{
              required: {
                value: getMotivo() == "OTRO",
                message: "Inserte un motivo valido",
              },
            }}
            label="Otro motivo"
          />
        )}
        <CustomAutocomplete
          control={control}
          name="localidadInfractor"
          rules={{ required: "Elija una opcion" }}
          label="Localidad del infractor"
          options={localidades}
        />
        <div className="buttons">
          <Button onClick={handleClose} color="error" variant="contained">
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(submitting)}
            variant="contained"
          >
            Guardar
          </Button>
        </div>
      </Box>
      <CustomSnackbar res={response} open={open} handleClose={closeSnackbar} />
    </Layout>
  );
}

export default ControlDiarioForm;
