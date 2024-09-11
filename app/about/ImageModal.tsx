import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

type Props = {
  img: string
  alt?: string
  className?: string
  height: number
  width: number
}

function ImageModal({ img, alt = 'image', className, height, width }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image
          className={cn('cursor-pointer', className)}
          src={img}
          width={500}
          height={500}
          alt={alt}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-screen overflow-y-auto">
        <DialogTitle className="hidden"></DialogTitle>
        <Image
          src={img}
          height={height}
          // className="object-contain"
          className="w-auto h-auto"
          width={width}
          alt={alt}
        />
      </DialogContent>
    </Dialog>
  )
}

export default ImageModal
