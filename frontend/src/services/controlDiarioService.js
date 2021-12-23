import { getEnums, getter, setter } from "./index";

export const getMotivos = async () => await getter("/control/motivos");

export const getLocalidades = async () => await getter("/control/zonas");

export const nuevoControl = async (body) => await setter("/control", body);

export const nuevoControlPaseo = async (body) =>
  await setter("/control/paseo", body);

export const getMotivosPaseo = async () => await getEnums("motivo");
