import { TextField, MenuItem, Box } from "@mui/material";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { departamentos, provincias } from "../../services/accidentesService";
import CustomDateTimePicker from "../datetime-picker/DateTimePicker";

function AccidentesLugarForm() {
  const [form, setForm] = useState({
    nombreResponsable: "",
    cargoResponsable: "",
    entidadInstructora: "",
    otroEntidadInstructora: "",
    sumario: "",
    expediente: "",
    dependencia: "",
    unidadRegional: "",
    divisionPolicial: "",
    fechaSiniestro: "",
    horaSiniestro: "",
    provincia: "",
    departamento: "",
    localidad: "",
    gobiernoLocal: "",
    zonaOcurrencia: "",
    tipoViaPublica: "",
    nombreCalle: "",
    altura: "",
    entreCalle1: "",
    entreCalle2: "",
    latitud: "",
    longitud: "",
    ilesos: 0,
    heridos: 0,
    fallecidos: 0,
    vehiculos: 0,
    peatones: 0,
    tipoSiniestro: "",
    otroTipoSiniestro: "",
    tipoColision: "",
    cantidadInvolucrados: 1,
    trazado: "",
    lugarViaPublica: "",
    otroTipoLugarViaPublica: "",
    pendienteDeclive: false,
    tipoSuperficieViaPublica: "",
    otroSuperficieViaPublica: "",
    conservacionViaPublica: "",
    estadoFisicoViaPublica: "",
    otroEstadoViaPublica: "",
    luminosidad: "",
    luzArtificial: false,
    divisionViaPublica: "",
    otroDivisionViaPublica: "",
    transitoRestringido: "",
    clima: "",
    visibilidad: "",
    otro_visibilidad: "",
    señalizacionVertical: false,
    señalizacionHorizontal: false,
    señalizacionTransitoria: false,
    semaforoVehicular: "",
    semaforoPeatonal: "",
  });
  const [date, setDate] = useState(DateTime.now());

  const handleChange = (input) => (e) => {
    setForm({ ...form, [input]: e.target.value });
  };

  const parseDateTime = (newDate) => {
    setDate(newDate);
    setForm({
      ...form,
      fechaSiniestro: date.toLocaleString(),
      horaSiniestro: date.toLocaleString(DateTime.TIME_24_SIMPLE),
    });
  };

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        label="Nombre Responsable de carga"
        value={form.nombreResponsable}
        onChange={handleChange("nombreResponsable")}
      />
      <TextField
        label="Cargo Responsable de carga"
        value={form.cargoResponsable}
        onChange={handleChange("cargoResponsable")}
      />
      <TextField
        select
        label="Entidad Instructora"
        value={form.entidadInstructora}
        onChange={handleChange("entidadInstructora")}
      >
        <MenuItem>Elija una opcion</MenuItem>
        <MenuItem value="OTRO">OTRO</MenuItem>
      </TextField>
      {form.entidadInstructora == "OTRO" ? (
        <TextField
          label="Otra entidad instructora"
          value={form.otroEntidadInstructora}
          onChange={handleChange("otroEntidadInstructora")}
        />
      ) : (
        (form.otroEntidadInstructora = "")
      )}
      <TextField
        label="Sumario policial"
        value={form.sumario}
        onChange={handleChange("sumario")}
      />
      <TextField
        label="Expediente judicial"
        value={form.expediente}
        onChange={handleChange("expediente")}
      />
      <TextField
        label="Dependencia"
        value={form.dependencia}
        onChange={handleChange("dependencia")}
      />
      <TextField
        label="Unidad Regional"
        value={form.unidadRegional}
        onChange={handleChange("unidadRegional")}
      />
      <TextField
        label="Division Policial"
        value={form.divisionPolicial}
        onChange={handleChange("divisionPolicial")}
      />
      <CustomDateTimePicker
        label="Fecha y hora del siniestro"
        value={date}
        onChange={parseDateTime}
      />
      <TextField
        select
        label="Provincia"
        value={form.provincia}
        onChange={handleChange("provincia")}
      >
        {provincias.map((provincia) => (
          <MenuItem value={provincia.id_provincia}>
            {provincia.provincia}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Departamento"
        value={form.departamento}
        onChange={handleChange("departamento")}
      >
        {departamentos.map((departamento) => (
          <MenuItem value={departamento}>{departamento}</MenuItem>
        ))}
      </TextField>
    </Box>
  );
}

export default AccidentesLugarForm;
