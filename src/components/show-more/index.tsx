import React, { useState } from 'react';
import { Button, Typography, Grid, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import './show-more.css';

interface ShowMoreProps {
  description?: string;
}
const Showmore: React.FC<ShowMoreProps> = ({ description }) => {
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

  const fullContent = `*March/April Specials* This brand new townhome is located just minutes away from the beautiful Bear Lake. We have filled the home with every amenity that you need to have an incredible family vacation in Garden City. With a fully stocked kitchen, cozy beds, large family room, game tables, baby and toddler necessities, and a garage full of toys.There's no better place to stay when visiting Bear Lake with the family !`;

  return (
    <div >
      <div>
        <Grid item xs={6} md={6}>
          <Typography className='Showmore'>
            {(description || fullContent).slice(0, 470) + '...'}
          </Typography>
          <Button onClick={handleClickOpen} className="mt-3 mb-4 monsterrat" style={{
            fontSize: '14px',
            textDecoration: 'underline',
            textTransform: 'capitalize',
            color: 'black',
            fontWeight: 'bolder',
            margin: 0,
            padding: 0
          }}
          >

            {showMore ? '< Show less ' : 'Show more >'}
          </Button>
        </Grid>
      </div>

      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm">
        <DialogTitle className='d-flex justify-content-between'>
          <Typography variant="h6" className='monsterrat'>Property Details</Typography>
          <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" className='monsterrat'>
            {(description || fullContent)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} className='monsterrat' color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

    </div>

  );
};

export default Showmore;