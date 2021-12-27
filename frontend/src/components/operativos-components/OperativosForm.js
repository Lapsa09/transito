import React, { useEffect, useState } from "react";
import { Box, Button, MenuItem, TextField } from "@mui/material";
import { DateTime } from "luxon";
import DateTimePicker from "../datetime-picker/DateTimePicker";
import {
  getAllZonas,
  getDel,
  getLicencias,
  getResultado,
  getSeguridad,
  getZonasVL,
  nuevoOperativo,
} from "../../services/operativosService";
import { getResolucion, getTurnos } from "../../services/index";
import { useNavigate } from "react-router-dom";
import "./operativosForm.css";
import { validDomain, validField, validLegajo } from "../../utils/validations";
import { dateAndTime } from "../../utils/utils";

function OperativosForm({ handleClose, afterCreate }) {
  const [form, setForm] = useState({
    fecha: "",
    hora: "",
    direccion: "",
    legajo_a_cargo: "",
    legajo_planilla: "",
    turno: "",
    seguridad: "",
    dominio: "",
    licencia: "",
    acta: "",
    motivo: "",
    graduacion_alcoholica: "",
    resolucion: "",
    lpcarga: "",
    es_del: "",
    resultado: "",
    latitud: "",
    longitud: "",
    tipo_licencia: "",
    zona: "",
    zona_infractor: "",
  });
  const [date, setDate] = useState(DateTime.now());
  const [licencias, setLicencias] = useState([]);
  const [zonasVL, setZonasVL] = useState([]);
  const [allZonas, setAllZonas] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [seguridad, setSeguridad] = useState([]);
  const [resolucion, setResolucion] = useState([]);
  const [es_del, setEs_del] = useState([]);
  const [resultado, setResultado] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const fillSelects = async () => {
    setLicencias(await getLicencias());
    setZonasVL(await getZonasVL());
    setAllZonas(await getAllZonas());
    setTurnos(await getTurnos());
    setSeguridad(await getSeguridad());
    setResolucion(await getResolucion());
    setEs_del(await getDel());
    setResultado(await getResultado());
  };

  const validated = () => {
    return (
      validDomain(form.dominio) &&
      validField(form.direccion) &&
      validField(form.zona) &&
      validLegajo(form.legajo_a_cargo) &&
      validLegajo(form.legajo_planilla) &&
      validField(form.turno) &&
      validField(form.resolucion) &&
      validLegajo(form.lpcarga)
    );
  };

  const handleSubmit = async () => {
    if (validated()) {
      await nuevoOperativo(form);
      afterCreate();
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    fillSelects();
  }, []);

  const parseDateTime = (newDate) => {
    const { fecha, hora } = dateAndTime(newDate);
    setDate(newDate);
    setForm({ ...form, fecha, hora });
  };

  const handleChange = (input) => (e) => {
    setForm({ ...form, [input]: e.target.value });
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
    height: "75%",
    flexWrap: "wrap",
  };
  return (
    <Box sx={style} component="form" className="form" autoComplete="off">
      <DateTimePicker
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
        select
        error={error && !validField(form.zona)}
        label="Zona"
        required
        value={form.zona}
        onChange={handleChange("zona")}
        helperText={error && !validField(form.zona) && "Elija una localidad"}
      >
        <MenuItem>SELECCIONE UNA OPCION</MenuItem>
        {zonasVL.map(({ id_zona, zona }) => (
          <MenuItem value={id_zona}>{zona}</MenuItem>
        ))}
      </TextField>
      <TextField
        error={error && !validLegajo(form.legajo_a_cargo)}
        label="Legajo a cargo"
        required
        value={form.legajo_a_cargo}
        onChange={handleChange("legajo_a_cargo")}
        helperText={
          error &&
          !validLegajo(form.legajo_a_cargo) &&
          "Inserte un legajo valido"
        }
      />
      <TextField
        label="Legajo planilla"
        error={error && !validLegajo(form.legajo_planilla)}
        value={form.legajo_planilla}
        required
        helperText={
          error &&
          !validLegajo(form.legajo_planilla) &&
          "Inserte un legajo valido"
        }
        onChange={handleChange("legajo_planilla")}
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
      <TextField
        select
        label="Seguridad"
        value={form.seguridad}
        onChange={handleChange("seguridad")}
      >
        <MenuItem>SELECCIONE UNA OPCION</MenuItem>
        {seguridad.map((seg) => (
          <MenuItem value={seg.enumlabel}>{seg.enumlabel}</MenuItem>
        ))}
      </TextField>
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
        label="Licencia"
        value={form.licencia}
        onChange={handleChange("licencia")}
      />
      <TextField
        select
        label="Tipo de licencia"
        value={form.tipo_licencia}
        onChange={handleChange("tipo_licencia")}
      >
        <MenuItem>SELECCIONE UNA OPCION</MenuItem>
        {licencias.map(({ id_lic, licencia }) => (
          <MenuItem value={id_lic}>{licencia}</MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Zona del infractor"
        value={form.zona_infractor}
        onChange={handleChange("zona_infractor")}
      >
        <MenuItem>SELECCIONE UNA OPCION</MenuItem>
        {allZonas.map(({ id_zona, zona }) => (
          <MenuItem value={id_zona}>{zona}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Acta"
        value={form.acta}
        onChange={handleChange("acta")}
      />
      <TextField
        label="Motivo"
        error={error && validField(form.motivo)}
        value={form.motivo}
        required
        helperText={
          error && !validField(form.motivo) && "Inserte un motivo valido"
        }
        onChange={handleChange("motivo")}
      />
      <TextField
        label="Graduacion Alcoholica"
        value={form.graduacion_alcoholica}
        onChange={"graduacion_alcoholica"}
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
        label="Legajo carga"
        error={validLegajo(form.lpcarga)}
        value={form.lpcarga}
        required
        helperText={
          error && !validLegajo(form.lpcarga) && "Inserte un legajo valido"
        }
        onChange={handleChange("lpcarga")}
      />
      <TextField
        select
        label="Es Del"
        value={form.es_del}
        onChange={handleChange("es_del")}
      >
        <MenuItem>SELECCIONE UNA OPCION</MenuItem>
        {es_del.map((ed) => (
          <MenuItem value={ed.enumlabel}>{ed.enumlabel}</MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Resultado"
        value={form.resultado}
        onChange={handleChange("resultado")}
      >
        <MenuItem>SELECCIONE UNA OPCION</MenuItem>
        {resultado.map((res) => (
          <MenuItem value={res.enumlabel}>{res.enumlabel}</MenuItem>
        ))}
      </TextField>
      <div className="buttons">
        <Button onClick={handleClose} color="error" variant="contained">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Guardar
        </Button>
      </div>
    </Box>
  );
}

export default OperativosForm;
