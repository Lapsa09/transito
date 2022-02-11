import React, { useEffect, useState } from "react";
import { Autocomplete, Box, Button, MenuItem, TextField } from "@mui/material";
import DateTimePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import {
  getAllZonas,
  getLicencias,
  getMotivosMoto,
  getSeguridad,
  getZonasVL,
  nuevoOperativoMoto,
} from "../services/operativosService";
import { getResolucion, getTurnos } from "../services/index";
import { validDomain, validField, validLegajo } from "../utils/validations";
import { useSelector } from "react-redux";
import { selectUser } from "../utils/redux/userSlice";
import AddBoxSharpIcon from "@mui/icons-material/AddBoxSharp";
import IndeterminateCheckBoxSharpIcon from "@mui/icons-material/IndeterminateCheckBoxSharp";

function MotosForm({ handleClose, afterCreate }) {
  const user = useSelector(selectUser);
  const [form, setForm] = useState({
    fecha: null,
    hora: null,
    direccion: "",
    legajo_a_cargo: "",
    legajo_planilla: "",
    turno: "",
    seguridad: "",
    dominio: "",
    licencia: "",
    acta: "",
    motivo1: "",
    motivo2: "",
    motivo3: "",
    motivo4: "",
    motivo5: "",
    resolucion: "",
    lpcarga: user.legajo,
    tipo_licencia: "",
    zona: "",
    zona_infractor: "",
  });
  const [licencias, setLicencias] = useState([]);
  const [zonasVL, setZonasVL] = useState([]);
  const [allZonas, setAllZonas] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [seguridad, setSeguridad] = useState([]);
  const [resolucion, setResolucion] = useState([]);
  const [autoCompleter, setAutoCompleter] = useState(null);
  const [error, setError] = useState(false);
  const [motivos, setMotivos] = useState([]);
  const [cantMotivos, setCantMotivos] = useState(1);

  const fillSelects = async () => {
    setLicencias(await getLicencias());
    setZonasVL(await getZonasVL());
    setAllZonas(await getAllZonas());
    setTurnos(await getTurnos());
    setSeguridad(await getSeguridad());
    setResolucion(await getResolucion());
    setMotivos(await getMotivosMoto());
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
      validField(form.zona_infractor) &&
      opcional()
    );
  };

  const sumarMotivos = () => {
    if (cantMotivos < 5) {
      setCantMotivos(cantMotivos + 1);
    }
  };

  const restarMotivos = () => {
    if (cantMotivos > 1) {
      setCantMotivos(cantMotivos - 1);
    }
  };

  const opcional = () => {
    switch (cantMotivos) {
      case 1:
        return validField(form.motivo1);
      case 2:
        return validField(form.motivo1) && validField(form.motivo2);
      case 3:
        return (
          validField(form.motivo1) &&
          validField(form.motivo2) &&
          validField(form.motivo3)
        );
      case 4:
        return (
          validField(form.motivo1) &&
          validField(form.motivo2) &&
          validField(form.motivo3) &&
          validField(form.motivo4)
        );
      case 5:
        return (
          validField(form.motivo1) &&
          validField(form.motivo2) &&
          validField(form.motivo3) &&
          validField(form.motivo4) &&
          validField(form.motivo5)
        );
    }
  };

  const handleSubmit = async () => {
    if (validated()) {
      setForm({
        ...form,
        es_del: findMunicipio(),
        resultado: handleResultado(),
      });
      await nuevoOperativoMoto(form);
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
      <div className="controller">
        <h4>Motivos: {cantMotivos}</h4>
        <AddBoxSharpIcon onClick={sumarMotivos} />
        <IndeterminateCheckBoxSharpIcon onClick={restarMotivos} />
      </div>
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
          {licencias.map(({ id_tipo, tipo }) => (
            <MenuItem value={id_tipo}>{tipo}</MenuItem>
          ))}
        </TextField>
        <Autocomplete
          options={setBarrios()}
          getOptionLabel={(option) => option.barrio}
          value={autoCompleter}
          onChange={(e, value, reason) => {
            setForm({
              ...form,
              zona_infractor: reason === "clear" ? "" : value.id_barrio,
            });
            setAutoCompleter(value);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Localidad del infractor"
              required
              error={error && !validField(form.zona_infractor)}
              helperText={
                error && !validField(form.zona_infractor) && "Elija una opcion"
              }
            />
          )}
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
        {form.resolucion === "ACTA" && (
          <TextField
            label="Acta"
            value={form.acta}
            onChange={handleChange("acta")}
          />
        )}

        <TextField
          select
          label="Motivo 1"
          error={error && validField(form.motivo1)}
          value={form.motivo1}
          required
          helperText={
            error && !validField(form.motivo1) && "Inserte un motivo valido"
          }
          onChange={handleChange("motivo1")}
        >
          <MenuItem>SELECCIONE UNA OPCION</MenuItem>
          {motivos.map(({ id_motivo, motivo }) => (
            <MenuItem value={id_motivo}>{motivo}</MenuItem>
          ))}
        </TextField>

        {cantMotivos >= 2 && (
          <TextField
            label="Motivo 2"
            error={error && validField(form.motivo2)}
            value={form.motivo2}
            required
            helperText={
              error && !validField(form.motivo1) && "Inserte un motivo valido"
            }
            onChange={handleChange("motivo2")}
          >
            <MenuItem>SELECCIONE UNA OPCION</MenuItem>
            {motivos.map(({ id_motivo, motivo }) => (
              <MenuItem value={id_motivo}>{motivo}</MenuItem>
            ))}
          </TextField>
        )}
        {cantMotivos >= 3 && (
          <TextField
            label="Motivo 3"
            error={error && validField(form.motivo3)}
            value={form.motivo3}
            required
            helperText={
              error && !validField(form.motivo3) && "Inserte un motivo valido"
            }
            onChange={handleChange("motivo3")}
          >
            <MenuItem>SELECCIONE UNA OPCION</MenuItem>
            {motivos.map(({ id_motivo, motivo }) => (
              <MenuItem value={id_motivo}>{motivo}</MenuItem>
            ))}
          </TextField>
        )}
        {cantMotivos >= 4 && (
          <TextField
            label="Motivo 4"
            error={error && validField(form.motivo4)}
            value={form.motivo4}
            required
            helperText={
              error && !validField(form.motivo4) && "Inserte un motivo valido"
            }
            onChange={handleChange("motivo4")}
          >
            <MenuItem>SELECCIONE UNA OPCION</MenuItem>
            {motivos.map(({ id_motivo, motivo }) => (
              <MenuItem value={id_motivo}>{motivo}</MenuItem>
            ))}
          </TextField>
        )}
        {cantMotivos === 5 && (
          <TextField
            label="Motivo 5"
            error={error && validField(form.motivo5)}
            value={form.motivo5}
            required
            helperText={
              error && !validField(form.motivo5) && "Inserte un motivo valido"
            }
            onChange={handleChange("motivo5")}
          >
            <MenuItem>SELECCIONE UNA OPCION</MenuItem>
            {motivos.map(({ id_motivo, motivo }) => (
              <MenuItem value={id_motivo}>{motivo}</MenuItem>
            ))}
          </TextField>
        )}

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

export default MotosForm;
