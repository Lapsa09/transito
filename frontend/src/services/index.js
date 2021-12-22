import axios from "axios";

const BASE_URL = "http://localhost:3001";

export const getter = async (route) => {
  const { data } = axios.get(BASE_URL + route);
  return data;
};

export const setter = async (route, body) =>
  await axios.post(BASE_URL + route, body);

export const getEnums = async (type) => await getter("/api/" + type);
