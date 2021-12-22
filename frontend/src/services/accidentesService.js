import axios from "axios";

const getter = async (route) => {
  const { data } = axios.get(route);
  return data;
};

// export const provincias = async () => await getter("/provincias");

// export const departamentos = async () => await getter("/deptos");

export const provincias = [];
export const departamentos = [];
