import Image from 'next/image'
import React from 'react'

function Loader() {
  return <Image src="@/assets/loading.gif" alt="loading" width={100} />
}

export default Loader
