
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import './Loader.css';

const Loader = () => {
  return (
    
    <Box className='loading-spinner'>
  
      <CircularProgress color='primary'  className='spinner' />
      
    </Box>
  );
};

export default Loader;