import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Switch,
  TextField,
} from "@mui/material";
import DateTimePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import {
  getAllZonas,
  getZonasVL,
  nuevoOperativoCamiones,
} from "../services/operativosService";
import { getResolucion, getTurnos } from "../services/index";
import { validDomain, validField, validLegajo } from "../utils/validations";
import { useSelector } from "react-redux";
import { selectUser } from "../utils/redux/userSlice";

function OperativosForm({ handleClose, afterCreate }) {
  const user = useSelector(selectUser);
  const [form, setForm] = useState({
    fecha: null,
    hora: null,
    turno: "",
    legajo: "",
    direccion: "",
    localidad: "",
    cp: "",
    dominio: "",
    origen: "",
    localidad_origen: "",
    destino: "",
    localidad_destino: "",
    licencia: "",
    remito: false,
    carga: false,
    resolucion: "",
    acta: "",
    motivo: "",
    legajo_carga: user.legajo,
  });
  const [zonasVL, setZonasVL] = useState([]);
  const [allZonas, setAllZonas] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [resolucion, setResolucion] = useState([]);
  const [autoCompleter, setAutoCompleter] = useState(null);
  const [error, setError] = useState(false);

  const fillSelects = async () => {
    setZonasVL(await getZonasVL());
    setAllZonas(await getAllZonas());
    setTurnos(await getTurnos());
    setResolucion(await getResolucion());
  };

  const validated = () => {
    return (
      validDomain(form.dominio) &&
      validField(form.direccion) &&
      validField(form.zona) &&
      validLegajo(form.legajo) &&
      validLegajo(form.legajo_planilla) &&
      validField(form.turno) &&
      validField(form.resolucion) &&
      validField(form.zona_infractor)
    );
  };

  const handleSubmit = async () => {
    if (validated()) {
      setForm({
        ...form,
      });
      await nuevoOperativoCamiones(form);
      afterCreate();
    } else {
      setError(true);
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
    fillSelects();
  }, []);

  const parseDate = (newDate) => {
    setForm({ ...form, fecha: newDate });
  };

  const parseTime = (newTime) => {
    setForm({ ...form, hora: newTime });
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

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    flexWrap: "wrap",
  };
  return (
    <Box sx={style} className="form">
      <Box component="form" className="form__box op" autoComplete="off">
        <DateTimePicker label="Fecha" value={form.fecha} onChange={parseDate} />
        <TimePicker label="Hora" value={form.hora} onChange={parseTime} />
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
          select
          error={error && !validField(form.zona)}
          label="Zona"
          required
          value={form.zona}
          onChange={handleChange("zona")}
          helperText={error && !validField(form.zona) && "Elija una localidad"}
        >
          <MenuItem>SELECCIONE UNA OPCION</MenuItem>
          {zonasVL.map(({ id_barrio, barrio }) => (
            <MenuItem value={id_barrio}>{barrio}</MenuItem>
          ))}
        </TextField>
        <TextField
          error={error && !validLegajo(form.legajo)}
          label="Legajo"
          required
          value={form.legajo}
          onChange={handleChange("legajo")}
          helperText={
            error && !validLegajo(form.legajo) && "Inserte un legajo valido"
          }
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
          label="Origen"
          value={form.origen}
          onChange={handleChange("origen")}
        />
        <Autocomplete
          options={setBarrios()}
          getOptionLabel={(option) => option.barrio}
          value={autoCompleter}
          onChange={(e, value, reason) => {
            setForm({
              ...form,
              localidad_origen: reason === "clear" ? "" : value.id_barrio,
            });
            setAutoCompleter(value);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Localidad de origen"
              required
              error={error && !validField(form.localidad_origen)}
              helperText={
                error &&
                !validField(form.localidad_origen) &&
                "Elija una opcion"
              }
            />
          )}
        />
        <TextField
          label="Destino"
          value={form.destino}
          onChange={handleChange("destino")}
        />
        <Autocomplete
          options={setBarrios()}
          getOptionLabel={(option) => option.barrio}
          value={autoCompleter}
          onChange={(e, value, reason) => {
            setForm({
              ...form,
              localidad_destino: reason === "clear" ? "" : value.id_barrio,
            });
            setAutoCompleter(value);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Localidad de destino"
              required
              error={error && !validField(form.localidad_destino)}
              helperText={
                error &&
                !validField(form.localidad_destino) &&
                "Elija una opcion"
              }
            />
          )}
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.remito}
              onChange={(e) => setForm({ ...form, remito: e.target.checked })}
            />
          }
          label="Remito"
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.carga}
              onChange={(e) => setForm({ ...form, carga: e.target.checked })}
            />
          }
          label="Carga"
        />
        {form.resolucion === "ACTA" && (
          <TextField
            label="Acta"
            value={form.acta}
            onChange={handleChange("acta")}
          />
        )}
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
        <div className="buttons">
          <Button onClick={handleClose} color="error" variant="contained">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Guardar
          </Button>
        </div>
      </Box>
    </Box>
  );
}

export default OperativosForm;
