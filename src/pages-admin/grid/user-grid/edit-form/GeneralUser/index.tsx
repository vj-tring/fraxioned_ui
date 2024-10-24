// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//     TextField,
//     Button,
//     FormControlLabel,
//     Checkbox,
//     Box,
//     Typography,
//     Paper,
//     Grid,
//     Select,
//     FormControl,
//     InputLabel,
//     MenuItem,
//     IconButton,
//     Tabs,
//     Tab
// } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import Loader from '@/components/loader';
// import UserBookings from '../user-bookings';
// import UserForm from '../userform';
// import styles from './GeneralUser.module.css';
// import PropertyTab from '../propertyUser';
// import Availability from '../availablity';

// interface ContactDetails {
//     id: number;
//     primaryEmail: string;
//     secondaryEmail: string | null;
//     optionalEmailOne: string | null;
//     optionalEmailTwo: string | null;
//     primaryPhone: string;
//     secondaryPhone: string | null;
//     optionalPhoneOne: string | null;
//     optionalPhoneTwo: string | null;
// }

// interface UserData {
//     id: number;
//     role: { id: number };
//     firstName: string;
//     lastName: string;
//     password?: string;
//     imageURL: string | null;
//     isActive: boolean;
//     addressLine1: string | null;
//     addressLine2: string | null;
//     state: string | null;
//     country: string | null;
//     city: string | null;
//     zipcode: string | null;
//     resetToken?: string;
//     resetTokenExpires?: string;
//     lastLoginTime: string;
//     updatedBy?: number;
//     contactDetails: ContactDetails;
// }

// interface Role {
//     id: number;
//     roleName: string;
//     roleDescription: string;
// }

// interface EditFormProps {
//     user: UserData;
//     onClose: () => void;
//     onUserUpdated: () => void;
// }

// const EditForm: React.FC<EditFormProps> = ({ user, onClose, onUserUpdated }) => {
//     const [formData, setFormData] = useState<UserData>(user);
//     const [error, setError] = useState<string | null>(null);
//     const [loading, setLoading] = useState(false);
//     const [roles, setRoles] = useState<Role[]>([]);
//     const [selectedTab, setSelectedTab] = useState(0);
//     const [showUserForm, setShowUserForm] = useState(true);

//     useEffect(() => {
//         const fetchRoles = async () => {
//             try {
//                 const response = await getRoles();
//                 setRoles(response.data.roles);
//             } catch (err) {
//                 console.error('Error fetching roles:', err);
//                 setError('Failed to fetch roles. Please try again.');
//             }
//         };

//         fetchRoles();
//     }, []);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value, type, checked } = e.target;
//         setFormData((prevData) => ({
//             ...prevData,
//             [name]: type === 'checkbox' ? checked : value
//         }));
//     };

//     const handleContactChange = (field: keyof ContactDetails, value: string) => {
//         setFormData((prevData) => ({
//             ...prevData,
//             contactDetails: {
//                 ...prevData.contactDetails,
//                 [field]: value
//             }
//         }));
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             const dataToSend = {
//                 role: { id: formData.role.id },
//                 firstName: formData.firstName,
//                 lastName: formData.lastName,
//                 password: formData.password,
//                 imageURL: formData.imageURL,
//                 isActive: Boolean(formData.isActive),
//                 addressLine1: formData.addressLine1,
//                 addressLine2: formData.addressLine2,
//                 state: formData.state,
//                 country: formData.country,
//                 city: formData.city,
//                 zipcode: formData.zipcode,
//                 resetToken: formData.resetToken,
//                 resetTokenExpires: formData.resetTokenExpires,
//                 lastLoginTime: formData.lastLoginTime,
//                 updatedBy: formData.id,
//                 contactDetails: {
//                     primaryEmail: formData.contactDetails.primaryEmail,
//                     primaryPhone: formData.contactDetails.primaryPhone,
//                     secondaryEmail: formData.contactDetails.secondaryEmail,
//                     secondaryPhone: formData.contactDetails.secondaryPhone,
//                     optionalEmailOne: formData.contactDetails.optionalEmailOne,
//                     optionalPhoneOne: formData.contactDetails.optionalPhoneOne,
//                     optionalEmailTwo: formData.contactDetails.optionalEmailTwo,
//                     optionalPhoneTwo: formData.contactDetails.optionalPhoneTwo
//                 }
//             };

//             await updateuserapi(formData.id, dataToSend);
//             onUserUpdated();
//             onClose();
//         } catch (err) {
//             console.error('Error updating user:', err);
//             setError('Failed to update user. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
//         setSelectedTab(newValue);
//         setShowUserForm(newValue === 0);
//     };

//     const handleEditClick = () => {
//         setShowUserForm(false);
//     };

//     if (loading) return <Loader />;

//     return (
//         <div className={styles.modalOverlay}>
//             <div className={styles.formContainer}>
//                 <div className={styles.staticHeader}>
//                     <Box className={styles.formHeader}>
//                         <IconButton
//                             onClick={onClose}
//                             className={styles.closeButton}
//                             aria-label="close"
//                         >
//                             <CloseIcon />
//                         </IconButton>
//                     </Box>

//                     <Tabs
//                         value={selectedTab}
//                         onChange={handleTabChange}
//                         aria-label="user edit tabs"
//                         className={styles.tabs}
//                     >
//                         <Tab label="General Details" />
//                         <Tab label="Property" />
//                         <Tab label="Booking" />
//                         <Tab label="Availability" />
//                     </Tabs>
//                 </div>

//                 <div className={styles.scrollableContent}>
//                     <Paper elevation={9} className={styles.formPaper}>
//                         {selectedTab === 0 && showUserForm ? (
//                             <UserForm
//                                 userId={user.id}
//                                 onClose={() => setShowUserForm(false)}
//                                 onEditClick={handleEditClick}
//                             />
//                         ) : selectedTab === 0 && (
//                             <form onSubmit={handleSubmit} className={styles.form}>
//                                 <Grid container spacing={3}>
//                                     {/* Basic Information */}
//                                     <Grid item xs={12} sm={6}>
//                                         <TextField
//                                             label="First Name"
//                                             name="firstName"
//                                             value={formData.firstName}
//                                             onChange={handleInputChange}
//                                             fullWidth
//                                             required
//                                             variant="outlined"
//                                             className={styles.inputField}
//                                         />
//                                     </Grid>
//                                     <Grid item xs={12} sm={6}>
//                                         <TextField
//                                             label="Last Name"
//                                             name="lastName"
//                                             value={formData.lastName}
//                                             onChange={handleInputChange}
//                                             fullWidth
//                                             required
//                                             variant="outlined"
//                                             className={styles.inputField}
//                                         />
//                                     </Grid>

//                                     {/* Address Fields */}
//                                     <Grid item xs={12} sm={6}>
//                                         <TextField
//                                             label="Address Line 1"
//                                             name="addressLine1"
//                                             value={formData.addressLine1 || ''}
//                                             onChange={handleInputChange}
//                                             fullWidth
//                                             variant="outlined"
//                                             className={styles.inputField}
//                                         />
//                                     </Grid>
//                                     <Grid item xs={12} sm={6}>
//                                         <TextField
//                                             label="Address Line 2"
//                                             name="addressLine2"
//                                             value={formData.addressLine2 || ''}
//                                             onChange={handleInputChange}
//                                             fullWidth
//                                             variant="outlined"
//                                             className={styles.inputField}
//                                         />
//                                     </Grid>
//                                     <Grid item xs={12} sm={6}>
//                                         <TextField
//                                             label="City"
//                                             name="city"
//                                             value={formData.city || ''}
//                                             onChange={handleInputChange}
//                                             fullWidth
//                                             variant="outlined"
//                                             className={styles.inputField}
//                                         />
//                                     </Grid>
//                                     <Grid item xs={12} sm={6}>
//                                         <TextField
//                                             label="State"
//                                             name="state"
//                                             value={formData.state || ''}
//                                             onChange={handleInputChange}
//                                             fullWidth
//                                             variant="outlined"
//                                             className={styles.inputField}
//                                         />
//                                     </Grid>
//                                     <Grid item xs={12} sm={6}>
//                                         <TextField
//                                             label="Country"
//                                             name="country"
//                                             value={formData.country || ''}
//                                             onChange={handleInputChange}
//                                             fullWidth
//                                             variant="outlined"
//                                             className={styles.inputField}
//                                         />
//                                     </Grid>
//                                     <Grid item xs={12} sm={6}>
//                                         <TextField
//                                             label="Zipcode"
//                                             name="zipcode"
//                                             value={formData.zipcode || ''}
//                                             onChange={handleInputChange}
//                                             fullWidth
//                                             variant="outlined"
//                                             className={styles.inputField}
//                                         />
//                                     </Grid>

//                                     {/* Role Selection */}
//                                     <Grid item xs={12} sm={6}>
//                                         <FormControl fullWidth variant="outlined" className={styles.inputField}>
//                                             <InputLabel>Role</InputLabel>
//                                             <Select
//                                                 value={formData.role.id}
//                                                 onChange={(e) => setFormData(prev => ({ ...prev, role: { id: Number(e.target.value) } }))}
//                                                 label="Role"
//                                                 name="role.id"
//                                             >
//                                                 {roles.map((role) => (
//                                                     <MenuItem key={role.id} value={role.id}>
//                                                         {role.roleName}
//                                                     </MenuItem>
//                                                 ))}
//                                             </Select>
//                                         </FormControl>
//                                     </Grid>

//                                     {/* Is Active Checkbox */}
//                                     <Grid item xs={12}>
//                                         <FormControlLabel
//                                             control={
//                                                 <Checkbox
//                                                     checked={formData.isActive}
//                                                     onChange={handleInputChange}
//                                                     name="isActive"
//                                                     color="primary"
//                                                 />
//                                             }
//                                             label="Is Active"
//                                             className={styles.checkbox}
//                                         />
//                                     </Grid>

//                                     {/* Contact Details */}
//                                     <Grid item xs={12}>
//                                         <Typography variant="h6" className={styles.sectionTitle}>Contact Details</Typography>
//                                     </Grid>
//                                     <Grid item xs={12} sm={6}>
//                                         <TextField
//                                             label="Primary Phone"
//                                             name="primaryPhone"
//                                             value={formData.contactDetails.primaryPhone}
//                                             onChange={(e) => handleContactChange('primaryPhone', e.target.value)}
//                                             fullWidth
//                                             variant="outlined"
//                                             className={styles.inputField}
//                                         />
//                                     </Grid>
//                                     <Grid item xs={12} sm={6}>
//                                         <TextField
//                                             label="Primary Email"
//                                             name="primaryEmail"
//                                             value={formData.contactDetails.primaryEmail}
//                                             onChange={(e) => handleContactChange('primaryEmail', e.target.value)}
//                                             fullWidth
//                                             variant="outlined"
//                                             className={styles.inputField}
//                                         />
//                                     </Grid>
//                                 </Grid>
//                             </form>
//                         )}

//                         {selectedTab === 1 && (
//                             <PropertyTab Id={user.id} />
//                         )}

//                         {selectedTab === 2 && (
//                             <UserBookings userId={user.id} />
//                         )}
//                         {selectedTab === 3 && (
//                             <Availability userId={user.id} />
//                         )}

//                         {selectedTab === 0 && !showUserForm && (
//                             <Box className={styles.buttonContainer}>
//                                 <Button
//                                     variant="outlined"
//                                     onClick={onClose}
//                                     className={styles.cancelButton}
//                                 >
//                                     Cancel
//                                 </Button>
//                                 <Button
//                                     type="submit"
//                                     variant="contained"
//                                     className={styles.updateButton}
//                                     onClick={handleSubmit}
//                                 >
//                                     Update User
//                                 </Button>
//                             </Box>
//                         )}
//                     </Paper>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditForm;