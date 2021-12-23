export const validDomain = (dominio) => {
  const regex =
    /([A-Z]{3}[0-9]{3})|([A-Z]{2}[0-9]{3}[A-Z]{2})|([0-9]{3}[A-Z]{3})/;

  return dominio != "" && regex.test(dominio);
};

export const validField = (content) => {
  return content != "";
};

export const validLegajo = (legajo) => {
  const regex = /[0-9]+/;

  return legajo != "" && regex.test(legajo);
};
