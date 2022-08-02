import { getEnums, getter, setter } from './index';

export const getMotivos = async () => await getter('/motivos');

export const getLocalidades = async () => await getter('/zonas');

export const getZonasVL = async () => await getter('/zonas/vl');

export const nuevoControl = async (body) =>
  await setter('/control/diario', body);

export const nuevoControlPaseo = async (body) =>
  await setter('/control/paseo', body);

export const getMotivosPaseo = async () => await getEnums('motivo');

export const getControles = async () => await getter('/control/diario');

export const getControlesPaseo = async () => await getter('/control/paseo');

export const getZonasPaseo = async () => await getter('/control/paseo/zonas');

export const getDatosPaseo = async (filter) =>
  await setter('/control/paseo/data', filter);
