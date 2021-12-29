import { getEnums, getter, setter } from "./index";

export const getLicencias = async () => await getter("/operativos/licencias");

export const getZonasVL = async () => await getter("/operativos/zonas/vl");

export const getAllZonas = async () => await getter("/zonas");

export const getSeguridad = async () => await getEnums("seguridad");

export const getDel = async () => await getEnums("del");

export const getResultado = async () => await getEnums("resultado");

export const nuevoOperativo = async (body) => await setter("/operativos", body);

export const getOperativos = async () => await getter("/operativos");
