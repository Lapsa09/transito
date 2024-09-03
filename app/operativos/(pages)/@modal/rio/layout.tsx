import React, { PropsWithChildren } from 'react'
import FormHeader from './header'
import CustomModal from '@/components/Modal'

function layout({ children }: PropsWithChildren) {
  return (
    <CustomModal>
      <div className="flex flex-col justify-center items-center px-6">
        <FormHeader />
        {children}
      </div>
    </CustomModal>
  )
}

export default layout
