import React, { useState, useEffect } from 'react'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import Avatar from '@mui/material/Avatar'
import PeopleIcon from '@mui/icons-material/People'
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly'
import PetsIcon from '@mui/icons-material/Pets'
import './guest-selector.css'

const names = [
  { label: 'Adults', description: 'Ages 13 or above', icon: <PeopleIcon /> },
  {
    label: 'Children',
    description: 'Ages 2 to 12',
    icon: <ChildFriendlyIcon />,
  },
  { label: 'Infants', description: 'Under 2', icon: <PeopleIcon /> },
  { label: 'Pets', description: 'Bringing a service?', icon: <PetsIcon /> },
]

const GuestSelector: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const [counts, setCounts] = useState<{ [key: string]: number }>({
    Adults: 1,
    Children: 0,
    Infants: 0,
    Pets: 0,
  })

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleCountChange = (name: string, action: 'increase' | 'decrease') => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [name]:
        action === 'increase'
          ? prevCounts[name] + 1
          : Math.max(prevCounts[name] - 1, 0),
    }))
  }

  useEffect(() => {
    const handleScroll = () => {
      if (open) {
        handleClose()
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [open])

  return (
    <Box sx={{ width: '30%' }}>
      <Button
        aria-controls="basic-menu"
        aria-haspopup="true"
        onClick={handleClick}
        variant="outlined"
        className="PropertyBtn"
        sx={{
          borderRadius: 10,
          width: 275,
          height: 70,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <div className="d-flex flex-column pt-3 text-align-center">
          <span className="DateHead1">Who</span>
          <p className="property1"> Add guests</p>
        </div>
      </Button>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: 380,
            borderRadius: '8px',
            overflow: 'hidden',
            position: 'fixed',
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {names.map((item) => (
          <MenuItem
            key={item.label}
            sx={{
              borderRadius: 0,
            }}
            disableRipple
          >
            <div className="d-flex justify-content-between w-100 MultiItems">
              <Avatar
                sx={{
                  backgroundColor: '#df9526',
                  marginRight: '12px',
                }}
              >
                {item.icon}
              </Avatar>
              <div className=" w-50 ">
                <b className="itemLabel">{item.label}</b>
                <p className="DescFont">{item.description}</p>
              </div>
              <div className="d-flex justify-content-around w-50 pb-2">
                <button
                  className="Dec-circle"
                  disabled={counts[item.label] === 0}
                  onClick={() => handleCountChange(item.label, 'decrease')}
                >
                  -
                </button>
                <p className="Ad-count ">{counts[item.label]}</p>
                <button
                  className="Inc-circle"
                  onClick={() => handleCountChange(item.label, 'increase')}
                >
                  +
                </button>
              </div>
            </div>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default GuestSelector
