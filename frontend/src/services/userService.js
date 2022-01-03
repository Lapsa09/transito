import { setter } from "./index";

export const register = async (body) => {
  const res = await setter("/auth/register", body);
  return res;
};
