import React, { useEffect, useState } from "react";
import { Box, Button, FormControl, MenuItem, TextField } from "@mui/material";
import { DateTime } from "luxon";
import DateTimePicker from "../datetime-picker/DateTimePicker";
import {
  getAllZonas,
  getDel,
  getLicencias,
  getResolucion,
  getResultado,
  getSeguridad,
  getTurnos,
  getZonasVL,
  nuevoOperativo,
} from "../../services/operativosService";
import { useNavigate } from "react-router-dom";
import "./operativosForm.css";

function OperativosForm() {
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

  const handleSubmit = async () => {
    await nuevoOperativo(form);
    navigate(0);
  };

  const goBack = () => {
    navigate("/");
  };

  useEffect(() => {
    fillSelects();
  }, []);

  const parseDateTime = (newDate) => {
    setDate(newDate);
    setForm({
      ...form,
      fecha: date.toLocaleString(),
      hora: date.toLocaleString(DateTime.TIME_24_SIMPLE),
    });
  };

  const handleChange = (input) => (e) => {
    setForm({ ...form, [input]: e.target.value });
  };
  return (
    <Box component="form" className="form" autoComplete="off">
      <FormControl>
        <DateTimePicker
          label="Fecha y hora"
          value={date}
          onChange={parseDateTime}
        />
      </FormControl>
      <FormControl required>
        <TextField
          label="Direccion"
          value={form.direccion}
          onChange={handleChange("direccion")}
        />
      </FormControl>
      <FormControl required>
        <TextField
          select
          label="Zona"
          value={form.zona}
          onChange={handleChange("zona")}
        >
          <MenuItem>SELECCIONE UNA OPCION</MenuItem>
          {zonasVL.map(({ id_zona, zona }) => (
            <MenuItem value={id_zona}>{zona}</MenuItem>
          ))}
        </TextField>
      </FormControl>
      <FormControl required>
        <TextField
          label="Legajo a cargo"
          value={form.legajo_a_cargo}
          onChange={handleChange("legajo_a_cargo")}
        />
      </FormControl>
      <FormControl required>
        <TextField
          label="Legajo planilla"
          value={form.legajo_planilla}
          onChange={handleChange("legajo_planilla")}
        />
      </FormControl>
      <FormControl required>
        <TextField
          select
          label="Turno"
          value={form.turno}
          onChange={handleChange("turno")}
        >
          <MenuItem>SELECCIONE UNA OPCION</MenuItem>
          {turnos.map((turno) => (
            <MenuItem value={turno.enumlabel}>{turno.enumlabel}</MenuItem>
          ))}
        </TextField>
      </FormControl>
      <FormControl required>
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
      </FormControl>
      <FormControl required>
        <TextField
          label="Dominio"
          value={form.dominio}
          onChange={handleChange("dominio")}
        />
      </FormControl>
      <FormControl required>
        <TextField
          label="Licencia"
          value={form.licencia}
          onChange={handleChange("licencia")}
        />
      </FormControl>
      <FormControl required>
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
      </FormControl>
      <FormControl required>
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
      </FormControl>
      <FormControl>
        <TextField
          label="Acta"
          value={form.acta}
          onChange={handleChange("acta")}
        />
      </FormControl>
      <FormControl>
        <TextField
          label="Motivo"
          value={form.motivo}
          onChange={handleChange("motivo")}
        />
      </FormControl>
      <FormControl>
        <TextField
          label="Graduacion Alcoholica"
          value={form.graduacion_alcoholica}
          onChange={"graduacion_alcoholica"}
        />
      </FormControl>
      <FormControl required>
        <TextField
          select
          label="Resolucion"
          value={form.resolucion}
          onChange={handleChange("resolucion")}
        >
          <MenuItem>SELECCIONE UNA OPCION</MenuItem>
          {resolucion.map((res) => (
            <MenuItem value={res.enumlabel}>{res.enumlabel}</MenuItem>
          ))}
        </TextField>
      </FormControl>
      <FormControl required>
        <TextField
          label="Legajo carga"
          value={form.lpcarga}
          onChange={handleChange("lpcarga")}
        />
      </FormControl>
      <FormControl>
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
      </FormControl>
      <FormControl>
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
      </FormControl>
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

export default OperativosForm;
