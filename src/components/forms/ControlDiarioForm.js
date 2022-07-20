import React, { useState } from "react";
import {
  getLocalidades,
  getMotivos,
  nuevoControl,
} from "../../services/controlDiarioService";
import { getResolucion, getTurnos } from "../../services/index";
import { selectUser } from "../../redux/userSlice";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  CustomDatePicker,
  CustomTimePicker,
  CustomTextField,
  CustomSelect,
  CustomAutocomplete,
} from "../ui";
import { DOMINIO_PATTERN, LEGAJO_PATTERN, currentDate } from "../../utils";
import Layout from "../../layouts/FormLayout";
import { useSelects } from "../../hooks";

function ControlDiarioForm({ handleClose, afterCreate }) {
  const user = useSelector(selectUser);
  const handleRol = () => user.rol === "ADMIN";
  const {
    handleSubmit,
    control,
    reset,
    getValues,
    watch,
    formState: { isValid },
    setValue,
  } = useForm({
    mode: "all",
    defaultValues: {
      lpcarga: user?.legajo,
      lp: !handleRol() ? user?.legajo : "",
    },
  });
  const {
    data: [localidades, motivos, turnos, resolucion],
    error,
  } = useSelects([
    getLocalidades(),
    getMotivos(),
    getTurnos(),
    getResolucion(),
  ]);
  const [activeStep, setActiveStep] = useState(0);

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
      localidad,
      acta,
      otroMotivo,
    ] = watch([
      "fecha",
      "hora",
      "direccion",
      "turno",
      "dominio",
      "lp",
      "resolucion",
      "motivo",
      "localidad",
      "acta",
      "otroMotivo",
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
          localidad,
          acta,
          otroMotivo,
        },
      },
    ];
  };

  const submitting = async (data) => {
    await nuevoControl(data);
    reset(
      {
        ...data,
        hora: null,
        direccion: "",
        resolucion: null,
        dominio: "",
        localidad: null,
        motivo: null,
        otroMotivo: null,
        acta: null,
      },
      { keepDefaultValues: true }
    );
    if (handleRol()) {
      await afterCreate();
    } else {
      setTimeout(handleClose, 2000);
    }
  };

  const getMotivo = () => {
    return (
      motivos.find((motivo) => motivo.id === getValues("motivo"))?.motivo || ""
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
      error={error}
      path="diario"
      setValue={setValue}
      reset={reset}
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
        <CustomAutocomplete
          control={control}
          name="localidad"
          rules={{ required: "Elija una opcion" }}
          label="Localidad"
          options={localidades}
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
        {getValues("resolucion") === "ACTA" && (
          <CustomTextField
            type="number"
            control={control}
            name="acta"
            rules={{
              required: {
                value: getValues("resolucion") === "ACTA",
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
        {motivos?.length > 0 && getMotivo() === "OTRO" && (
          <CustomTextField
            control={control}
            name="otroMotivo"
            rules={{
              required: {
                value: getMotivo() === "OTRO",
                message: "Inserte un motivo valido",
              },
            }}
            label="Otro motivo"
          />
        )}
      </>
    </Layout>
  );
}

export default ControlDiarioForm;
