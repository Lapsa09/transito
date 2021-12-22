import { getter } from "./index";

export const getLicencias = async () => await getter("/operativos/licencias");

export const getZonasVL = async () => await getter("/operativos/zonas/vl");

export const getAllZonas = async () => await getter("/operativos/zonas/all");
