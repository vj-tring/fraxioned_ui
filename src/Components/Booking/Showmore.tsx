import React, { useState } from 'react';
import { Button, Typography, Grid, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './Showmore.css';
const Showmore = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showMore] = useState(false);

  // Open the dialog
  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  // Close the dialog
  const handleClose = () => {
    setDialogOpen(false);
  };

  const fullContent = "*March/April Specials* This brand new townhome is located just minutes away from the beautiful Bear Lake. We have filled the home with every amenity that you need to have an incredible family vacation in Garden City. With a fully stocked kitchen, cozy beds, large family room, game tables, baby and toddler necessities, and a garage full of toys.There's no better place to stay when visiting Bear Lake with the family!...";

  return (
    <div >
      <div className="row mt-2  ">
        <Grid container spacing={2} >
          <Grid item xs={6} md={9}>
            <Typography variant="body1" className='Showmore'>
              {fullContent.slice(0, 300) + '...'} 
            </Typography>
            <Button onClick={handleClickOpen} className="mt-2 mb-2 monsterrat"  style={{  fontSize: '14px',
            textDecoration: 'underline',
            textTransform: 'capitalize',
            color: 'black',
            fontWeight:'600',
            margin:0,
            padding:0

           }}

           >

          {showMore ? '< Show Less ' : 'Show More >'}
          </Button>
          </Grid>
        </Grid>
      </div>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle className='d-flex justify-content-between'>
          <Typography variant="h6" className='monsterrat'>Property Details</Typography>
          <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" className='monsterrat'>
            {fullContent}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}  className='monsterrat' color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

    </div>
    
  );
};

export default Showmore;
