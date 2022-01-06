import { getEnums, getter, setter } from "./index";

export const getMotivos = async () => await getter("/motivos");

export const getLocalidades = async () => await getter("/zonas");

export const nuevoControl = async (body) => await setter("/control", body);

export const nuevoControlPaseo = async (body) =>
  await setter("/control/paseo", body);

export const getMotivosPaseo = async () => await getEnums("motivo");

export const getControles = async () => await getter("/control");

export const getControlesPaseo = async () => await getter("/control/paseo");
