import { Box, Button, MenuItem, TextField } from "@mui/material";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getLocalidades,
  getMotivos,
  nuevoControl,
} from "../../services/controlDiarioService";
import { getResolucion, getTurnos } from "../../services/index";
import { dateAndTime } from "../../utils/utils";
import { validDomain, validField, validLegajo } from "../../utils/validations";
import CustomDateTimePicker from "../datetime-picker/DateTimePicker";

function ControlDiarioForm() {
  const [date, setDate] = useState(DateTime.now());
  const [resolucion, setResolucion] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [motivos, setMotivos] = useState([]);
  const [error, setError] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validated()) {
      try {
        setError(false);
        const res = await nuevoControl(form);
        console.log(res);
        setForm({
          fecha: "",
          hora: "",
          direccion: "",
          dominio: "",
          acta: "",
          resolucion: "",
          turno: "",
          lpcarga: "",
          motivo: "",
          otroMotivo: "",
          localidadInfractor: "",
          ...form,
        });
      } catch (error) {
        console.log(error);
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
      setMotivos(await getMotivos());
      setTurnos(await getTurnos());
      setResolucion(await getResolucion());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fillSelects();
    console.log(
      DateTime.fromFormat("23/12/2021", "D", {
        locale: "es-AR",
      })
    );
  }, []);

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
    console.log(form);
  };

  return (
    <Box component="form" className="form">
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
          error && !validField(form.direccion) && "Inserte una direccion valida"
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
        {motivos.map(({ id, motivo }) => (
          <MenuItem value={id}>{motivo}</MenuItem>
        ))}
      </TextField>
      {motivos.length > 0 && getMotivo() == "OTRO" && (
        <TextField
          label="Otro motivo"
          error={error && validField(form.otroMotivo)}
          value={form.otroMotivo}
          required
          helperText={
            error && !validField(form.otroMotivo) && "Inserte un motivo valido"
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
  );
}

export default ControlDiarioForm;
