import { DateTime } from "luxon";

export const adminForm = (legajo) => {
  return {
    fecha: null,
    hora: null,
    direccion: "",
    dominio: "",
    lp: "",
    acta: "",
    resolucion: "",
    turno: "",
    lpcarga: legajo,
    motivo: "",
    otroMotivo: "",
    localidadInfractor: "",
  };
};

export const inspectorForm = (legajo, turno) => {
  return {
    fecha: DateTime.now().setLocale("es-AR"),
    hora: DateTime.now().setLocale("es-AR"),
    direccion: "",
    dominio: "",
    lp: legajo,
    acta: "",
    resolucion: "",
    turno,
    lpcarga: legajo,
    motivo: "",
    otroMotivo: "",
    localidadInfractor: "",
  };
};

export const adminStyle = {
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

export const inspectorStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  flexDirection: "column",
  alignItems: "center",
};
