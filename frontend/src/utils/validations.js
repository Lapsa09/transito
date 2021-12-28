export const validDomain = (dominio) => {
  const regex =
    /([A-Z]{3}[0-9]{3})|([A-Z]{2}[0-9]{3}[A-Z]{2})|([0-9]{3}[A-Z]{3})/;

  return validField(dominio) && regex.test(dominio);
};

export const validField = (content) => {
  return content != "";
};

export const validLegajo = (legajo) => {
  const regex = /[0-9]+/;

  return validField(legajo) && regex.test(legajo);
};

export const validTime = (hora) => {
  const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/gi;
  return validField(hora) && regex.test(hora);
};

export const validDate = (fecha) => {
  const regex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/gi;
  return validField(fecha) && regex.test(fecha);
};
