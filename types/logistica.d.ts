import {
  dependencia,
  kilometraje_fecha,
  kilometraje_vehiculos,
  logistica_tipo_vehiculo,
  movil,
  proveedor,
  reparaciones,
  sector,
  suministro,
} from '@prisma/client'

export interface Vehiculo extends movil {
  sector: sector
  dependencia: dependencia
  tipo_vehiculo: logistica_tipo_vehiculo
}

export interface KilometrajeVehiculo extends kilometraje_fecha {
  kilometraje_vehiculos: kilometraje_vehiculos
}

export interface Reparacion extends reparaciones {
  suministro: suministro & {
    proveedor: proveedor
  }
}
