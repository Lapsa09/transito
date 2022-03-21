import React, { useEffect, useState } from "react";
import DateTimePicker from "../ui/DatePicker";
import TimePicker from "../ui/TimePicker";
import {
  getAllZonas,
  getLicencias,
  getSeguridad,
  getZonasVL,
  nuevoOperativoAuto,
} from "../../services/operativosService";
import { getResolucion, getTurnos } from "../../services/index";
import { DOMINIO_PATTERN, LEGAJO_PATTERN } from "../../utils/validations";
import { useSelector } from "react-redux";
import { selectUser } from "../../utils/redux/userSlice";
import { useForm } from "react-hook-form";
import CustomTextField from "../ui/CustomTextField";
import CustomSelect from "../ui/CustomSelect";
import CustomAutocomplete from "../ui/CustomAutocomplete";
import CustomSnackbar from "../ui/CustomSnackbar";
import Layout from "../../layouts/FormLayout";
import { currentDate } from "../../utils/dates";

function OperativosForm({ handleClose, afterCreate }) {
  const {
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    watch,
    formState: { isValid },
  } = useForm({
    mode: "all",
  });
  const user = useSelector(selectUser);
  const [licencias, setLicencias] = useState([]);
  const [zonasVL, setZonasVL] = useState([]);
  const [allZonas, setAllZonas] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [seguridad, setSeguridad] = useState([]);
  const [resolucion, setResolucion] = useState([]);
  const [response, setResponse] = useState({ severity: "", message: "" });
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const handleRol = () => user?.rol === "ADMIN";

  const showSnackbar = (severity, message) => {
    setResponse({ severity, message });
    setOpen(true);
  };

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

  const closeSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const submitEvent = async (data) => {
    try {
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
      showSnackbar("success", "Cargado con exito");
    } catch (error) {
      showSnackbar("error", error.response?.data);
    }
  };

  const fetchItems = async () => {
    try {
      const [licencias, zonasVL, zonas, turnos, seguridad, resolucion] =
        await Promise.all([
          getLicencias(),
          getZonasVL(),
          getAllZonas(),
          getTurnos(),
          getSeguridad(),
          getResolucion(),
        ]);

      setLicencias(licencias);
      setZonasVL(zonasVL);
      setAllZonas(zonas);
      setTurnos(turnos);
      setSeguridad(seguridad);
      setResolucion(resolucion);
    } catch (error) {
      showSnackbar("error", error.response?.data || error.message);
    } finally {
      setValue("lpcarga", user.legajo);
    }
  };

  return (
    <>
      <Layout
        steps={steps()}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        handleClose={handleClose}
        isValid={isValid}
        handleSubmit={handleSubmit(submitEvent)}
        fillSelects={fetchItems}
        path="autos"
      >
        <>
          <DateTimePicker
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
          <TimePicker
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
      <CustomSnackbar res={response} open={open} handleClose={closeSnackbar} />
    </>
  );
}

export default OperativosForm;
