export const validDomain = (dominio) => {
  const regex =
    /([A-Z]{3}[0-9]{3})|([A-Z]{2}[0-9]{3}[A-Z]{2})|([0-9]{3}[A-Z]{3})/;

  return validField(dominio) && regex.test(dominio);
};

export const validField = (content) => {
  return content != null && content != "";
};

export const validLegajo = (legajo) => {
  const regex = /[0-9]+/;

  return validField(legajo) && regex.test(legajo);
};

export const validTime = (hora) => {
  if (hora == null) return false;
  return validField(hora) && hora.isValid;
};

export const validDate = (fecha) => {
  if (fecha == null) return false;
  return validField(fecha) && fecha.isValid;
};
