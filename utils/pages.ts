import { Links, Roles } from '@/types'

export const operativos: Links[] = [
  { link: '/operativos/autos', name: 'Autos' },
  { link: '/operativos/motos', name: 'Motos' },
  { link: '/operativos/camiones', name: 'Camiones' },
  { link: '/operativos/rio', name: 'Rio' },
]

export const pages: Links[] = [
  {
    name: 'Operativos',
    link: '/operativos',
    links: operativos,
    permission: Roles.INSPECTOR,
  },
  {
    name: 'Admision',
    link: '/',
    links: [
      { link: '/admision/examen', name: 'Examen', permission: Roles.PROFESOR },
      { link: '/admision/empleados', name: 'Empleados' },
    ],
  },
  { name: 'Sueldos', permission: Roles.ADMINISTRATIVO, link: '/sueldos' },
  { name: 'Logistica', permission: Roles.LOGISTICA, link: '/logistica' },
  {
    name: 'Radio',
    permission: Roles.RADIO,
    link:
      '/radio/partes?filter=fecha=' + new Date().toISOString().split('T')[0],
  },
]
