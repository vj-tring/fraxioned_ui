import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { IconButton, Typography, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { userdetails, propertydetailsapi } from "@/api/api-endpoints";
import Search from "@/pages-admin/search-user";
import styles from "./User.module.css";
import { useNavigate } from "react-router-dom";

interface ContactDetails {
  id: number;
  primaryEmail: string;
  secondaryEmail: string | null;
  optionalEmailOne: string | null;
  optionalEmailTwo: string | null;
  primaryPhone: string;
  secondaryPhone: string | null;
  optionalPhoneOne: string | null;
  optionalPhoneTwo: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UserData {
  id: number;
  role: { id: number; roleName: string };
  firstName: string;
  lastName: string;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipcode: string | null;
  isActive: boolean;
  contactDetails: ContactDetails;
  createdBy: number;
  lastLoginTime: string;
  imageURL: string | null;
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
  const navigate = useNavigate();

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
      }));
      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users. Please try again.");
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
      console.error("Error fetching properties:", err);
      setError("Failed to fetch properties. Please try again.");
    }
  };

  const getUserProperties = (userId: number) => {
    return properties
      .filter((property) =>
        property.owners.some((owner) => owner.userId === userId)
      )
      .map((property) => property.propertyName);
  };

  const handleSearch = (query: string) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = users.filter((user) => {
      const userProperties = getUserProperties(user.id);
      return (
        user.firstName.toLowerCase().includes(lowercasedQuery) ||
        user.lastName.toLowerCase().includes(lowercasedQuery) ||
        user.role.roleName.toLowerCase().includes(lowercasedQuery) ||
        userProperties.some((property) =>
          property.toLowerCase().includes(lowercasedQuery)
        )
      );
    });
    setFilteredUsers(filtered);
  };

  const handleEditClick = (id: number) => {
    navigate(`/admin/user/${id}/edit`);
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
    {
      field: "id",
      headerName: "Id",
      minWidth: 110,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "firstName",
      headerName: "First Name",
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "lastName",
      headerName: "Last Name",
      minWidth: 130,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "roleName",
      headerName: "Role",
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "lastLoginTime",
      headerName: "Last Login",
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "contactDetails",
      headerName: "Contact Details",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const { primaryPhone, primaryEmail } = params.row.contactDetails;

        return (
          <div className={styles.contactDetails}>
            {primaryPhone && (
              <div className={styles.contactRow}>{primaryPhone}</div>
            )}
            {primaryEmail && (
              <div className={styles.contactRow}>{primaryEmail}</div>
            )}
          </div>
        );
      },
    },

    {
      field: "properties",
      headerName: "Properties",
      width: 250,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const userProperties = getUserProperties(params.row.id);
        return (
          <div className={styles.propertyCell}>
            {userProperties.length === 0 ? (
              <Typography variant="body2" className={styles.noProperties}>
                No properties
              </Typography>
            ) : (
              <Tooltip title={userProperties.join(", ")} arrow>
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
      field: "actions",
      headerName: "Actions",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <IconButton
            aria-label="edit"
            sx={{ color: "#00636d" }}
            onClick={() => handleEditClick(params.row.id)}
          >
            <EditIcon
              sx={{
                color: "#709C7E",
              }}
            />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <div
      className={`${styles.usersContainer} ${
        isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
      }`}
    >
      <div className={styles.headerContainer}>
        <h1 className={styles.title}>Users Details</h1>
        <div className={styles.searchWrapper}>
          <Search onSearch={handleSearch} placeholder="Search" />
        </div>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.dataGridWrapper}>
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          rowHeight={40}
          sx={{
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "grey",
              color: "white",
              fontSize: "small",
              textTransform: "uppercase",

              fontFamily: " 'Roboto', sans-serif !important",
            },
            "& .MuiDataGrid-cell": {
              fontSize: "small",
              fontFamily: " 'Roboto', sans-serif !important ",
            },
            // "&  .MuiDataGrid-cell--textLeft ": {
            //   position: "sticky",
            //   right: 0,
            //   paddingLeft: "60px",
            //   backgroundColor: "#ebecec",
            // },
            // "& .MuiDataGrid-columnHeader--last": {
            //   // backgroundColor: "lightgrey",
            //   position: "sticky",
            //   paddingLeft: "40px",

            //   right: 0,
            // },
          }}
          getRowClassName={(params) => {
            if (params.indexRelativeToCurrentPage % 2 === 0) {
              return styles.evenRow;
            } else {
              return styles.oddRow;
            }
          }}
          columnHeaderHeight={40}
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
    </div>
  );
};

export default User;
