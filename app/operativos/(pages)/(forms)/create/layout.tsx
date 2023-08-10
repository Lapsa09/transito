import React from 'react'
import FormLayout from '@/components/forms/layout.form'

function layout({ children }: React.PropsWithChildren) {
  return (
    <FormLayout className="flex flex-col justify-center items-center px-6">
      {children}
    </FormLayout>
  )
}

export default layout
