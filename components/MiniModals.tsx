'use client'

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
import { FieldValues, SubmitHandler, useFormContext } from 'react-hook-form'
import {
  createCliente,
  createOperario,
  getSelects,
  updateMemo,
} from '@/services'
import { mutate } from 'swr'
import { servicios } from '@prisma/client'
import { toast } from '@/hooks'
import { IoMdAdd } from 'react-icons/io'
import { RegularForm } from './forms/layout.form'

type Data = Awaited<ReturnType<typeof getSelects>>

export const NuevoCliente = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const { setValue } = useFormContext()
  const onSubmit: SubmitHandler<FieldValues> = async (body) => {
    try {
      const req = await createCliente({ body })

      await mutate<Data>(
        'api/selects',
        (data) => {
          data?.clientes.push(req)

          return data
        },
        {
          revalidate: false,
        },
      )

      setValue('cliente', req)

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
          <RegularForm onSubmit={onSubmit}>
            <ModalBody>
              <Input name="cliente" label="Cliente" />
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Cerrar</Button>
              <Button type="submit">Guardar</Button>
            </ModalFooter>
          </RegularForm>
        </ModalContent>
      </Modal>
    </>
  )
}

export const NuevoOperario = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  const onSubmit: SubmitHandler<FieldValues> = async (body) => {
    try {
      const req = await createOperario({ body })

      await mutate<Data>(
        'api/selects',
        (data) => {
          data?.operarios.push(req)

          return data
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
      <Button className="py-3" onClick={onOpen}>
        <IoMdAdd />
      </Button>
      <Modal size="sm" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Nuevo Cliente
          </ModalHeader>
          <RegularForm onSubmit={onSubmit}>
            <ModalBody>
              <Input name="legajo" label="Legajo" type="number" />
              <Input name="nombre" label="Nombre" />
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Cerrar</Button>
              <Button type="submit">Guardar</Button>
            </ModalFooter>
          </RegularForm>
        </ModalContent>
      </Modal>
    </>
  )
}

export const NumeroMemo = ({ id_servicio }: { id_servicio: number }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  const onSubmit: SubmitHandler<FieldValues> = async (body) => {
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
          <RegularForm onSubmit={onSubmit}>
            <ModalBody>
              <Input name="memo" label="Memo" />
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Cerrar</Button>
              <Button type="submit">Guardar</Button>
            </ModalFooter>
          </RegularForm>
        </ModalContent>
      </Modal>
    </>
  )
}
