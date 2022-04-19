import React, { useState } from "react";
import {
  getAllZonas,
  getLicencias,
  getSeguridad,
  getZonasVL,
  nuevoOperativoAuto,
} from "../../services/operativosService";
import { getResolucion, getTurnos } from "../../services/index";
import { DOMINIO_PATTERN, LEGAJO_PATTERN, currentDate } from "../../utils";
import { useSelector } from "react-redux";
import {
  CustomDatePicker,
  CustomTimePicker,
  CustomTextField,
  CustomSelect,
  CustomAutocomplete,
} from "../ui";
import { selectUser } from "../../redux/userSlice";
import { useForm } from "react-hook-form";
import Layout from "../../layouts/FormLayout";
import { useSelects } from "../../hooks";

function OperativosForm({ handleClose, afterCreate }) {
  const user = useSelector(selectUser);
  const handleRol = () => user?.rol === "ADMIN";
  const {
    handleSubmit,
    control,
    reset,
    getValues,
    watch,
    formState: { isValid },
  } = useForm({
    mode: "all",
    defaultValues: { lpcarga: user.legajo },
  });
  const [activeStep, setActiveStep] = useState(0);
  const {
    data: [licencias, zonasVL, allZonas, turnos, seguridad, resolucion],
    error,
  } = useSelects([
    getLicencias(),
    getZonasVL(),
    getAllZonas(),
    getTurnos(),
    getSeguridad(),
    getResolucion(),
  ]);

  const steps = () => {
    const [
      legajo_a_cargo,
      legajo_planilla,
      seguridad,
      hora,
      dominio,
      direccion,
      zona,
      zona_infractor,
      resolucion,
      motivo,
      fecha,
      turno,
    ] = watch([
      "legajo_a_cargo",
      "legajo_planilla",
      "seguridad",
      "hora",
      "dominio",
      "direccion",
      "zona",
      "zona_infractor",
      "resolucion",
      "motivo",
      "fecha",
      "turno",
    ]);
    return [
      {
        label: "Operativo",
        values: {
          legajo_a_cargo,
          legajo_planilla,
          seguridad,
          fecha,
          turno,
          direccion,
          zona,
        },
      },
      {
        label: "Vehiculo",
        values: {
          hora,
          dominio,
          zona_infractor,
          resolucion,
          motivo,
        },
      },
    ];
  };

  const submitEvent = async (data) => {
    await nuevoOperativoAuto(data);
    await afterCreate();
    reset(
      {
        dominio: "",
        zona_infractor: null,
        resolucion: "",
        motivo: "",
        licencia: "",
        tipo_licencia: null,
        graduacion_alcoholica: "",
        acta: "",
        lpcarga: user.legajo,
      },
      { keepDefaultValues: true }
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
      submitEvent={submitEvent}
      error={error}
      path="autos"
    >
      <>
        <CustomDatePicker
          control={control}
          name="fecha"
          disabled={!handleRol()}
          label="Fecha"
          defaultValue={!handleRol() ? currentDate() : null}
        />
        <CustomTextField
          control={control}
          name="legajo_a_cargo"
          type="number"
          label="Legajo a cargo"
          rules={{
            required: "Inserte un legajo",
            pattern: {
              value: LEGAJO_PATTERN,
              message: "Inserte un legajo valido",
            },
          }}
        />
        <CustomTextField
          control={control}
          type="number"
          name="legajo_planilla"
          label="Legajo planilla"
          rules={{
            required: "Inserte un legajo",
            pattern: {
              value: LEGAJO_PATTERN,
              message: "Inserte un legajo valido",
            },
          }}
        />
        <CustomSelect
          control={control}
          name="turno"
          label="Turno"
          rules={{ required: "Elija una opcion" }}
          disabled={!handleRol()}
          options={turnos}
          defaultValue={!handleRol() ? user.turno : null}
        />
        <CustomSelect
          control={control}
          name="seguridad"
          label="Seguridad"
          options={seguridad}
          rules={{ required: "Elija una opcion" }}
        />
        <CustomTextField
          control={control}
          name="direccion"
          label="Direccion"
          rules={{ required: "Inserte una direccion valida" }}
        />
        <CustomSelect
          control={control}
          name="zona"
          label="Zona"
          rules={{ required: "Elija una localidad" }}
          options={zonasVL}
        />
      </>
      <>
        <CustomTimePicker
          control={control}
          name="hora"
          disabled={!handleRol()}
          label="Hora"
          defaultValue={!handleRol() ? currentDate() : null}
        />
        <CustomTextField
          control={control}
          name="dominio"
          label="Dominio"
          rules={{
            required: "Inserte una patente",
            pattern: {
              value: DOMINIO_PATTERN,
              message: "Inserte una patente valida",
            },
          }}
        />
        <CustomTextField
          type="number"
          control={control}
          name="licencia"
          label="Licencia"
        />
        <CustomSelect
          control={control}
          name="tipo_licencia"
          label="Tipo de licencia"
          options={licencias}
        />
        <CustomAutocomplete
          control={control}
          name="zona_infractor"
          rules={{ required: "Elija una opcion" }}
          label="Localidad del infractor"
          options={allZonas}
        />
        <CustomTextField
          control={control}
          name="motivo"
          label="Motivo"
          rules={{ required: "Inserte un motivo" }}
        />
        <CustomTextField
          type="number"
          control={control}
          name="graduacion_alcoholica"
          label="Graduacion alcoholica"
        />
        <CustomSelect
          control={control}
          name="resolucion"
          label="Resolucion"
          rules={{ required: "Elija una opcion valida" }}
          options={resolucion}
        />
        {getValues("resolucion") === "ACTA" && (
          <CustomTextField
            type="number"
            control={control}
            name="acta"
            label="Acta"
            rules={{
              required: {
                value: getValues("resolucion") === "ACTA",
                message: "Ingrese un nro de acta",
              },
            }}
          />
        )}
      </>
    </Layout>
  );
}

export default OperativosForm;
