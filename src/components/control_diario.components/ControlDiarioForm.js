import {
  Autocomplete,
  Box,
  Button,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getLocalidades,
  getMotivos,
  getMotivosPaseo,
  nuevoControl,
  nuevoControlPaseo,
} from "../../services/controlDiarioService";
import { getResolucion, getTurnos } from "../../services/index";
import { selectUser } from "../../utils/redux/userSlice";
import {
  validDate,
  validDomain,
  validField,
  validLegajo,
  validTime,
} from "../../utils/validations";
import CustomDatePicker from "../datetime-picker/DatePicker";
import CustomTimePicker from "../datetime-picker/TimePicker";
import CustomSnackbar from "../snackbar/CustomSnackbar";
import "./controlDiarioForm.css";

function ControlDiarioForm({ handleClose, afterCreate }) {
  const [resolucion, setResolucion] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [motivos, setMotivos] = useState([]);
  const [error, setError] = useState("");
  const [alignment, setAlignment] = useState(1);
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState({ severity: "", message: "" });
  const [autoCompleter, setAutoCompleter] = useState(null);
  const user = useSelector(selectUser);
  const [form, setForm] = useState({
    fecha: null,
    hora: null,
    direccion: "",
    dominio: "",
    lp: "",
    acta: "",
    resolucion: "",
    turno: "",
    lpcarga: user.legajo,
    motivo: "",
    otroMotivo: "",
    localidadInfractor: "",
  });

  const validated = () => {
    return (
      validDate(form.fecha) &&
      validTime(form.hora) &&
      validField(form.direccion) &&
      validDomain(form.dominio) &&
      validField(form.localidadInfractor) &&
      validLegajo(form.lp) &&
      validField(form.turno) &&
      validField(form.resolucion) &&
      validLegajo(form.lpcarga) &&
      validField(form.motivo) &&
      validActa() &&
      validOtro()
    );
  };

  const validOtro = () => {
    if (form.motivo === "OTRO") {
      return validField(form.otroMotivo);
    }
    return true;
  };

  const validActa = () => {
    if (form.resolucion === "ACTA") {
      return validField(form.acta);
    }
    return true;
  };

  const handleChangeAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
    setForm({
      ...form,
      motivo: "",
      otroMotivo: "",
      direccion: newAlignment === 2 ? "PASEO DE LA COSTA" : "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validated()) {
      setError(false);
      try {
        alignment == 1
          ? await nuevoControl(form)
          : await nuevoControlPaseo(form);
        setForm({
          ...form,
          hora: null,
          dominio: "",
          acta: "",
          resolucion: "",
          motivo: "",
          otroMotivo: "",
          localidadInfractor: "",
        });
        setAutoCompleter(null);
        await afterCreate();
        showSnackbar("success", "Cargado con exito");
      } catch (error) {
        showSnackbar("error", error.response.data);
      }
    } else {
      setError(true);
    }
  };

  const setBarrios = () => {
    return [
      ...new Map(
        localidades.map((localidad) => [localidad.barrio, localidad])
      ).values(),
    ];
  };

  const fillSelects = async () => {
    try {
      setLocalidades(await getLocalidades());
      setMotivos(alignment == 1 ? await getMotivos() : await getMotivosPaseo());
      setTurnos(await getTurnos());
      setResolucion(await getResolucion());
    } catch (error) {
      showSnackbar("error", error.message);
    }
  };

  useEffect(() => {
    fillSelects();
  }, [alignment]);

  const getMotivo = () => {
    return motivos.find((motivo) => motivo.id == form.motivo)?.motivo || "";
  };

  const parseDate = (newDate) => {
    if (newDate.isValid) {
      setForm({ ...form, fecha: newDate });
    }
  };

  const parseTime = (newTime) => {
    if (newTime.isValid) {
      setForm({
        ...form,
        hora: newTime,
      });
    }
  };

  const handleChange = (input) => (e) => {
    setForm({
      ...form,
      [input]:
        typeof e.target.value == "string"
          ? e.target.value.toUpperCase()
          : e.target.value,
    });
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

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    maxHeight: "75%",
    flexDirection: "column",
    alignItems: "center",
  };

  return (
    <Box sx={style} className="form">
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChangeAlignment}
      >
        <ToggleButton value={1}>Normal</ToggleButton>
        <ToggleButton value={2}>Paseo de la costa</ToggleButton>
      </ToggleButtonGroup>
      <Box component="form" className="form__box">
        <CustomDatePicker
          helperText={"Inserte una fecha valida"}
          error={error && !validDate(form.fecha)}
          label="Fecha"
          value={form.fecha}
          onChange={parseDate}
        />
        <TextField
          select
          error={error && !validField(form.turno)}
          label="Turno"
          required
          value={form.turno}
          helperText={error && !validField(form.turno) && "Elija una opcion"}
          onChange={handleChange("turno")}
        >
          <MenuItem>SELECCIONE UNA OPCION</MenuItem>
          {turnos.map((turno) => (
            <MenuItem value={turno.enumlabel}>{turno.enumlabel}</MenuItem>
          ))}
        </TextField>
        <CustomTimePicker
          helperText={"Inserte una hora valida"}
          error={error && !validTime(form.hora)}
          label="Hora"
          value={form.hora}
          onChange={parseTime}
        />
        <TextField
          error={error && !validField(form.direccion)}
          label="Direccion"
          value={form.direccion}
          disabled={alignment === 2}
          required
          onChange={handleChange("direccion")}
          helperText={
            error &&
            !validField(form.direccion) &&
            "Inserte una direccion valida"
          }
        />
        <TextField
          label="Dominio"
          error={error && !validDomain(form.dominio)}
          value={form.dominio}
          required
          helperText={
            error && !validDomain(form.dominio) && "Inserte una patente valida"
          }
          onChange={handleChange("dominio")}
        />
        <TextField
          type="number"
          label="Legajo planilla"
          error={error && !validLegajo(form.lp)}
          value={form.lp}
          required
          helperText={
            error && !validLegajo(form.lp) && "Inserte un legajo valido"
          }
          onChange={handleChange("lp")}
        />
        <TextField
          select
          label="Resolucion"
          error={error && !validField(form.resolucion)}
          value={form.resolucion}
          required
          helperText={
            error && !validField(form.resolucion) && "Elija una opcion valida"
          }
          onChange={handleChange("resolucion")}
        >
          <MenuItem>SELECCIONE UNA OPCION</MenuItem>
          {resolucion.map((res) => (
            <MenuItem value={res.enumlabel}>{res.enumlabel}</MenuItem>
          ))}
        </TextField>
        {form.resolucion == "ACTA" && (
          <TextField
            type="number"
            label="Acta"
            required
            error={error && !validField(form.acta)}
            helperText={
              error && !validField(form.acta) && "Ingrese un Nro de Acta valido"
            }
            value={form.acta}
            onChange={handleChange("acta")}
          />
        )}
        <TextField
          select
          error={error && !validField(form.motivo)}
          label="Motivo"
          required
          value={form.motivo}
          helperText={error && !validField(form.motivo) && "Elija una opcion"}
          onChange={handleChange("motivo")}
        >
          <MenuItem>SELECCIONE UNA OPCION</MenuItem>
          {alignment == 1
            ? motivos.map(({ id_motivo, motivo }) => (
                <MenuItem value={id_motivo}>{motivo}</MenuItem>
              ))
            : motivos.map((motivo) => (
                <MenuItem value={motivo.enumlabel}>{motivo.enumlabel}</MenuItem>
              ))}
        </TextField>
        {motivos.length > 0 && getMotivo() == "OTRO" && (
          <TextField
            label="Otro motivo"
            error={error && validField(form.otroMotivo)}
            value={form.otroMotivo}
            required
            helperText={
              error &&
              !validField(form.otroMotivo) &&
              "Inserte un motivo valido"
            }
            onChange={handleChange("otroMotivo")}
          />
        )}
        <Autocomplete
          options={setBarrios()}
          getOptionLabel={(option) => option.barrio}
          value={autoCompleter}
          onChange={(e, value, reason) => {
            setForm({
              ...form,
              localidadInfractor: reason === "clear" ? "" : value.id_barrio,
            });
            setAutoCompleter(value);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Localidad del infractor"
              required
              error={error && !validField(form.localidadInfractor)}
              helperText={
                error &&
                !validField(form.localidadInfractor) &&
                "Elija una opcion"
              }
            />
          )}
        />
        <div className="buttons">
          <Button onClick={handleClose} color="error" variant="contained">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Guardar
          </Button>
        </div>
      </Box>
      <CustomSnackbar res={response} open={open} handleClose={closeSnackbar} />
    </Box>
  );
}

export default ControlDiarioForm;
