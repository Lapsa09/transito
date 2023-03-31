import React, { useState } from 'react'
import {
  MenuItem,
  Menu,
  styled,
  alpha,
  Card,
  CardContent,
  Typography,
  CardActions,
  MenuProps,
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}))

const cardStyle = {
  backgroundColor: '#b7e912',
  color: 'white',
  cursor: 'pointer',
}

export function CustomizedMenus({ children, id, label }) {
  const [anchor, setAnchor] = useState({ id: null, anchorEl: null })
  const open = Boolean(anchor.id === id)

  const handleClose = () => {
    setAnchor({ id: null, anchorEl: null })
  }

  const handleClick = (e, _id) => {
    setAnchor({ id: _id, anchorEl: e.currentTarget })
  }

  return (
    <div>
      <Card sx={cardStyle} onClick={(e) => handleClick(e, id)}>
        <CardContent>
          <Typography variant="h2">{label}</Typography>
        </CardContent>
        <CardActions>
          <KeyboardArrowDownIcon
            id="demo-customized-button"
            aria-controls={open ? 'demo-customized-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          />
        </CardActions>
      </Card>

      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchor.anchorEl}
        open={open}
        onClose={handleClose}
      >
        {children}
      </StyledMenu>
    </div>
  )
}

export const CustomMenuItem = ({ onClick, children }) => {
  return (
    <MenuItem onClick={onClick} disableRipple>
      {children}
    </MenuItem>
  )
}
