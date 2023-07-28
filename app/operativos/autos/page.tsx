import { getAutos } from '@/services'
import ClientTable from './ClientTable'

async function page() {
  const data = await getAutos()
  return <ClientTable data={data} />
}

export default page
