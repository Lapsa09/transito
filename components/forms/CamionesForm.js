import React, { useState } from "react";
import DateTimePicker from "../ui/DatePicker";
import TimePicker from "../ui/TimePicker";
import {
  getAllZonas,
  getZonasVL,
  nuevoOperativoCamiones,
} from "../../services/operativosService";
import { getResolucion, getTurnos } from "../../services/index";
import { DOMINIO_PATTERN, LEGAJO_PATTERN } from "../../utils/validations";
import { useSelector } from "react-redux";
import { selectUser } from "../../utils/redux/userSlice";
import CustomTextField from "../ui/CustomTextField";
import CustomSelect from "../ui/CustomSelect";
import { useForm } from "react-hook-form";
import CustomAutocomplete from "../ui/CustomAutocomplete";
import CustomSwitch from "../ui/CustomSwitch";
import CustomSnackbar from "../ui/CustomSnackbar";
import Layout from "../../layouts/FormLayout";
import { currentDate } from "../../utils/dates";

function OperativosForm({ handleClose, afterCreate }) {
  const user = useSelector(selectUser);
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
  const [zonasVL, setZonasVL] = useState([]);
  const [allZonas, setAllZonas] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [resolucion, setResolucion] = useState([]);
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const handleRol = () => user?.rol === "ADMIN";

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
    try {
      await nuevoOperativoCamiones(data);
      reset({}, { keepDefaultValues: true });
      showSnackbar("success", "Cargado con exito");
      await afterCreate();
    } catch (error) {
      showSnackbar("error", error.response?.data);
    }
  };

  const fillSelects = async () => {
    try {
      const [zonasVL, zonas, turnos, resoluciones] = await Promise.all([
        getZonasVL(),
        getAllZonas(),
        getTurnos(),
        getResolucion(),
      ]);
      setZonasVL(zonasVL);
      setAllZonas(zonas);
      setTurnos(turnos);
      setResolucion(resoluciones);
    } catch (error) {
      showSnackbar("error", error.response?.data);
    } finally {
      setValue("lpcarga", user.legajo);
    }
  };

  return (
    <>
      <Layout
        fillSelects={fillSelects}
        steps={steps()}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        handleClose={handleClose}
        isValid={isValid}
        handleSubmit={handleSubmit(submitEvent)}
        path="camiones"
      >
        <>
          <DateTimePicker
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
          <TimePicker
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
          <CustomTextField
            control={control}
            name="origen"
            label="Origen"
            rules={{ required: "Inserte una direccion valida" }}
          />
          <CustomAutocomplete
            control={control}
            name="localidad_origen"
            label="Localidad de origen"
            rules={{ required: "Elija una opcion" }}
            options={allZonas}
          />
          <CustomTextField
            control={control}
            name="destino"
            label="Destino"
            rules={{ required: "Inserte una direccion valida" }}
          />
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
          <CustomTextField
            control={control}
            name="motivo"
            label="Motivo"
            rules={{ required: "Inserte un motivo valido" }}
          />
          <CustomSelect
            control={control}
            name="resolucion"
            label="Resolucion"
            rules={{ required: "Elija una opcion valida" }}
            options={resolucion}
          />
        </>
      </Layout>
      <CustomSnackbar res={response} open={open} handleClose={closeSnackbar} />
    </>
  );
}

export default OperativosForm;
