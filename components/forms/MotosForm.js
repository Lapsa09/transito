import React, { useState } from "react";
import DateTimePicker from "../ui/DatePicker";
import TimePicker from "../ui/TimePicker";
import {
  getAllZonas,
  getLicencias,
  getMotivosMoto,
  getSeguridad,
  getZonasVL,
  nuevoOperativoMoto,
} from "../../services/operativosService";
import { getResolucion, getTurnos } from "../../services/index";
import { DOMINIO_PATTERN, LEGAJO_PATTERN } from "../../utils/validations";
import { useSelector } from "react-redux";
import { selectUser } from "../../utils/redux/userSlice";
import AddBoxSharpIcon from "@mui/icons-material/AddBoxSharp";
import IndeterminateCheckBoxSharpIcon from "@mui/icons-material/IndeterminateCheckBoxSharp";
import { useForm } from "react-hook-form";
import CustomTextField from "../ui/CustomTextField";
import CustomSelect from "../ui/CustomSelect";
import CustomAutocomplete from "../ui/CustomAutocomplete";
import CustomSnackbar from "../ui/CustomSnackbar";
import Layout from "../../layouts/FormLayout";
import { currentDate } from "../../utils/dates";

function MotosForm({ handleClose, afterCreate }) {
  const user = useSelector(selectUser);
  const {
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    watch,
    formState: { isValid },
  } = useForm({ mode: "all" });
  const [licencias, setLicencias] = useState([]);
  const [zonasVL, setZonasVL] = useState([]);
  const [allZonas, setAllZonas] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [seguridad, setSeguridad] = useState([]);
  const [resolucion, setResolucion] = useState([]);
  const [motivos, setMotivos] = useState([]);
  const [cantMotivos, setCantMotivos] = useState(1);
  const [response, setResponse] = useState("");
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const handleRol = () => user?.rol === "ADMIN";

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

  const fillSelects = async () => {
    try {
      const [
        licencias,
        zonasVL,
        allZonas,
        turnos,
        seguridad,
        resolucion,
        motivos,
      ] = await Promise.all([
        getLicencias(),
        getZonasVL(),
        getAllZonas(),
        getTurnos(),
        getSeguridad(),
        getResolucion(),
        getMotivosMoto(),
      ]);

      setLicencias(licencias);
      setZonasVL(zonasVL);
      setAllZonas(allZonas);
      setTurnos(turnos);
      setSeguridad(seguridad);
      setResolucion(resolucion);
      setMotivos(motivos);
    } catch (error) {
      showSnackbar("error", error.response?.data);
    } finally {
      setValue("lpcarga", user.legajo);
    }
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

  const sumarMotivos = () => {
    if (cantMotivos < 5) {
      setCantMotivos(cantMotivos + 1);
    }
  };

  const restarMotivos = () => {
    if (cantMotivos > 1) {
      setCantMotivos(cantMotivos - 1);
    }
  };

  const submitEvent = async (data) => {
    try {
      await nuevoOperativoMoto(data);
      await afterCreate();
      showSnackbar("success", "Cargado con exito");
      reset({
        ...data,
      });
    } catch (error) {
      showSnackbar("error", error.response?.data);
    }
  };

  return (
    <>
      <Layout
        fillSelects={fillSelects}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        handleSubmit={handleSubmit(submitEvent)}
        isValid={isValid}
        path="motos"
        steps={steps()}
        handleClose={handleClose}
      >
        <>
          <DateTimePicker
            control={control}
            name="fecha"
            label="Fecha"
            disabled={!handleRol()}
            defaultValue={!handleRol() ? currentDate() : null}
          />
          <TimePicker
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
            <h4>Motivos: {cantMotivos}</h4>
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
          <CustomSelect
            control={control}
            name="motivo1"
            label="Motivo 1"
            rules={{ required: "Elija un motivo valido" }}
            options={motivos}
          />
          {cantMotivos >= 2 && (
            <CustomSelect
              control={control}
              name="motivo2"
              label="Motivo 2"
              rules={{
                required: {
                  value: cantMotivos >= 2,
                  message: "Elija un motivo valido",
                },
              }}
              options={motivos}
            />
          )}
          {cantMotivos >= 3 && (
            <CustomSelect
              control={control}
              name="motivo3"
              label="Motivo 3"
              rules={{
                required: {
                  value: cantMotivos >= 3,
                  message: "Elija un motivo valido",
                },
              }}
              options={motivos}
            />
          )}
          {cantMotivos >= 4 && (
            <CustomSelect
              control={control}
              name="motivo4"
              label="Motivo 4"
              rules={{
                required: {
                  value: cantMotivos >= 4,
                  message: "Elija un motivo valido",
                },
              }}
              options={motivos}
            />
          )}
          {cantMotivos === 5 && (
            <CustomSelect
              control={control}
              name="motivo5"
              label="Motivo 5"
              rules={{
                required: {
                  value: cantMotivos >= 5,
                  message: "Elija un motivo valido",
                },
              }}
              options={motivos}
            />
          )}
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

export default MotosForm;
