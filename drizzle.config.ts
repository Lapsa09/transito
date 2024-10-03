import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  out: './drizzle/schema',
  schema: './drizzle/schema/*',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
  schemaFilter: [
    'public',
    'operativos',
    'motos',
    'camiones',
    'nuevo_control',
    'logistica',
    'radio',
    'examen',
    'sueldos',
    'waze',
  ],
})
