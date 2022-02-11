import { getEnums, getter, setter } from "./index";

export const getLicencias = async () => await getter("/licencias");

export const getZonasVL = async () => await getter("/operativos/zonas/vl");

export const getAllZonas = async () => await getter("/zonas");

export const getSeguridad = async () => await getEnums("seguridad");

export const getMotivosCamion = async () => await getEnums("motivos_camion");

export const getMotivosMoto = async () =>
  await getter("/operativos/motos/motivos");

export const nuevoOperativoAuto = async (body) =>
  await setter("/operativos/autos", body);

export const getOperativosAutos = async () => await getter("/operativos/autos");

export const getOperativosMotos = async () => await getter("/operativos/motos");

export const nuevoOperativoMoto = async (body) =>
  await setter("/operativos/motos", body);

export const getOperativosCamiones = async () =>
  await getter("/operativos/camiones");

export const nuevoOperativoCamiones = async (body) =>
  await setter("/operativos/camiones", body);
