import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { IconButton, Modal, Typography, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { userdetails, getUserById, propertydetailsapi } from '@/api';
import Search from '@/pages-admin/search-user';
import styles from './User.module.css';
import EditForm from './edit-form';
import UserForm from './user-form';

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
    properties?: string[];
}

interface PropertyData {
    propertyId: number;
    propertyName: string;
    owners: { userId: number }[];
}

const User: React.FC<{ isSidebarOpen: boolean }> = ({ isSidebarOpen }) => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [editUserData, setEditUserData] = useState<UserData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [properties, setProperties] = useState<PropertyData[]>([]);
    const [isUserFormOpen, setIsUserFormOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);


    useEffect(() => {
        fetchUsers();
        fetchProperties();
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
            setFilteredUsers(fetchedUsers);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to fetch users. Please try again.');
        }
    };

    const handleViewClick = (id: number) => {
        setSelectedUserId(id);
        setIsUserFormOpen(true);
    };

    const handleCloseUserForm = () => {
        setIsUserFormOpen(false);
        setSelectedUserId(null);
    };

    const fetchProperties = async () => {
        try {
            const response = await propertydetailsapi();
            setProperties(response.data);
        } catch (err) {
            console.error('Error fetching properties:', err);
            setError('Failed to fetch properties. Please try again.');
        }
    };

    const getUserProperties = (userId: number) => {
        return properties
            .filter(property => property.owners.some(owner => owner.userId === userId))
            .map(property => property.propertyName);
    };

    const handleSearch = (query: string) => {
        const lowercasedQuery = query.toLowerCase();
        const filtered = users.filter((user) => {
            const userProperties = getUserProperties(user.id);
            return user.firstName.toLowerCase().includes(lowercasedQuery) ||
                user.lastName.toLowerCase().includes(lowercasedQuery) ||
                user.role.roleName.toLowerCase().includes(lowercasedQuery) ||
                userProperties.some(property => property.toLowerCase().includes(lowercasedQuery));
        });
        setFilteredUsers(filtered);
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
        { field: 'id', headerName: 'Id', minWidth: 100, align: 'center', headerAlign: 'center' },
        { field: 'firstName', headerName: 'First Name', minWidth: 100, align: 'center', headerAlign: 'center' },
        { field: 'lastName', headerName: 'Last Name', minWidth: 130, align: 'center', headerAlign: 'center' },
        { field: 'state', headerName: 'State', minWidth: 120, align: 'center', headerAlign: 'center' },
        { field: 'roleName', headerName: 'Role', minWidth: 140, align: 'center', headerAlign: 'center' },
        { field: 'lastLoginTime', headerName: 'Last Login', minWidth: 110, align: 'center', headerAlign: 'center' },
        {
            field: 'contactDetails',
            headerName: 'Contact Details',
            width: 180,
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
        {
            field: 'properties',
            headerName: 'Properties',
            width: 200,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => {
                const userProperties = getUserProperties(params.row.id);
                return (
                    <div className={styles.propertyCell}>
                        {userProperties.length === 0 ? (
                            <Typography variant="body2" className={styles.noProperties}>
                                No properties
                            </Typography>
                        ) : (
                            <Tooltip title={userProperties.join(', ')} arrow>
                                <div className={styles.propertyWrapper}>
                                    <Typography variant="body2" className={styles.propertyName}>
                                        {userProperties[0]}
                                    </Typography>
                                    {userProperties.length > 1 && (
                                        <KeyboardArrowDownIcon className={styles.dropdownArrow} />
                                    )}
                                </div>
                            </Tooltip>
                        )}
                    </div>
                );
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <>
                    <IconButton
                        aria-label="view"
                        color="primary"
                        onClick={() => handleViewClick(params.row.id)}
                    >
                        <VisibilityIcon />
                    </IconButton>
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
            <div className={styles.headerContainer}>
                <h1 className={styles.title}>Users</h1>
                <div className={styles.searchWrapper}>
                    <Search onSearch={handleSearch} placeholder="Search" />
                </div>
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.dataGridWrapper}>
                <DataGrid
                    rows={filteredUsers}
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
            <Modal
                open={isUserFormOpen}
                onClose={handleCloseUserForm}
                aria-labelledby="view-user-modal"
                aria-describedby="modal-to-view-user-details"
            >
                <div>
                    {selectedUserId && (
                        <UserForm
                            userId={selectedUserId}
                            onClose={handleCloseUserForm}
                        />
                    )}
                </div>
            </Modal>

        </div>
    );
};

export default User;