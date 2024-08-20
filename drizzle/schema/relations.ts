import { relations } from 'drizzle-orm/relations'
import {
  operativos as operativosInCamiones,
  registros as registrosInCamiones,
} from './camiones'
import { rindeExamen as rindeExamenInExamen } from './examen'

import {
  motoMotivo as motoMotivoInMotos,
  operativos as operativosInMotos,
  registros as registrosInMotos,
} from './motos'
import { registros as registrosInNuevoControl } from './nuevo_control'
import {
  operativos as operativosInOperativos,
  registros as registrosInOperativos,
} from './operativos'
import {
  barrios,
  grupoEtario,
  invitados,
  mensual,
  motivos,
  operario,
  permisos,
  puntajes,
  tipoLicencias,
  users,
  vicenteLopez,
} from './schema'

export const permisosRelations = relations(permisos, ({ many }) => ({
  users: many(users),
}))

export const usersRelations = relations(users, ({ one }) => ({
  permiso: one(permisos, {
    fields: [users.idRol],
    references: [permisos.id],
  }),
}))

export const barriosRelations = relations(barrios, ({ many }) => ({
  camionesDestino: many(registrosInCamiones, {
    relationName: 'registrosInCamiones_idLocalidadDestino_barrios_idBarrio',
  }),
  camionesOrigen: many(registrosInCamiones, {
    relationName: 'registrosInCamiones_idLocalidadOrigen_barrios_idBarrio',
  }),
  rio: many(registrosInNuevoControl),
  motos: many(registrosInMotos),
  autos: many(registrosInOperativos),
}))

export const motivosRelations = relations(motivos, ({ many }) => ({
  camiones: many(registrosInCamiones),
  autos: many(registrosInOperativos),
  motos: many(motoMotivoInMotos),
}))

export const vicenteLopezRelations = relations(vicenteLopez, ({ many }) => ({
  camiones: many(operativosInCamiones),
  motos: many(operativosInMotos),
  autos: many(operativosInOperativos),
}))

export const tipoLicenciasRelations = relations(tipoLicencias, ({ many }) => ({
  motos: many(registrosInMotos),
  operativos: many(registrosInOperativos),
}))

export const puntajesRelations = relations(puntajes, ({ one }) => ({
  mensual: one(mensual, {
    fields: [puntajes.idMes],
    references: [mensual.id],
  }),
  operario: one(operario, {
    fields: [puntajes.legajo],
    references: [operario.legajo],
  }),
}))

export const mensualRelations = relations(mensual, ({ many }) => ({
  puntajes: many(puntajes),
}))

export const operarioRelations = relations(operario, ({ many }) => ({
  puntajes: many(puntajes),
}))

export const invitadosRelations = relations(invitados, ({ one, many }) => ({
  examen: one(rindeExamenInExamen),
  grupoEtario: one(grupoEtario, {
    fields: [invitados.idEdad],
    references: [grupoEtario.id],
  }),
}))

export const grupoEtarioRelations = relations(grupoEtario, ({ many }) => ({
  invitados: many(invitados),
}))
