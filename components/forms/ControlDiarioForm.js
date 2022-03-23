import React, { useState } from "react";
import {
  getLocalidades,
  getMotivos,
  nuevoControl,
} from "../../services/controlDiarioService";
import { getResolucion, getTurnos } from "../../services/index";
import CustomDatePicker from "../ui/DatePicker";
import CustomTimePicker from "../ui/TimePicker";
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
    await nuevoControl(data);
    reset(
      { ...data, dominio: "", localidadInfractor: null, motivo: "" },
      { keepDefaultValues: true }
    );
    if (handleRol()) {
      await afterCreate();
    } else {
      setTimeout(handleClose, 2000);
    }
  };

  const fillSelects = async () => {
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
    setValue("lpcarga", user.legajo);
    if (!handleRol()) setValue("lp", user.legajo);
  };

  const getMotivo = () => {
    return (
      motivos.find((motivo) => motivo.id == getValues("motivo"))?.motivo || ""
    );
  };

  return (
    <Layout
      steps={steps()}
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      handleClose={handleClose}
      isValid={isValid}
      handleSubmit={handleSubmit}
      submitEvent={submitting}
      fillSelectsEvent={fillSelects}
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
  );
}

export default ControlDiarioForm;
