import axios from "axios";

const BASE_URL = "http://MVLS-TRAN-80:3001";

export const getter = async (route) => {
  const { data } = await axios.get(BASE_URL + route);
  return data;
};

export const setter = async (route, body) => {
  const { data } = await axios.post(BASE_URL + route, body);
  return data;
};

export const getEnums = async (type) => await getter("/api/" + type);

export const getTurnos = async () => await getEnums("turnos");

export const getResolucion = async () => await getEnums("resolucion");

export const verifyAuth = async () => {
  const res = await axios.post(BASE_URL + "/auth/verify", null, {
    headers: { jwt_token: localStorage.token },
  });
  return res;
};
