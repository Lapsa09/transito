const EspEne = 1000;
const EspFeb = 1000;
const EspMar = 1000;
const EspAbr = 1000;
const EspMay = 1200;
const EspJun = 1200;
const EspJul = 1200;
const EspAgo = 1200;
const EspSep = 1200;
const EspOct = 1200;
const EspNov = 1200;
const EspDic = 1200;

export const EsperadoMotos = [
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

const meanByDay = EsperadoMotos[currentDate.getMonth()] / totalDaysInMonth;

export const normalization = Math.ceil(differenceInDays * meanByDay);
