import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLimits, resetLimits } from '../../../Redux/slice/auth/propertyGuestSlice';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import PeopleIcon from '@mui/icons-material/People';
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly';
import PetsIcon from '@mui/icons-material/Pets';
import '../DatesContainer/Multiselect.css';
import { RootState } from '../../../Redux/reducers/index';

const names = [
  { label: 'Adults', description: 'Ages 13 or above', icon: <PeopleIcon /> },
  { label: 'Children', description: 'Ages 2 to 12', icon: <ChildFriendlyIcon /> },
  { label: 'Infants', description: 'Under 2', icon: <PeopleIcon /> },
  { label: 'Pets', description: 'Bringing a service?', icon: <PetsIcon /> },
];

const MultipleSelect: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const { limits, loading, error } = useSelector((state: RootState) => state.limitSlice);

  const [counts, setCountsLocal] = useState<{ [key: string]: number }>({
    Adults: 1,
    Children: 0,
    Infants: 0,
    Pets: 0,
  });
  const [validationMessage, setValidationMessage] = useState<string>('');

  useEffect(() => {
    dispatch(fetchLimits() as any); 
  }, [dispatch]);

  useEffect(() => {
    if (limits) {
      setCountsLocal((prevCounts) => {
        const updatedCounts = { ...prevCounts };
        Object.keys(prevCounts).forEach((key) => {
          if (limits[key] !== undefined && prevCounts[key] > limits[key]) {
            updatedCounts[key] = limits[key];
          }
        });
        return updatedCounts;
      });
    }
  }, [limits]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const validateCounts = () => {
    if (!limits) return true; // No validation if limits are not loaded

    let message = '';
    for (const [name, count] of Object.entries(counts)) {
      const limit = limits[name];
      if (count > limit) {
        message = `The number of ${name.toLowerCase()} cannot exceed ${limit}.`;
        break;
      }
    }
    setValidationMessage(message);
    return message === ''; // Return true if no validation message
  };

  const handleCountChange = (name: string, action: 'increase' | 'decrease') => {
    const newCount =
      action === 'increase'
        ? counts[name] + 1
        : Math.max(counts[name] - 1, 0);

    if (validateCounts()) {
      setCountsLocal((prevCounts) => ({
        ...prevCounts,
        [name]: newCount,
      }));
      // Update Redux store if necessary
    }
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
        onClick={handleClick}
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
        <div className="d-flex align-items-start flex-column pt-3">
          <span className="DateHead1 monsterrat">Who</span>
          <p className="property1 monsterrat"> Add guests</p>
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
            sx={{ borderRadius: 0 }}
            disableRipple
          >
            <div className="d-flex justify-content-between w-100 MultiItems monsterrat">
              <Avatar
                sx={{
                  backgroundColor: '#df9526',
                  marginRight: '12px',
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
                  className="Inc-circle monsterrat"
                  disabled={limits ? counts[item.label] >= limits[item.label] : true}
                  onClick={() => handleCountChange(item.label, 'increase')}
                >
                  +
                </button>
              </div>
            </div>
          </MenuItem>
        ))}
        <div style={{ padding: '10px', borderTop: '1px solid #ddd' }}>
          {validationMessage && (
            <p style={{ color: 'red', textAlign: 'center' }}>
              {validationMessage}
            </p>
          )}
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        </div>
      </Menu>
    </Box>
  );
};

export default MultipleSelect;
