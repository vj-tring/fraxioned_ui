import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getUsers, deleteUserApi, getUserById } from '@/api';
import styles from './User.module.css';
import ConfirmationModal from '@/components/confirmation-modal';

interface ContactDetail {
    id: number;
    contactType: string;
    contactValue: string;
    createdAt: string;
    updatedAt: string;
}

interface UserData {
    id: number;
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    contactDetails: ContactDetail[];
    createdBy: string;
}

interface EditUserData {
    id: number;
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    zipcode: number;
    contactDetails: ContactDetail[];
    createdBy: string;
}

const User: React.FC<{ isSidebarOpen: boolean }> = ({ isSidebarOpen }) => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [editUserData, setEditUserData] = useState<EditUserData | null>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await getUsers();
            const fetchedUsers = response.data.users.map((user: any) => ({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                addressLine1: user.addressLine1,
                addressLine2: user.addressLine2,
                city: user.city,
                state: user.state,
                country: user.country,
                contactDetails: user.contactDetails,
                createdBy: user.createdBy,
            }));
            setUsers(fetchedUsers);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to fetch users. Please try again.');
        }
    };

    const handleEditClick = async (id: number) => {
        try {
            const response = await getUserById(id);
            const userData = response.data;
            setEditUserData(userData);
            setIsEditFormOpen(true);
        } catch (err) {
            console.error('Error fetching user details:', err);
            setError('Failed to fetch user details. Please try again.');
        }
    };

    const handleDeleteClick = (user: UserData) => {
        setUserToDelete(user);
        setShowDeleteConfirmation(true);
    };

    const handleConfirmDelete = async () => {
        if (userToDelete === null) return;

        try {
            await deleteUserApi(userToDelete.id);
            await fetchUsers();
            setShowDeleteConfirmation(false);
            setUserToDelete(null);
        } catch (err) {
            console.error('Failed to delete user. Please try again.', err);
            setError('Failed to delete user. Please try again.');
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirmation(false);
        setUserToDelete(null);
    };

    const columns: GridColDef[] = [
        { field: 'firstName', headerName: 'First Name', minWidth: 120, align: 'center', headerAlign: 'center' },
        { field: 'lastName', headerName: 'Last Name', minWidth: 120, align: 'center', headerAlign: 'center' },
        { field: 'addressLine1', headerName: 'Address Line 1', minWidth: 180, align: 'center', headerAlign: 'center' },
        { field: 'addressLine2', headerName: 'Address Line 2', minWidth: 180, align: 'center', headerAlign: 'center' },
        { field: 'city', headerName: 'City', width: 120, align: 'center', headerAlign: 'center' },
        { field: 'state', headerName: 'State', width: 120, align: 'center', headerAlign: 'center' },
        { field: 'country', headerName: 'Country', width: 140, align: 'center', headerAlign: 'center' },
        {
            field: 'contactDetails',
            headerName: 'Contact Details',
            width: 200,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => {
                const phoneContact = params.row.contactDetails.find(
                    (contact: ContactDetail) => contact.contactType.toLowerCase() === 'phone'
                );
        
                const emailContact = params.row.contactDetails.find(
                    (contact: ContactDetail) => contact.contactType.toLowerCase() === 'email'
                );
        
                const phone = phoneContact ? phoneContact.contactValue : '';
                const email = emailContact ? emailContact.contactValue : '';
        
                return (
                    <div className={styles.contactDetails}>
                        {phone && <div className={styles.contactRow}>{phone}</div>}
                        {email && <div className={styles.contactRow}>{email}</div>}
                    </div>
                );
            },
        },
        { field: 'createdBy', headerName: 'Created By', width: 140, align: 'center', headerAlign: 'center' },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <>
                    <IconButton
                        aria-label="edit"
                        color="primary"
                        onClick={() => handleEditClick(params.row.id)}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        aria-label="delete"
                        color="secondary"
                        onClick={() => handleDeleteClick(params.row)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <div className={`${styles.usersContainer} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
            <div className={styles.titleContainer}>
                <h1 className={styles.title}>Users</h1>
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.dataGridWrapper}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    disableRowSelectionOnClick
                    className={`${styles.dataGrid} ${styles.dataGridPadding}`}
                />
            </div>
            <ConfirmationModal
                show={showDeleteConfirmation}
                onHide={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this user?"
                confirmLabel="Delete"
                cancelLabel="Cancel"
            />
        </div>
    );
};

export default User;
