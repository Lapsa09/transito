import axios from "axios";

const BASE_URL = "http://localhost:3001";

export const getter = async (route) => {
  const { data } = await axios.get(BASE_URL + route);
  return data;
};

export const setter = async (route, body) => {
  const { data } = await axios.post(BASE_URL + route, body);
  return data;
};

export const getEnums = async (type) => await getter("/api/" + type);

export const getTurnos = async () => await getEnums("turno");

export const getResolucion = async () => await getEnums("resolucion");