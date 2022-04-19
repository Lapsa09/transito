import React, { useState } from "react";
import {
  getAllZonas,
  getLicencias,
  getMotivosMoto,
  getSeguridad,
  getZonasVL,
  nuevoOperativoMoto,
} from "../../services/operativosService";
import {
  CustomDatePicker,
  CustomTimePicker,
  CustomTextField,
  CustomSelect,
  CustomAutocomplete,
} from "../ui";
import { getResolucion, getTurnos } from "../../services/index";
import { DOMINIO_PATTERN, LEGAJO_PATTERN, currentDate } from "../../utils";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";
import AddBoxSharpIcon from "@mui/icons-material/AddBoxSharp";
import IndeterminateCheckBoxSharpIcon from "@mui/icons-material/IndeterminateCheckBoxSharp";
import { useForm, useFieldArray } from "react-hook-form";
import Layout from "../../layouts/FormLayout";
import { useSelects } from "../../hooks";

function MotosForm({ handleClose, afterCreate }) {
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
    defaultValues: {
      motivos: [{ motivo: null }],
      lpcarga: user.legajo,
    },
  });
  const { append, remove, fields } = useFieldArray({
    control,
    name: "motivos",
  });
  const {
    data: [
      licencias,
      zonasVL,
      allZonas,
      turnos,
      seguridad,
      resolucion,
      motivos,
    ],
    error,
  } = useSelects([
    getLicencias(),
    getZonasVL(),
    getAllZonas(),
    getTurnos(),
    getSeguridad(),
    getResolucion(),
    getMotivosMoto(),
  ]);
  const [activeStep, setActiveStep] = useState(0);

  const steps = () => {
    const [
      fecha,
      hora,
      direccion,
      zona,
      legajo_a_cargo,
      legajo_planilla,
      turno,
      seguridad,
      dominio,
      licencia,
      tipo_licencia,
      zona_infractor,
      resolucion,
      acta,
      motivo1,
      motivo2,
      motivo3,
      motivo4,
      motivo5,
    ] = watch([
      "fecha",
      "hora",
      "direccion",
      "zona",
      "legajo_a_cargo",
      "legajo_planilla",
      "turno",
      "seguridad",
      "dominio",
      "licencia",
      "tipo_licencia",
      "zona_infractor",
      "resolucion",
      "acta",
      "motivo1",
      "motivo2",
      "motivo3",
      "motivo4",
      "motivo5",
    ]);

    return [
      {
        label: "Operativo",
        values: {
          fecha,
          hora,
          direccion,
          zona,
          legajo_a_cargo,
          legajo_planilla,
          turno,
          seguridad,
        },
      },
      {
        label: "Vehiculo",
        values: {
          dominio,
          licencia,
          tipo_licencia,
          zona_infractor,
          resolucion,
          acta,
          motivo1,
          motivo2,
          motivo3,
          motivo4,
          motivo5,
        },
      },
    ];
  };

  const sumarMotivos = () => {
    if (fields.length < 5) {
      append({ motivo: null });
    }
  };

  const restarMotivos = () => {
    if (fields.length > 1) {
      remove(fields.at(-1));
    }
  };

  const submitEvent = async (data) => {
    await nuevoOperativoMoto(data);
    await afterCreate();
    reset(
      {
        dominio: "",
        licencia: "",
        tipo_licencia: null,
        zona_infractor: null,
        motivos: [{ motivo: null }],
        resolucion: null,
        acta: "",
      },
      { keepDefaultValues: true }
    );
  };

  return (
    <Layout
      error={error}
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      handleSubmit={handleSubmit}
      submitEvent={submitEvent}
      isValid={isValid}
      path="motos"
      steps={steps()}
      handleClose={handleClose}
    >
      <>
        <CustomDatePicker
          control={control}
          name="fecha"
          label="Fecha"
          disabled={!handleRol()}
          defaultValue={!handleRol() ? currentDate() : null}
        />
        <CustomTimePicker
          control={control}
          name="hora"
          label="Hora"
          disabled={!handleRol()}
          defaultValue={!handleRol() ? currentDate() : null}
        />
        <CustomTextField
          control={control}
          name="direccion"
          label="Direccion"
          rules={{ required: "Ingrese una direccion valida" }}
        />
        <CustomSelect
          control={control}
          name="zona"
          label="Zona"
          rules={{ required: "Elija una localidad" }}
          options={zonasVL}
        />
        <CustomTextField
          control={control}
          type="number"
          name="legajo_a_cargo"
          label="Legajo a cargo"
          rules={{
            required: "Ingrese un legajo valido",
            pattern: {
              value: LEGAJO_PATTERN,
              message: "Ingrese un legajo valido",
            },
          }}
        />
        <CustomTextField
          control={control}
          type="number"
          name="legajo_planilla"
          label="Legajo planilla"
          rules={{
            required: "Ingrese un legajo valido",
            pattern: {
              value: LEGAJO_PATTERN,
              message: "Ingrese un legajo valido",
            },
          }}
        />
        <CustomSelect
          control={control}
          name="turno"
          label="Turno"
          rules={{ required: "Elija una opcion" }}
          disabled={!handleRol()}
          defaultValue={!handleRol() ? user.turno : null}
          options={turnos}
        />
        <CustomSelect
          control={control}
          name="seguridad"
          label="Seguridad"
          options={seguridad}
          rules={{ required: "Elija una opcion" }}
        />
      </>
      <>
        <div className="controller">
          <h4>Motivos: {fields.length}</h4>
          <AddBoxSharpIcon onClick={sumarMotivos} />
          <IndeterminateCheckBoxSharpIcon onClick={restarMotivos} />
        </div>
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
        <CustomTextField
          control={control}
          type="number"
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
          label="Localidad del infractor"
          rules={{ required: "Elija una opcion" }}
          options={allZonas}
        />
        {fields.map((item, index) => (
          <CustomSelect
            control={control}
            key={item.id}
            name={`motivos.${index}.motivo`}
            label={`Motivo ${index + 1}`}
            rules={{ required: "Elija un motivo valido" }}
            options={motivos}
          />
        ))}
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

export default MotosForm;
