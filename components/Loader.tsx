import Image from 'next/image'
import React from 'react'
import LoadingImg from '@/assets/loading.gif'

function Loader() {
  return <Image src={LoadingImg} alt="loading" width={100} />
}

export default Loader
