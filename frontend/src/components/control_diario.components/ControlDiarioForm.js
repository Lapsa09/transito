import {
  Box,
  Button,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getLocalidades,
  getMotivos,
  getMotivosPaseo,
  nuevoControl,
  nuevoControlPaseo,
} from "../../services/controlDiarioService";
import { getResolucion, getTurnos } from "../../services/index";
import { dateAndTime } from "../../utils/utils";
import { validDomain, validField, validLegajo } from "../../utils/validations";
import CustomDateTimePicker from "../datetime-picker/DateTimePicker";
import CustomSnackbar from "../snackbar/CustomSnackbar";
import "./controlDiarioForm.css";

function ControlDiarioForm() {
  const [date, setDate] = useState(DateTime.now());
  const [resolucion, setResolucion] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [motivos, setMotivos] = useState([]);
  const [error, setError] = useState("");
  const [alignment, setAlignment] = useState(1);
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState({ severity: "", message: "" });
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fecha: "",
    hora: "",
    direccion: "",
    dominio: "",
    lp: "",
    acta: "",
    resolucion: "",
    turno: "",
    lpcarga: "",
    motivo: "",
    otroMotivo: "",
    localidadInfractor: "",
  });

  const validated = () => {
    return (
      validField(form.direccion) &&
      validDomain(form.dominio) &&
      validField(form.localidadInfractor) &&
      validLegajo(form.lp) &&
      validField(form.turno) &&
      validField(form.resolucion) &&
      validLegajo(form.lpcarga) &&
      validField(form.motivo)
    );
  };

  const handleChangeAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validated()) {
      try {
        setError(false);
        alignment == 1
          ? await nuevoControl(form)
          : await nuevoControlPaseo(form);
        setForm({
          ...form,
          fecha: "",
          hora: "",
          direccion: "",
          dominio: "",
          lp: "",
          acta: "",
          resolucion: "",
          turno: "",
          motivo: "",
          otroMotivo: "",
          localidadInfractor: "",
        });
        showSnackbar("success", "Cargado con exito");
      } catch (error) {
        showSnackbar("error", error.message);
      }
    } else {
      setError(true);
    }
  };

  const goBack = () => {
    navigate("/");
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

  const parseDateTime = (newDate) => {
    const { fecha, hora } = dateAndTime(newDate);
    setDate(newDate);
    setForm({ ...form, fecha, hora });
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

  return (
    <div className="form">
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
        <CustomDateTimePicker
          label="Fecha y hora"
          value={date}
          onChange={parseDateTime}
        />
        <TextField
          error={error && !validField(form.direccion)}
          label="Direccion"
          value={form.direccion}
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
          label="Acta"
          value={form.acta}
          onChange={handleChange("acta")}
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
        <TextField
          label="Legajo carga"
          error={error && !validLegajo(form.lpcarga)}
          value={form.lpcarga}
          required
          helperText={
            error && !validLegajo(form.lpcarga) && "Inserte un legajo valido"
          }
          onChange={handleChange("lpcarga")}
        />
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
            ? motivos.map(({ id, motivo }) => (
                <MenuItem value={id}>{motivo}</MenuItem>
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
        <TextField
          select
          error={error && !validField(form.localidadInfractor)}
          label="Localidad del infractor"
          required
          value={form.localidadInfractor}
          helperText={
            error && !validField(form.localidadInfractor) && "Elija una opcion"
          }
          onChange={handleChange("localidadInfractor")}
        >
          <MenuItem>SELECCIONE UNA OPCION</MenuItem>
          {localidades.map(({ id_localidad, localidad }) => (
            <MenuItem value={id_localidad}>{localidad}</MenuItem>
          ))}
        </TextField>
        <div className="buttons">
          <Button onClick={goBack} color="error" variant="contained">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Guardar
          </Button>
        </div>
      </Box>
      <CustomSnackbar res={response} open={open} handleClose={closeSnackbar} />
    </div>
  );
}

export default ControlDiarioForm;
