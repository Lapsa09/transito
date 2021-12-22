import React, { useState } from "react";
import { Box, TextField } from "@mui/material";
import { DateTime } from "luxon";
import DateTimePicker from "../datetime-picker/DateTimePicker";

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
    <Box component="form" className="form" noValidate autoComplete="off">
      <DateTimePicker
        label="Fecha y hora"
        value={date}
        onChange={parseDateTime}
      />
      <TextField
        label="Direccion"
        value={form.direccion}
        onChange={handleChange("direccion")}
      />
      <TextField
        select
        label="Zona"
        value={form.zona}
        onChange={handleChange("zona")}
      />
      <TextField
        label="Legajo a cargo"
        value={form.legajo_a_cargo}
        onChange={handleChange("legajo_a_cargo")}
      />
      <TextField
        label="Legajo planilla"
        value={form.legajo_planilla}
        onChange={handleChange("legajo_planilla")}
      />
      <TextField
        select
        label="Turno"
        value={form.turno}
        onChange={handleChange("turno")}
      />
      <TextField
        select
        label="Seguridad"
        value={form.seguridad}
        onChange={handleChange("seguridad")}
      />
      <TextField
        label="Dominio"
        value={form.dominio}
        onChange={handleChange("dominio")}
      />
      <TextField
        label="Licencia"
        value={form.licencia}
        onChange={handleChange("licencia")}
      />
      <TextField
        label="Tipo de licencia"
        value={form.tipo_licencia}
        onChange={handleChange("tipo_licencia")}
      />
      <TextField
        select
        label="Zona del infractor"
        value={form.zona_infractor}
        onChange={handleChange("zona_infractor")}
      />
      <TextField
        label="Acta"
        value={form.acta}
        onChange={handleChange("acta")}
      />
      <TextField
        label="Motivo"
        value={form.motivo}
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
        value={form.resolucion}
        onChange={handleChange("resolucion")}
      />
      <TextField
        label="Legajo carga"
        value={form.lpcarga}
        onChange={handleChange("lpcarga")}
      />
      <TextField
        select
        label="Es Del"
        value={form.es_del}
        onChange={handleChange("es_del")}
      />
      <TextField
        select
        label="Resultado"
        value={form.resultado}
        onChange={handleChange("resultado")}
      />
    </Box>
  );
}

export default OperativosForm;
