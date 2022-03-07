import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
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
import { adminStyle } from "../utils";
import style from "../../styles/controlDiarioForm.module.css";
import { useForm } from "react-hook-form";
import CustomTextField from "../ui/CustomTextField";
import CustomSelect from "../ui/CustomSelect";
import CustomAutocomplete from "../ui/CustomAutocomplete";
import CustomSnackbar from "../ui/CustomSnackbar";

function MotosForm({ handleClose, afterCreate }) {
  const user = useSelector(selectUser);
  const { handleSubmit, control, reset, getValues, setValue } = useForm();
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

  const fillSelects = async () => {
    setLicencias(await getLicencias());
    setZonasVL(await getZonasVL());
    setAllZonas(await getAllZonas());
    setTurnos(await getTurnos());
    setSeguridad(await getSeguridad());
    setResolucion(await getResolucion());
    setMotivos(await getMotivosMoto());
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
      setValue("lpcarga", user.legajo);
      await nuevoOperativoMoto(data);
      await afterCreate();
      reset();
      showSnackbar("success", "Cargado con exito");
    } catch (error) {
      showSnackbar("error", error.response.data);
    }
  };

  const setBarrios = () => {
    return [
      ...new Map(
        allZonas.map((localidad) => [localidad.barrio, localidad])
      ).values(),
    ];
  };

  useEffect(() => {
    fillSelects();
  }, []);

  return (
    <Box sx={adminStyle} className="form">
      <div className={style.header}>
        <Image
          className={style.logo}
          src={LogoVL}
          width={250}
          height={70}
          layout="fixed"
        />
        <Image
          className={style.logo}
          src={LogoOVT}
          width={150}
          height={70}
          layout="fixed"
        />
      </div>
      <div className="controller">
        <h4>Motivos: {cantMotivos}</h4>
        <AddBoxSharpIcon onClick={sumarMotivos} />
        <IndeterminateCheckBoxSharpIcon onClick={restarMotivos} />
      </div>
      <Box component="form" className="form__box op" autoComplete="off">
        <DateTimePicker control={control} name="fecha" label="Fecha" />
        <TimePicker control={control} name="hora" label="Hora" />
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
          options={turnos}
        />
        <CustomSelect
          control={control}
          name="seguridad"
          label="Seguridad"
          options={seguridad}
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
          options={setBarrios()}
        />
        <CustomSelect
          control={control}
          name="resolucion"
          label="Resolucion"
          rules={{ required: "Elija una opcion valida" }}
          options={resolucion}
        />
        {getValues("resolucion") === "ACTA" && (
          <CustomTextField control={control} name="acta" label="Acta" />
        )}
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

        <div className="buttons">
          <Button onClick={handleClose} color="error" variant="contained">
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(submitEvent)}
            variant="contained"
          >
            Guardar
          </Button>
        </div>
      </Box>
      <CustomSnackbar res={response} open={open} handleClose={closeSnackbar} />
    </Box>
  );
}

export default MotosForm;
