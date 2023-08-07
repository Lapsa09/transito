import React from 'react'
import {
  Drawer,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from '@material-tailwind/react'
import { useBoolean } from 'usehooks-ts'
import { AiOutlineClose } from 'react-icons/ai'
import Link from 'next/link'

export default function DrawerWithNavigation() {
  const { value, setTrue, setFalse } = useBoolean(false)

  return (
    <React.Fragment>
      <Button onClick={setTrue}>Open Drawer</Button>
      <Drawer open={value} onClose={setFalse}>
        <div className="mb-2 flex items-center justify-between p-4">
          <Typography variant="h5" color="blue-gray">
            Side Menu
          </Typography>
          <IconButton variant="text" color="blue-gray" onClick={setFalse}>
            <AiOutlineClose />
          </IconButton>
        </div>
        <List>
          <Link href="/sueldos/clientes">
            <ListItem>Clientes</ListItem>
          </Link>
          <Link href="/sueldos/servicios">
            <ListItem>Servicios</ListItem>
          </Link>
          <Link href="/sueldos/operarios">
            <ListItem>Operarios</ListItem>
          </Link>
          <Link href="/sueldos/liqui">
            <ListItem>Liqui</ListItem>
          </Link>
        </List>
      </Drawer>
    </React.Fragment>
  )
}
