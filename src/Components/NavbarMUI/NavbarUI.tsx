import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import fraxionedLogo from '../../assets/Fraxioned.png';
// import Container from '@mui/material/Container';



function ResponsiveAppBar() {
 

  return (
    <AppBar position="static" sx={{ boxShadow: 'none', backgroundColor: 'white' }}>

    <Toolbar disableGutters>
    <Typography
      variant="h6"
      noWrap
      component="a"
      href="#app-bar-with-responsive-menu"
      sx={{
        mr: 2,
        display: { xs: 'none', md: 'flex' },
        fontFamily: 'onospace',
        fontWeight: 700,
        letterSpacing: '.3rem',
        color: 'inherit',
        textDecoration: 'none',
      }}
    >
  <img src={fraxionedLogo} alt="Fraxioned Logo" style={{ width: 200, height: 50 }} />
</Typography>

         
       
        </Toolbar>
      {/* </Container> */}
    </AppBar>
  );
}
export default ResponsiveAppBar;
