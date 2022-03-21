import React, { useState } from "react";
import {
  getLocalidades,
  getMotivos,
  nuevoControl,
} from "../../services/controlDiarioService";
import { getResolucion, getTurnos } from "../../services/index";
import CustomDatePicker from "../ui/DatePicker";
import CustomTimePicker from "../ui/TimePicker";
import CustomSnackbar from "../ui/CustomSnackbar";
import { selectUser } from "../../utils/redux/userSlice";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import CustomTextField from "../ui/CustomTextField";
import CustomSelect from "../ui/CustomSelect";
import CustomAutocomplete from "../ui/CustomAutocomplete";
import { DOMINIO_PATTERN, LEGAJO_PATTERN } from "../../utils/validations";
import Layout from "../../layouts/FormLayout";
import { currentDate } from "../../utils/dates";

function ControlDiarioForm({ handleClose, afterCreate }) {
  const {
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    watch,
    formState: { isValid },
  } = useForm({ mode: "all" });
  const [resolucion, setResolucion] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [motivos, setMotivos] = useState([]);
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState({ severity: "", message: "" });
  const [activeStep, setActiveStep] = useState(0);
  const user = useSelector(selectUser);
  const handleRol = () => user.rol === "ADMIN";

  const steps = () => {
    const [
      fecha,
      hora,
      direccion,
      turno,
      dominio,
      lp,
      resolucion,
      motivo,
      localidadInfractor,
    ] = watch([
      "fecha",
      "hora",
      "direccion",
      "turno",
      "dominio",
      "lp",
      "resolucion",
      "motivo",
      "localidadInfractor",
    ]);
    return [
      {
        label: "Operativo",
        values: {
          fecha,
          turno,
          lp,
        },
      },
      {
        label: "Vehiculo",
        values: {
          hora,
          dominio,
          direccion,
          resolucion,
          motivo,
          localidadInfractor,
        },
      },
    ];
  };

  const submitting = async (data) => {
    try {
      await nuevoControl(data);
      reset(
        { ...data, dominio: "", localidadInfractor: null, motivo: "" },
        { keepDefaultValues: true }
      );
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

  const fillSelects = async () => {
    try {
      const [barrios, motivos, turnos, resoluciones] = await Promise.all([
        getLocalidades(),
        getMotivos(),
        getTurnos(),
        getResolucion(),
      ]);
      setLocalidades(barrios);
      setMotivos(motivos);
      setTurnos(turnos);
      setResolucion(resoluciones);
    } catch (error) {
      showSnackbar("error", error.response?.data);
    } finally {
      setValue("lpcarga", user.legajo);
      if (!handleRol()) setValue("lp", user.legajo);
    }
  };

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
    <>
      <Layout
        steps={steps()}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        handleClose={handleClose}
        isValid={isValid}
        handleSubmit={handleSubmit(submitting)}
        fillSelects={fillSelects}
        path="diario"
      >
        <>
          <CustomDatePicker
            control={control}
            label="Fecha"
            name="fecha"
            defaultValue={!handleRol() ? currentDate() : null}
            disabled={!handleRol()}
          />

          <CustomSelect
            control={control}
            name="turno"
            rules={{ required: "Elija una opcion" }}
            label="Turno"
            defaultValue={!handleRol() ? user.turno : ""}
            disabled={!handleRol()}
            options={turnos}
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
        </>
        <>
          <CustomTimePicker
            control={control}
            name="hora"
            label="Hora"
            defaultValue={!handleRol() ? currentDate() : null}
            disabled={!handleRol()}
          />
          <CustomTextField
            control={control}
            name="direccion"
            rules={{ required: "Ingrese una direccion valida" }}
            label="Direccion"
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
        </>
      </Layout>
      <CustomSnackbar res={response} open={open} handleClose={closeSnackbar} />
    </>
  );
}

export default ControlDiarioForm;
