'use client'
import { useRouter } from 'next/navigation'
import { Modal, ModalContent } from '@nextui-org/react'

export default function CustomModal({ children }: React.PropsWithChildren) {
  const router = useRouter()

  return (
    <Modal isOpen onOpenChange={router.back} size="4xl">
      <ModalContent className="p-6">{children}</ModalContent>
    </Modal>
  )
}
