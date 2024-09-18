const EspEne = 1500;
const EspFeb = 1900;
const EspMar = 1900;
const EspAbr = 1900;
const EspMay = 1900;
const EspJun = 1900;
const EspJul = 1900;
const EspAgo = 2500;
const EspSep = 1900;
const EspOct = 1900;
const EspNov = 1900;
const EspDic = 1900;

export const EsperadoAutos = [
  EspEne,
  EspFeb,
  EspMar,
  EspAbr,
  EspMay,
  EspJun,
  EspJul,
  EspAgo,
  EspSep,
  EspOct,
  EspNov,
  EspDic,
];

const currentDate = new Date();
const firstDayOfMonth = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  1
);
const differenceInDays = Math.floor(
  (currentDate.getTime() - firstDayOfMonth.getTime()) / (1000 * 60 * 60 * 24) +
    1
);
const totalDaysInMonth = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth() + 1,
  0
).getDate();
const meanByDay = EsperadoAutos[currentDate.getMonth()] / totalDaysInMonth;

export const normalization = Math.ceil(differenceInDays * meanByDay);
