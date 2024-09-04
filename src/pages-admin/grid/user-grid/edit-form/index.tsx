import React, { useEffect, useState } from 'react';
import {
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
    Box,
    Typography,
    Paper,
    Grid,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { updateuserapi, getRoles } from '@/api';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import Loader from '@/components/loader';
import styles from './EditUser.module.css';
import { DeleteIcon } from 'lucide-react';

interface ContactDetail {
    id?: number;
    contactType: string;
    contactValue: string;
}
interface UserData {
    id: number;
    role: { id: number };
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
    isActive: boolean;
    contactDetails: ContactDetail[];
    createdBy: string;
    lastLoginTime: string;
    imageURL: string;
    password?: string;
    resetToken?: string;
    resetTokenExpires?: string;
    updatedBy?: number;
}

interface Role {
    id: number;
    roleName: string;
    roleDescription: string;
}

interface EditFormProps {
    user: UserData;
    onClose: () => void;
    onUserUpdated: () => void;
}

const EditForm: React.FC<EditFormProps> = ({ user, onClose, onUserUpdated }) => {
    const [formData, setFormData] = useState<UserData>({
        ...user,
        isActive: Boolean(user.isActive),
        contactDetails: user.contactDetails || []
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await getRoles();
                setRoles(response.data.roles);
            } catch (err) {
                console.error('Error fetching roles:', err);
                setError('Failed to fetch roles. Please try again.');
            }
        };

        fetchRoles();
    }, []);

    useEffect(() => {
        console.log("data", formData);
    }, [formData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleContactChange = (index: number, field: string, value: string) => {
        setFormData((prevData) => {
            const newContactDetails = [...(prevData.contactDetails || [])];
            if (newContactDetails[index]) {
                newContactDetails[index] = { ...newContactDetails[index], [field]: value };
            }
            return { ...prevData, contactDetails: newContactDetails };
        });
    };



    const addContact = () => {
        setFormData((prevData) => ({
            ...prevData,
            contactDetails: [
                ...prevData.contactDetails,
                { contactType: 'email', contactValue: '' },
                { contactType: 'phone', contactValue: '' }
            ]
        }));
    };

    const removeContact = (index: number) => {
        setFormData((prevData) => ({
            ...prevData,
            contactDetails: prevData.contactDetails.filter((_, i) => i !== index && i !== index + 1)
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.id) {
            setError('User ID not found. Please try again.');
            return;
        }
        setLoading(true);
        try {
            const dataToSend = {
                role: { id: formData.role.id },
                firstName: formData.firstName,
                lastName: formData.lastName,
                password: formData.password,
                imageURL: formData.imageURL,
                isActive: Boolean(formData.isActive),
                addressLine1: formData.addressLine1 || null,
                addressLine2: formData.addressLine2 || null,
                state: formData.state,
                country: formData.country,
                city: formData.city,
                zipcode: formData.zipcode,
                resetToken: formData.resetToken,
                resetTokenExpires: formData.resetTokenExpires,
                lastLoginTime: formData.lastLoginTime,
                updatedBy: formData.id,
                contactDetails: formData.contactDetails
                    .filter(contact => contact.contactValue.trim() !== '')
                    .map(contact => ({
                        ...(contact.id ? { id: contact.id } : {}),
                        contactType: contact.contactType,
                        contactValue: contact.contactValue
                    }))
            };
            await updateuserapi(formData.id, dataToSend);
            onUserUpdated();
            onClose();
        } catch (err) {
            console.error('Error updating user:', err);
            setError('Failed to update user. Please try again.');
        } finally {
            setLoading(false);
        }
    };




    if (loading) return <Loader />;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.formContainer}>
                <div className={styles.staticHeader}>
                    <Box className={styles.formHeader}>
                        <EditIcon className={styles.headerIcon} />
                        <Typography variant="h4" className={styles.formTitle}>
                            Edit User
                        </Typography>
                        <IconButton
                            onClick={onClose}
                            className={styles.closeButton}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>

                    </Box>
                </div>
                <div className={styles.scrollableContent}>
                    <Paper elevation={9} className={styles.formPaper}>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="First Name"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                        variant="outlined"
                                        className={styles.inputField}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Last Name"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                        variant="outlined"
                                        className={styles.inputField}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Address Line 1"
                                        name="addressLine1"
                                        value={formData.addressLine1}
                                        onChange={handleInputChange}
                                        fullWidth
                                        variant="outlined"
                                        className={styles.inputField}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Address Line 2"
                                        name="addressLine2"
                                        value={formData.addressLine2}
                                        onChange={handleInputChange}
                                        fullWidth
                                        variant="outlined"
                                        className={styles.inputField}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="City"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        fullWidth
                                        variant="outlined"
                                        className={styles.inputField}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="State"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        fullWidth
                                        variant="outlined"
                                        className={styles.inputField}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        fullWidth
                                        variant="outlined"
                                        className={styles.inputField}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Zipcode"
                                        name="zipcode"
                                        value={formData.zipcode}
                                        onChange={handleInputChange}
                                        fullWidth
                                        variant="outlined"
                                        className={styles.inputField}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined" className={styles.inputField}>
                                        <InputLabel>Role</InputLabel>
                                        <Select
                                            value={formData.role?.id || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, role: { id: Number(e.target.value) } }))}
                                            label="Role"
                                            name="role.id"
                                        >
                                            {roles.map((role) => (
                                                <MenuItem key={role.id} value={role.id}>
                                                    {role.roleName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={formData.isActive}
                                                onChange={handleInputChange}
                                                name="isActive"
                                                color="primary"
                                            />
                                        }
                                        label="Is Active"
                                        className={styles.checkbox}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6" className={styles.sectionTitle}>Contact Details</Typography>
                                </Grid>
                                {formData.contactDetails && formData.contactDetails.map((contact, index) => (
                                    <React.Fragment key={index}>
                                        <Grid item xs={12} sm={5}>
                                            <TextField
                                                label={contact.contactType}
                                                value={contact.contactValue}
                                                onChange={(e) => handleContactChange(index, 'contactValue', e.target.value)}
                                                fullWidth
                                                variant="outlined"
                                                className={styles.inputField}
                                            />
                                        </Grid>
                                        {index % 2 === 1 && (
                                            <Grid item xs={12} sm={2}>
                                                <IconButton onClick={() => removeContact(index - 1)} color="secondary">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Grid>
                                        )}
                                    </React.Fragment>
                                ))}
                                <Grid item xs={12}>
                                    <Button
                                        startIcon={<AddIcon />}
                                        onClick={addContact}
                                        variant="outlined"
                                        color="primary"
                                        className={styles.addButton}
                                    >
                                        Add Contact
                                    </Button>
                                </Grid>
                            </Grid>
                            {error && <Typography color="error" className={styles.error}>{error}</Typography>}
                            <Box className={styles.buttonContainer}>
                                <Button
                                    variant="outlined"
                                    onClick={onClose}
                                    className={styles.cancelButton}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    className={styles.updateButton}
                                >
                                    Update User
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                </div>
            </div>
        </div>
    );
};

export default EditForm;