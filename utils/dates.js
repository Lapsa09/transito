import { DateTime } from "luxon";

export const dateFormat = (date) =>
  DateTime.fromISO(date, {
    zone: "America/Argentina/Buenos_Aires",
  }).toFormat("dd/MM/yyyy");

export const timeFormat = (time) =>
  DateTime.fromISO(time, {
    zone: "America/Argentina/Buenos_Aires",
  }).toFormat("HH:mm");

export const dateTimeFormat = (datetime) =>
  DateTime.fromISO(datetime, {
    zone: "America/Argentina/Buenos_Aires",
  }).toFormat("dd/MM/yyyy HH:mm");

export const currentDate = () => DateTime.now().setLocale("es-AR");

export const dateTimeSQLFormat = (datetime) =>
  DateTime.fromSQL(datetime, {
    zone: "America/Argentina/Buenos_Aires",
  }).toFormat("dd/MM/yyyy HH:mm");
