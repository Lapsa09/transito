import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import DateTimePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import {
  getAllZonas,
  getLicencias,
  getSeguridad,
  getZonasVL,
  nuevoOperativoAuto,
} from "../services/operativosService";
import { getResolucion, getTurnos } from "../services/index";
import { DOMINIO_PATTERN, LEGAJO_PATTERN } from "../utils/validations";
import { useSelector } from "react-redux";
import { selectUser } from "../utils/redux/userSlice";
import { useForm } from "react-hook-form";
import CustomTextField from "./CustomTextField";
import CustomSelect from "./CustomSelect";
import CustomAutocomplete from "./CustomAutocomplete";
import CustomSnackbar from "./CustomSnackbar";
import LogoVL from "../public/LOGO_V_LOPEZ.png";
import LogoOVT from "../public/OVT_LETRAS_NEGRAS.png";
import Image from "next/image";
import { adminStyle } from "./utils";
import style from "../styles/controlDiarioForm.module.css";

function OperativosForm({ handleClose, afterCreate }) {
  const user = useSelector(selectUser);
  const { handleSubmit, control, reset, getValues, setValue } = useForm();
  const [licencias, setLicencias] = useState([]);
  const [zonasVL, setZonasVL] = useState([]);
  const [allZonas, setAllZonas] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [seguridad, setSeguridad] = useState([]);
  const [resolucion, setResolucion] = useState([]);
  const [autoCompleter, setAutoCompleter] = useState(null);
  const [response, setResponse] = useState("");
  const [open, setOpen] = useState(false);

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

  const submitEvent = async (data) => {
    try {
      setValue("lpcarga", user.legajo);
      setValue("es_del", findMunicipio());
      setValue("resultado", handleResultado());
      await nuevoOperativoAuto(data);
      await afterCreate();
      reset({
        ...data,
        dominio: "",
        direccion: "",
        zona_infractor: "",
        resolucion: "",
        motivo: "",
      });
      setAutoCompleter(null);
      showSnackbar("success", "Cargado con exito");
    } catch (error) {
      showSnackbar("error", error.response.data);
    }
  };

  const findMunicipio = () => {
    const zona = allZonas.find(
      (zona) => zona.id_barrio === getValues("zona_infractor")
    ).barrio;
    const zonas = zonasVL.map((zona) => zona.barrio);
    if (zonas.includes(zona)) return "VILO";
    else return "FUERA DEL MUNICIPIO";
  };

  const handleResultado = () => {
    if (
      getValues("graduacion_alcoholica") == 0 ||
      getValues("graduacion_alcoholica") == ""
    )
      return "NEGATIVA";
    if (
      getValues("graduacion_alcoholica") > 0.05 &&
      getValues("graduacion_alcoholica") < 0.5
    )
      return "NO PUNITIVA";
    return "PUNITIVA";
  };

  const setBarrios = () => {
    return [
      ...new Map(
        allZonas.map((localidad) => [localidad.barrio, localidad])
      ).values(),
    ];
  };

  useEffect(() => {
    Promise.all([
      getLicencias(),
      getZonasVL(),
      getAllZonas(),
      getTurnos(),
      getSeguridad(),
      getResolucion(),
    ])
      .then(([licencias, zonasVL, zonas, turnos, seguridad, resolucion]) => {
        setLicencias(licencias);
        setZonasVL(zonasVL);
        setAllZonas(zonas);
        setTurnos(turnos);
        setSeguridad(seguridad);
        setResolucion(resolucion);
      })
      .catch((error) => {
        showSnackbar("error", error.message);
      });
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
      <Box component="form" className="form__box op" autoComplete="off">
        <DateTimePicker control={control} name="fecha" label="Fecha" />
        <TimePicker control={control} name="hora" label="Hora" />
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
        <CustomTextField
          control={control}
          name="legajo_a_cargo"
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
          options={setBarrios()}
          autoCompleter={autoCompleter}
          setAutoCompleter={setAutoCompleter}
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
        <div className="buttons">
          <Button onClick={handleClose} color="error" variant="contained">
            Cancelar
          </Button>
          <Button onClick={handleSubmit(submitEvent)} variant="contained">
            Guardar
          </Button>
        </div>
      </Box>
      <CustomSnackbar res={response} open={open} handleClose={closeSnackbar} />
    </Box>
  );
}

export default OperativosForm;
