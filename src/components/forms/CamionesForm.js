import React, { useState } from "react";
import {
  getAllZonas,
  getZonasVL,
  nuevoOperativoCamiones,
  getMotivos,
} from "../../services/operativosService";
import { getResolucion, getTurnos } from "../../services/index";
import { DOMINIO_PATTERN, LEGAJO_PATTERN, currentDate } from "../../utils";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";
import { useForm } from "react-hook-form";
import {
  CustomDatePicker,
  CustomTimePicker,
  CustomTextField,
  CustomSelect,
  CustomAutocomplete,
  CustomSwitch,
} from "../ui";
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
    setValue,
    formState: { isValid },
  } = useForm({
    mode: "all",
    defaultValues: { lpcarga: user?.legajo },
  });
  const {
    data: [zonasVL, allZonas, turnos, resolucion, motivos],
    error,
  } = useSelects([
    getZonasVL(),
    getAllZonas(),
    getTurnos(),
    getResolucion(),
    getMotivos(),
  ]);
  const [activeStep, setActiveStep] = useState(0);

  const steps = () => {
    const [
      fecha,
      legajo,
      direccion,
      zona,
      turno,
      hora,
      dominio,
      licencia,
      origen,
      localidad_origen,
      destino,
      localidad_destino,
      remito,
      carga,
      acta,
      motivo,
      resolucion,
    ] = watch([
      "fecha",
      "legajo",
      "direccion",
      "zona",
      "turno",
      "hora",
      "dominio",
      "licencia",
      "origen",
      "localidad_origen",
      "destino",
      "localidad_destino",
      "remito",
      "carga",
      "acta",
      "motivo",
      "resolucion",
    ]);

    return [
      {
        label: "Operativo",
        values: {
          fecha,
          legajo,
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
          licencia,
          origen,
          localidad_origen,
          destino,
          localidad_destino,
          remito,
          carga,
          acta,
          motivo,
          resolucion,
        },
      },
    ];
  };

  const submitEvent = async (data) => {
    await nuevoOperativoCamiones(data);
    await afterCreate();
    reset(
      {
        ...data,
        hora: null,
        dominio: null,
        licencia: "",
        origen: null,
        localidad_origen: null,
        destino: null,
        localidad_destino: "",
        remito: false,
        carga: false,
        motivo: null,
        resolucion: null,
      },
      { keepDefaultValues: true }
    );
  };

  return (
    <Layout
      error={error}
      steps={steps()}
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      handleClose={handleClose}
      isValid={isValid}
      handleSubmit={handleSubmit}
      submitEvent={submitEvent}
      path="camiones"
      setValue={setValue}
    >
      <>
        <CustomDatePicker
          control={control}
          name="fecha"
          label="Fecha"
          disabled={!handleRol()}
          defaultValue={!handleRol() ? currentDate() : null}
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
          rules={{ required: "Inserte una localidad" }}
          options={zonasVL}
        />
        <CustomTextField
          type="number"
          control={control}
          name="legajo"
          label="Legajo"
          rules={{
            required: "Inserte un legajo valido",
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
          options={turnos}
        />
      </>
      <>
        <CustomTimePicker
          control={control}
          name="hora"
          label="Hora"
          disabled={!handleRol()}
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
        <CustomTextField control={control} name="licencia" label="Licencia" />
        <CustomTextField control={control} name="origen" label="Origen" />
        <CustomAutocomplete
          control={control}
          name="localidad_origen"
          label="Localidad de origen"
          rules={{ required: "Elija una opcion" }}
          options={allZonas}
        />
        <CustomTextField control={control} name="destino" label="Destino" />
        <CustomAutocomplete
          control={control}
          name="localidad_destino"
          label="Localidad de destino"
          rules={{ required: "Elija una opcion" }}
          options={allZonas}
        />
        <div className="switches">
          <CustomSwitch control={control} name="remito" label="Remito" />
          <CustomSwitch control={control} name="carga" label="Carga" />
        </div>
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
        <CustomSelect
          control={control}
          name="resolucion"
          label="Resolucion"
          rules={{ required: "Elija una opcion valida" }}
          options={resolucion}
        />
        {(getValues("resolucion") === "ACTA" ||
          getValues("resolucion") === "REMITIDO") && (
          <CustomSelect
            control={control}
            name="motivo"
            label="Motivo"
            options={motivos}
            rules={{ required: "Inserte un motivo valido" }}
          />
        )}
      </>
    </Layout>
  );
}

export default OperativosForm;
