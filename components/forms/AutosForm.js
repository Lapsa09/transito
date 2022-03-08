import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
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

function OperativosForm({ handleClose, afterCreate }) {
  const user = useSelector(selectUser);
  const { handleSubmit, control, reset, getValues, setValue } = useForm();
  const [licencias, setLicencias] = useState([]);
  const [zonasVL, setZonasVL] = useState([]);
  const [allZonas, setAllZonas] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [seguridad, setSeguridad] = useState([]);
  const [resolucion, setResolucion] = useState([]);
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
      await nuevoOperativoAuto(data);
      await afterCreate();
      reset({
        ...data,
        dominio: "",
        direccion: "",
        zona_infractor: null,
        resolucion: "",
        motivo: "",
      });
      showSnackbar("success", "Cargado con exito");
    } catch (error) {
      showSnackbar("error", error.response?.data);
    }
  };

  useEffect(() => {
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
        setValue("lpcarga", user.legajo);
      } catch (error) {
        showSnackbar("error", error.response.data);
      }
    };
    fetchItems();
  }, []);

  return (
    <Layout>
      <Box component="form" className="form__box op" autoComplete="off">
        <DateTimePicker
          control={control}
          name="fecha"
          label="Fecha"
          defaultValue={null}
        />
        <TimePicker
          control={control}
          name="hora"
          label="Hora"
          defaultValue={null}
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
          options={allZonas}
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
    </Layout>
  );
}

export default OperativosForm;
