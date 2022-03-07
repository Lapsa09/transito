import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
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
import LogoVL from "../../public/LOGO_V_LOPEZ.png";
import LogoOVT from "../../public/OVT_LETRAS_NEGRAS.png";
import Image from "next/image";
import style from "../../styles/controlDiarioForm.module.css";
import { adminStyle } from "../utils";
import CustomTextField from "../ui/CustomTextField";
import CustomSelect from "../ui/CustomSelect";
import { useForm } from "react-hook-form";
import CustomAutocomplete from "../ui/CustomAutocomplete";
import CustomSwitch from "../ui/CustomSwitch";
import CustomSnackbar from "../ui/CustomSnackbar";

function OperativosForm({ handleClose, afterCreate }) {
  const user = useSelector(selectUser);
  const { handleSubmit, control, reset, getValues, setValue } = useForm();
  const [zonasVL, setZonasVL] = useState([]);
  const [allZonas, setAllZonas] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [resolucion, setResolucion] = useState([]);
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState("");

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
      await nuevoOperativoCamiones(data);
      reset({
        ...data,
        direccion: "",
        origen: "",
        destino: "",
        localidad_origen: null,
        localidad_destino: null,
      });
      showSnackbar("success", "Cargado con exito");
      await afterCreate();
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
    Promise.all([getZonasVL(), getAllZonas(), getTurnos(), getResolucion()])
      .then(([zonasVL, zonas, turnos, resoluciones]) => {
        setZonasVL(zonasVL);
        setAllZonas(zonas);
        setTurnos(turnos);
        setResolucion(resoluciones);
      })
      .catch((error) => {
        showSnackbar("error", error.response.data);
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
          rules={{ required: "Elia una opcion" }}
          options={turnos}
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
          options={setBarrios()}
        />
        <CustomTextField control={control} name="destino" label="Destino" />
        <CustomAutocomplete
          control={control}
          name="localidad_destino"
          label="Localidad de destino"
          rules={{ required: "Elija una opcion" }}
          options={setBarrios()}
        />
        <CustomSwitch control={control} name="remito" label="Remito" />
        <CustomSwitch control={control} name="carga" label="Carga" />
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

export default OperativosForm;
