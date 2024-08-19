import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import PeopleIcon from '@mui/icons-material/People';
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly';
import PetsIcon from '@mui/icons-material/Pets';
import './guest-selector.css';
import { RootState } from '@/store/reducers';

const names = [
  { label: 'Adults', description: 'Ages 13 or above', icon: <PeopleIcon /> },
  { label: 'Children', description: 'Ages 2 to 12', icon: <ChildFriendlyIcon /> },
  { label: 'Infants', description: 'Under 2', icon: <PeopleIcon /> },
  { label: 'Pets', description: 'Bringing a service?', icon: <PetsIcon /> },
];


const MultipleSelect: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const selectedPropertyId = useSelector((state: RootState) => state.properties.selectedPropertyId);
  const selectedPropertyLimits = useSelector((state: RootState) => state.properties.selectedPropertyLimits);

  const [counts, setCountsLocal] = useState<{ [key: string]: number }>({
    Adults: 1,
    Children: 0,
    Infants: 0,
    Pets: 0,
  });
  const [validationMessage, setValidationMessage] = useState<string>('');


 
  useEffect(() => {
    validateCounts();
  }, [selectedPropertyLimits, counts]);

  const validateCounts = () => {
    if (!selectedPropertyLimits) return;

    const { noOfGuestsAllowed, noOfPetsAllowed } = selectedPropertyLimits;
    const totalGuests = counts.Adults + counts.Children + counts.Infants;
    const totalPets = counts.Pets;

    let message = '';
    if (counts.Adults < 1) {
      message = 'At least one adult is required.';
    } else if (totalGuests > noOfGuestsAllowed ) {
      message = `The total number of guests cannot exceed ${noOfGuestsAllowed }.`;
    } else if (totalPets > noOfPetsAllowed) {
      message = `The number of pets cannot exceed ${noOfPetsAllowed}.`;
    }

    setValidationMessage(message);
    return message === '';
  };

  const handleCountChange = (name: string, action: 'increase' | 'decrease') => {
    if (!selectedPropertyLimits) {
      setValidationMessage('Please select a property before making changes.');
      return;
    }

    const maxLimit = name === 'Pets' ? selectedPropertyLimits.noOfPetsAllowed : (selectedPropertyLimits.noOfGuestsAllowed - counts.Pets);
    const currentCount = counts[name];

    let newCount: number;

    if (action === 'increase') {
      newCount = currentCount + 1;
      if (name === 'Pets' && newCount > maxLimit) return;
      if (name !== 'Pets' && (counts.Adults + counts.Children + counts.Infants) + (name === 'Infants' ? 1 : 0) > maxLimit) return;
    } else {
      newCount = Math.max(currentCount - 1, 0);
    }

    setCountsLocal((prevCounts) => ({
      ...prevCounts,
      [name]: newCount
    }));
  };

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setCountsLocal({
      Adults: 1,
      Children: 0,
      Infants: 0,
      Pets: 0,
  });
  };

  const handleClose = () => {
    setAnchorEl(null);
    setValidationMessage(''); 
  };

  useEffect(() => {
    const handleScroll = () => {
      if (open) {
        handleClose();
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [open]);

  return (
    <Box sx={{ width: '30%' }}>
      <Button
        disableRipple
        aria-controls="basic-menu"
        aria-haspopup="true"
        onClick={handleOpen}
        className="PropertyBtn"
        sx={{
          borderRadius: 10,
          width: 348,
          height: 70,
          border: 'none',
          cursor: 'pointer',
          paddingRight: 30,
        }}
      >
        <div className="d-flex align-items-start flex-column">
          <span className="DateHead1 monsterrat">Who</span>
          <p className="property1 monsterrat">Add guests</p>
        </div>
      </Button>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: 380,
            borderRadius: '8px',
            maxHeight: '400px',
            overflowY: 'auto',
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
            sx={{ borderRadius: 0,
               borderBottom: "1px solid #E8E8E8",
               width:"90%",
               marginLeft:"20px"
              }}
            disableRipple
          >
            <div className="d-flex justify-content-between w-100 MultiItems monsterrat">
              <Avatar
                sx={{
                  backgroundColor: '#df9526',
                  marginRight: '12px',
                  marginTop: '12px'
                }}
                className='monsterrat'
              >
                {item.icon}
              </Avatar>
              <div className="w-50">
                <b className="itemLabel monsterrat">{item.label}</b>
                <p className="DescFont monsterrat">{item.description}</p>

              </div>
            

              <div className="d-flex justify-content-around w-50 pb-2">
                <button
                  className="Dec-circle monsterrat"
                  disabled={counts[item.label] === 0}
                  onClick={() => handleCountChange(item.label, 'decrease')}
                >
                  -
                </button>
                <p className="Ad-count monsterrat">{counts[item.label]}</p>
                <button
                  className={`Inc-circle monsterrat ${!selectedPropertyId ? 'disabled' : 'enabled'}`}
                  disabled={!selectedPropertyId || (selectedPropertyLimits ? counts[item.label] >= (item.label === 'Pets' ? selectedPropertyLimits.noOfPetsAllowed : selectedPropertyLimits.noOfGuestsAllowed - counts.Pets) : true)}
                  onClick={() => handleCountChange(item.label, 'increase')}
                >
                  +
                </button>
              </div>
              
            </div>
        
          </MenuItem>
          
        ))}
        
        <div className='validationMsg monsterrat'>
          {validationMessage && (
            <p style={{ color: 'red', textAlign: 'center' }}>
              {validationMessage}
            </p>
          )}
        </div>
      </Menu>
    </Box>
  );
};

export default MultipleSelect;
