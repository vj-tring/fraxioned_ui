import React, { useEffect, useState } from 'react';
// import { TextField, Select, MenuItem, InputLabel, FormControl, Alert, CircularProgress, Box } from '@mui/material';
// import { styled } from '@mui/system';
// import useSendInviteHandler from "./SendInviteFunction";
// import axios from 'axios';
// import { ApiUrl } from '../config';
// import './sendInvite.css';



// const StyledButton = styled('button')({
//   backgroundColor: '#ffffff',
//   color: '#F7981D',
//   border: '2px solid #F7981D',
//   borderRadius: 5,
//   width: '100%',
//   padding: '10px 20px',
//   fontSize: 16,
//   cursor: 'pointer',
//   '&:hover': {
//     backgroundColor: '#F7981D',
//     color: '#ffffff',
//   },
//   '&:disabled': {
//     cursor: 'not-allowed',
//     opacity: 0.5,
//   },
// });

// const SendInvite: React.FC = () => {
//   const {
//     handleSubmit,
//     email,
//     status,
//     errorMessage,
//     setEmail,
//     selectedRole,
//     setSelectedRole
//   } = useSendInviteHandler();

//   const [roles, setRoles] = useState<{ id: number, roleName: string }[]>([]);

//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const response = await axios.get(`${ApiUrl}/roles`);
//         setRoles(response.data);
//       } catch (error) {
//         // console.error('Failed to fetch roles:', error);
//       }
//     };

//     fetchRoles();
//   }, []);

//   return (
//     <form onSubmit={handleSubmit} >
//       <Box mt={3} mb={2} >
//         <TextField
//           fullWidth

//           label="Enter email"
//           placeholder='Enter email'
//           variant="outlined"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//       </Box>

//       <Box mt={3} mb={2}>
//         <FormControl fullWidth variant="outlined">
//           <InputLabel id="select-role-label">Select role</InputLabel>
//           <Select
//             labelId="select-role-label"
//             value={selectedRole}
//             onChange={(e) => setSelectedRole(Number(e.target.value))}
//             label="Select role"
//             required
//           >
//             <MenuItem value=""><em>None</em></MenuItem>
//             {roles.map(role => (
//               <MenuItem key={role.id} value={role.id}>{role.roleName}</MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Box>

//       <Box mt={3} mb={2}>
//         <StyledButton
//           type="submit"
//           disabled={status === 'loading'}
//         >
//           {status === 'loading' ? <CircularProgress size={24} /> : 'Send Invite'}
//         </StyledButton>
//       </Box>

//       {status === 'success' && (
//         <Alert severity="success" className="mt-3">
//           Invite sent successfully!
//         </Alert>
//       )}

//       {status === 'error' && (
//         <Alert severity="error" className="mt-3">
//           {errorMessage}
//         </Alert>
//       )}
//     </form>
//   );
// };

// export default SendInvite;
