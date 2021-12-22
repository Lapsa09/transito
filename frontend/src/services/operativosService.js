import { getEnums, getter, setter } from "./index";

export const getLicencias = async () => await getter("/operativos/licencias");

export const getZonasVL = async () => await getter("/operativos/zonas/vl");

export const getAllZonas = async () => await getter("/operativos/zonas/all");

export const getTurnos = async () => await getEnums("turno");

export const getSeguridad = async () => await getEnums("seguridad");

export const getResolucion = async () => await getEnums("resolucion");

export const getDel = async () => await getEnums("del");

export const getResultado = async () => await getEnums("resultado");

export const nuevoOperativo = async (body) => await setter("/operativos", body);
