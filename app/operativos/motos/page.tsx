import { getMotos } from '@/services'
import ClientTable from './ClientTable'

async function page() {
  const data = await getMotos()

  return <ClientTable data={data} />
}

export default page
