'use client'
import React, { PropsWithChildren } from 'react'
import Button from './Button'
import jsonexport from 'jsonexport'

function CSVDownloadButton({
  children,
  fetcher,
}: PropsWithChildren<{ fetcher: (args?: any) => any }>) {
  const onClick: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    const _data = await fetcher()
    jsonexport(_data, (err: Error, csv: string) => {
      if (err) return console.log(err)
      const filename = new Date().toISOString()
      const fakeLink = document.createElement('a')
      fakeLink.style.display = 'none'
      document.body.appendChild(fakeLink)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
      // @ts-ignore
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // Manage IE11+ & Edge
        // @ts-ignore
        window.navigator.msSaveOrOpenBlob(blob, `${filename}.csv`)
      } else {
        fakeLink.setAttribute('href', URL.createObjectURL(blob))
        fakeLink.setAttribute('download', `${filename}.csv`)
        fakeLink.click()
      }
    })
  }

  return <Button onClick={onClick}>{children}</Button>
}

export default CSVDownloadButton
