const EspEne = 600;
const EspFeb = 600;
const EspAbr = 400;
const EspMar = 400;
const EspMay = 400;
const EspJun = 400;
const EspJul = 400;
const EspAgo = 400;
const EspSep = 400;
const EspOct = 400;
const EspNov = 400;
const EspDic = 400;

export const EsperadoCamiones = [
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

const meanByDay = EsperadoCamiones[currentDate.getMonth()] / totalDaysInMonth;

export const normalization = Math.ceil(differenceInDays * meanByDay);
