import { setter } from "./index";

export const register = async (body) => {
  const res = await setter("/auth/register", body);
  return res;
};

export const login = async (body) => {
  return await setter("/auth/login", body);
};
