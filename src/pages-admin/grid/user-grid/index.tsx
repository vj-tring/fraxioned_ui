import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton, Modal } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { userdetails, getUserById } from '@/api';
import styles from './User.module.css';
import EditForm from './edit-form';

interface ContactDetail {
    id: number;
    contactType: string;
    contactValue: string;
    createdAt: string;
    updatedAt: string;
}

interface UserData {
    id: number;
    role: { id: number; roleName: string };
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

const User: React.FC<{ isSidebarOpen: boolean }> = ({ isSidebarOpen }) => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [editUserData, setEditUserData] = useState<UserData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await userdetails();
            const fetchedUsers = response.data.users.map((user: UserData) => ({
                ...user,
                id: user.id,
                roleName: user.role.roleName,
                createdBy: user.createdBy === '1' ? 'owner' : 'Admin',

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
            setEditUserData(userData.user);
            setIsEditFormOpen(true);
        } catch (err) {
            console.error('Error fetching user details:', err);
            setError('Failed to fetch user details. Please try again.');
        }
    };

    const handleCloseEditForm = () => {
        setIsEditFormOpen(false);
        setEditUserData(null);
    };

    const handleUserUpdated = () => {
        fetchUsers();
        handleCloseEditForm();
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'Id', minWidth: 120, align: 'center', headerAlign: 'center' },
        { field: 'firstName', headerName: 'First Name', minWidth: 100, align: 'center', headerAlign: 'center' },
        { field: 'lastName', headerName: 'Last Name', minWidth: 110, align: 'center', headerAlign: 'center' },
        { field: 'addressLine1', headerName: 'Address', minWidth: 120, align: 'center', headerAlign: 'center' },
        { field: 'state', headerName: 'State', minWidth: 100, align: 'center', headerAlign: 'center' },
        { field: 'roleName', headerName: 'Role', minWidth: 130, align: 'center', headerAlign: 'center' },
        { field: 'lastLoginTime', headerName: 'Last Login', minWidth: 110, align: 'center', headerAlign: 'center' },
        {
            field: 'contactDetails',
            headerName: 'Contact Details',
            width: 170,
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
        { field: 'createdBy', headerName: 'Created By', width: 120, align: 'center', headerAlign: 'center' },
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
            <Modal
                open={isEditFormOpen}
                onClose={handleCloseEditForm}
                aria-labelledby="edit-user-modal"
                aria-describedby="modal-to-edit-user-details"
            >
                <div>
                    {editUserData && (
                        <EditForm
                            user={editUserData}
                            onClose={handleCloseEditForm}
                            onUserUpdated={handleUserUpdated}
                        />
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default User;