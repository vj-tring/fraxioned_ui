import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

interface CustomPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (value: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({ page, totalPages, onPageChange }) => {
  const handlePreviousPage = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}
    
    >
              <Typography variant="body2" sx={{ margin: '0 16px' }}>
        {page} / {totalPages}
      </Typography>
        
      <IconButton onClick={handlePreviousPage} disabled={page === 1}   sx={{
                          borderRadius: '50%',
                          border: '1px solid #ddd',
                          margin: '0 2px',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          '&.Mui-selected': {
                            backgroundColor: '#3f51b5',
                            color: '#fff',
                          },
                          '&:hover': {
                            backgroundColor: '#f5f5f5',
                          },
'.css-i4bv87-MuiSvgIcon-root':{
                            fontSize:'1.0rem',
                            paddingLeft: '4px'
                            
                          }              ,           boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px'
                        }}>
        <ArrowBackIos />
      </IconButton>

      <IconButton onClick={handleNextPage} disabled={page === totalPages}   sx={{
                          borderRadius: '50%',
                          border: '1px solid #ddd',
                          margin: '0 2px',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          '&.Mui-selected': {
                            backgroundColor: '#3f51b5',
                            color: '#fff',
                          },
                          marginLeft:'4px',
                          '&:hover': {
                            backgroundColor: '#f5f5f5',
                          },
                          '.css-i4bv87-MuiSvgIcon-root':{
                            fontSize:'1.0rem',
                            paddingLeft: '4px',
                            marginRight: '3px',
                            
                          }, boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px'
                        }}>
        <ArrowForwardIos />
      </IconButton>
    </Box>
  );
};

export default CustomPagination;
