import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react'
import Button from './Button'
import Input from './Input'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { createCliente, createOperario, updateMemo } from '@/services'
import { mutate } from 'swr'
import { clientes, operario, servicios } from '@prisma/client'
import { toast } from '@/hooks'
import { IoMdAdd } from 'react-icons/io'

export const NuevoCliente = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const methods = useForm()
  const { handleSubmit } = methods

  const onSubmit = async (body: FieldValues) => {
    try {
      const req = await createCliente({ body })

      await mutate<clientes[]>(
        'clientes',
        (data) => (data ? [...data, req] : [req]),
        {
          revalidate: false,
        },
      )

      onClose()
    } catch (error) {
      toast({ title: 'Error', variant: 'destructive' })
    }
  }

  return (
    <>
      <Button className="py-3" onClick={onOpen}>
        <IoMdAdd />
      </Button>
      <Modal size="sm" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Nuevo Cliente
          </ModalHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormProvider {...methods}>
              <ModalBody>
                <Input name="cliente" label="Cliente" />
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Cerrar</Button>
                <Button type="submit">Guardar</Button>
              </ModalFooter>
            </FormProvider>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}

export const NuevoOperario = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const methods = useForm()
  const { handleSubmit } = methods

  const onSubmit = async (body: FieldValues) => {
    try {
      const req = await createOperario({ body })
      console.log(req)
      await mutate<operario[]>(
        'operarios',
        (data) => (data ? [...data, req] : [req]),
        {
          revalidate: false,
        },
      )

      onClose()
    } catch (error) {
      toast({ title: 'Error', variant: 'destructive' })
    }
  }

  return (
    <>
      <Button className="py-3" onClick={onOpen}>
        <IoMdAdd />
      </Button>
      <Modal size="sm" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Nuevo Cliente
          </ModalHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormProvider {...methods}>
              <ModalBody>
                <Input name="legajo" label="Legajo" type="number" />
                <Input name="nombre" label="Nombre" />
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Cerrar</Button>
                <Button type="submit">Guardar</Button>
              </ModalFooter>
            </FormProvider>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}

export const NumeroMemo = ({ id_servicio }: { id_servicio: number }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const methods = useForm()
  const { handleSubmit } = methods

  const onSubmit = async (body: FieldValues) => {
    try {
      await mutate<servicios[]>(
        'servicios',
        async (data) => {
          const req = await updateMemo({ body, id_servicio })
          if (data) {
            return data.map((servicio) => {
              if (servicio.id_servicio === req.id_servicio) {
                return req
              }
              return servicio
            })
          }
          return [req]
        },
        {
          revalidate: false,
        },
      )

      onClose()
    } catch (error) {
      toast({ title: 'Error', variant: 'destructive' })
    }
  }

  return (
    <>
      <Button onClick={onOpen}>Crear memo</Button>
      <Modal size="sm" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Nuevo Cliente
          </ModalHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <FormProvider {...methods}>
                <Input name="memo" label="Memo" />
              </FormProvider>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Cerrar</Button>
              <Button type="submit">Guardar</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}
