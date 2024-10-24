import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Typography,
  FormControl,
  Select as MuiSelect,
  MenuItem,
  TextField,
} from "@mui/material";
import {
  PropertyWithDetailsResponse,
  UserProperty,
} from "@/store/model/user-properties";
import styles from "./propertyTab.module.css";
import { Image as ImageIcon, Trash2, Plus } from "lucide-react";
import { useAppSelector, useDispatch } from "@/store";
import {
  fetchUserPropertiesWithDetailsByUser,
  deleteUserProperty,
  createUserProperty,
} from "@/store/action/user-properties";
import { useSelector } from "react-redux";
import { RootState } from "@/store/reducers";
import { fetchProperties } from "@/store/slice/auth/propertiesSlice";
import { clearError } from "@/store/slice/user-properties";
import ConfirmationModal from "@/components/confirmation-modal";

interface EnhancedPropertyTabProps {
  userId: number;
}

interface Property {
  id: number;
  propertyName: string;
  propertyRemainingShare: number;
}

const PropertyTab: React.FC<EnhancedPropertyTabProps> = ({ userId }) => {
  const dispatch = useDispatch();
  const {
    userPropertiesWithDetails,
    loading,
    error,
    isAddingProperty,
    isDeletingProperty,
  } = useAppSelector((state) => state.userProperties || []);
  const properties = useSelector(
    (state: RootState) => state.property.properties
  );

  const [selectedYears, setSelectedYears] = useState<{ [key: number]: number }>(
    {}
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    propertyId: null as number | null,
  });
  const [newProperty, setNewProperty] = useState({
    propertyId: "",
    noOfShares: "",
    acquisitionDate: "",
  });
  const [maxShares, setMaxShares] = useState(0);

  useEffect(() => {
    dispatch(fetchProperties());
    dispatch(fetchUserPropertiesWithDetailsByUser(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, isDialogOpen]);

  useEffect(() => {
    if (Array.isArray(userPropertiesWithDetails)) {
      const initialYears: { [key: number]: number } = {};
      userPropertiesWithDetails.forEach((prop: PropertyWithDetailsResponse) => {
        initialYears[prop.propertyId] = new Date().getFullYear();
      });
      setSelectedYears(initialYears);
    }
  }, [userPropertiesWithDetails]);

  const handlePropertySelect = (value: string) => {
    const selectedProperty = properties.find(
      (p: Property) => p.id === Number(value)
    );
    if (selectedProperty) {
      setMaxShares(selectedProperty.propertyRemainingShare);
    }
    setNewProperty((prev) => ({ ...prev, propertyId: value }));
  };

  const handleShareSelect = (value: string) => {
    setNewProperty((prev) => ({ ...prev, noOfShares: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProperty((prev) => ({ ...prev, acquisitionDate: e.target.value }));
  };

  const handleAddPropertySubmit = async () => {
    try {
      const payload = {
        user: {
          id: userId,
        },
        property: {
          id: Number(newProperty.propertyId),
        },
        createdBy: {
          id: userId,
        },
        noOfShare: Number(newProperty.noOfShares),
        acquisitionDate: new Date(newProperty.acquisitionDate).toISOString(),
        isActive: true,
      };

      await dispatch(createUserProperty(payload)).unwrap();
      dispatch(fetchUserPropertiesWithDetailsByUser(userId));

      setIsDialogOpen(false);
      setNewProperty({ propertyId: "", noOfShares: "", acquisitionDate: "" });
      setMaxShares(0);
    } catch (error) {
      console.error("Failed to add property:", error);
    }
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setNewProperty({ propertyId: "", noOfShares: "", acquisitionDate: "" });
    setMaxShares(0);
  };

  const handleShowDeleteModal = (propertyId: number) => {
    setDeleteModal({
      show: true,
      propertyId,
    });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({
      show: false,
      propertyId: null,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteModal.propertyId) {
      try {
        const propertyId = deleteModal.propertyId;
        await dispatch(deleteUserProperty({ userId, propertyId })).unwrap();
        dispatch(fetchUserPropertiesWithDetailsByUser(userId));
        handleCloseDeleteModal();
      } catch (error) {
        console.error("Failed to delete property:", error);
      }
    }
  };

  const renderNightInfoBlock = (
    userProperty: UserProperty,
    season: "peak" | "off" | "lastMinute"
  ) => {
    const getNightInfo = (type: string) => {
      let value: number;
      switch (season) {
        case "peak":
          value = userProperty[
            `peak${type}Nights` as keyof UserProperty
          ] as number;
          break;
        case "off":
          value = userProperty[
            `off${type}Nights` as keyof UserProperty
          ] as number;
          break;
        case "lastMinute":
          value = userProperty[
            `lastMinute${type}Nights` as keyof UserProperty
          ] as number;
          break;
        default:
          value = 0;
      }
      return value !== null && value !== undefined ? value : 0;
    };

    const renderNightInfoRow = (
      label: string,
      usedType: string,
      totalType: string
    ) => {
      const used = getNightInfo(usedType);
      const total = getNightInfo(totalType);
      return (
        <div className={styles.nightInfoRow}>
          <span className={styles.nightInfoLabel}>{label}:</span>
          <span className={styles.nightInfoValue}>
            {used}/{total}
          </span>
        </div>
      );
    };

    return (
      <div className={`${styles.nightInfoBlock} ${styles[`${season}Block`]}`}>
        <Typography variant="subtitle2" className={styles.seasonTitle}>
          {season === "lastMinute"
            ? "Last Minute"
            : `${season.charAt(0).toUpperCase() + season.slice(1)} Season`}
        </Typography>
        <div className={styles.nightInfoContent}>
          <div className={styles.nightInfoColumn}>
            <Typography variant="caption" className={styles.nightInfoSubtitle}>
              Regular Nights
            </Typography>
            {renderNightInfoRow("Used", "Used", "Allotted")}
            {renderNightInfoRow("Booked", "Booked", "Allotted")}
            {renderNightInfoRow("Remaining", "Remaining", "Allotted")}
          </div>
          {season !== "lastMinute" && (
            <div className={styles.nightInfoColumn}>
              <Typography
                variant="caption"
                className={styles.nightInfoSubtitle}
              >
                Holiday Nights
              </Typography>
              {renderNightInfoRow("Used", "UsedHoliday", "AllottedHoliday")}
              {renderNightInfoRow("Booked", "BookedHoliday", "AllottedHoliday")}
              {renderNightInfoRow(
                "Remaining",
                "RemainingHoliday",
                "AllottedHoliday"
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return <Typography className={styles.loadingText}>Loading...</Typography>;
  }

  if (error) {
    return (
      <Typography className={styles.errorText} color="error">
        {error}
      </Typography>
    );
  }

  if (userPropertiesWithDetails || !Array.isArray(userPropertiesWithDetails) || userPropertiesWithDetails.length === 0) {
    return (
      <div className={styles.propertyTabContainer}>
        <Button
          onClick={() => setIsDialogOpen(true)}
          variant="contained"
          startIcon={<Plus />}
          className={styles.addPropertyButton}
          disabled={isAddingProperty}
        >
          {isAddingProperty ? "Adding Property..." : "Add Property"}
        </Button>
        <Typography className={styles.noPropertiesText}>
          No properties available for this user.
        </Typography>
      </div>
    );
  }

  const assignedPropertyIds = userPropertiesWithDetails.map(
    (prop: PropertyWithDetailsResponse) => prop.propertyId
  );

  const availableProperties = properties.filter(
    (property: Property) => !assignedPropertyIds.includes(property.id)
  );

  return (
    <div className={styles.propertyTabContainer}>
      <Button
        onClick={() => setIsDialogOpen(true)}
        variant="contained"
        startIcon={<Plus />}
        className={styles.addPropertyButton}
        disabled={isAddingProperty}
      >
        {isAddingProperty ? "Adding Property..." : "Add Property"}
      </Button>

      <Dialog
        open={isDialogOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        className={styles.addPropertyDialog}
      >
        <DialogTitle>Add New Property</DialogTitle>
        <DialogContent>
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <FormControl fullWidth>
              <MuiSelect
                value={newProperty.propertyId}
                onChange={(e) => handlePropertySelect(e.target.value as string)}
                displayEmpty
                placeholder="Select Property"
              >
                <MenuItem value="" disabled>
                  Select Property
                </MenuItem>
                {availableProperties.map((property: Property) => (
                  <MenuItem key={property.id} value={property.id.toString()}>
                    {property.propertyName}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth>
              <MuiSelect
                value={newProperty.noOfShares}
                onChange={(e) => handleShareSelect(e.target.value as string)}
                displayEmpty
                disabled={!newProperty.propertyId}
                placeholder="Select Number of Shares"
              >
                <MenuItem value="" disabled>
                  Select Number of Shares
                </MenuItem>
                {[...Array(maxShares)].map((_, i) => (
                  <MenuItem key={i} value={(i + 1).toString()}>
                    {i + 1}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <TextField
              type="date"
              value={newProperty.acquisitionDate}
              onChange={handleDateChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              label="Acquisition Date"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleAddPropertySubmit}
            color="primary"
            variant="contained"
            disabled={
              !newProperty.propertyId ||
              !newProperty.noOfShares ||
              !newProperty.acquisitionDate
            }
          >
            Add Property
          </Button>
        </DialogActions>
      </Dialog>

      {userPropertiesWithDetails.map(
        (prop: PropertyWithDetailsResponse, index: number) => {
          const userProperty = prop.userProperties.find(
            (up) => up.year === selectedYears[prop.propertyId]
          );
          if (!userProperty) return null;

          const shareFraction = `${userProperty.noOfShare}/${prop.propertyShare}`;

          const propertyDetails = properties.find(
            (p) => p.id === prop.propertyId
          );
          const coverImage = propertyDetails?.coverImageUrl;

          return (
            <Card key={prop.propertyId} className={styles.propertyCard}>
              <div className={styles.propertyContent}>
                <div className={styles.propertyLeftContent}>
                  <div className={styles.propertyImageWrapper}>
                    {coverImage ? (
                      <img
                        src={coverImage}
                        alt={prop.propertyName}
                        className={styles.propertyImage}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            const placeholder = document.createElement("div");
                            placeholder.className = styles.propertyNoImage;
                            placeholder.innerHTML = "<svg>...</svg>";
                            parent.appendChild(placeholder);
                          }
                        }}
                      />
                    ) : (
                      <div className={styles.propertyNoImage}>
                        <ImageIcon size={24} />
                      </div>
                    )}
                  </div>
                  <CardContent className={styles.propertyInfo}>
                    <div className={styles.propertyInfoContainer}>
                      <Typography variant="h6" className={styles.propertyName}>
                        {prop.propertyName}
                      </Typography>
                      <Typography
                        variant="body2"
                        className={styles.propertyAddress}
                      >
                        {prop.address}, {prop.city}, {prop.state},{" "}
                        {prop.zipcode}
                      </Typography>
                      <div className={styles.propertyDetails}>
                        <div className={styles.propertyDetailItem}>
                          <span className={styles.propertyDetailLabel}>
                            Shares:
                          </span>
                          <span className={styles.propertyDetailValue}>
                            {shareFraction}
                          </span>
                        </div>
                        <div className={styles.propertyDetailItem}>
                          <span className={styles.propertyDetailLabel}>
                            Acquired:
                          </span>
                          <span className={styles.propertyDetailValue}>
                            {new Date(
                              userProperty.acquisitionDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
                <div className={styles.propertyRightContent}>
                  <div className={styles.propertyYearSelector}>
                    {prop.userProperties.map((up) => (
                      <Button
                        key={up.year}
                        variant={
                          selectedYears[prop.propertyId] === up.year
                            ? "contained"
                            : "outlined"
                        }
                        size="small"
                        onClick={() =>
                          setSelectedYears((prev) => ({
                            ...prev,
                            [prop.propertyId]: up.year,
                          }))
                        }
                        className={`${styles.propertyYearButton} ${
                          selectedYears[prop.propertyId] === up.year
                            ? styles.propertyYearButtonSelected
                            : ""
                        }`}
                      >
                        {up.year}
                      </Button>
                    ))}
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleShowDeleteModal(prop.propertyId)}
                      className={styles.removePropertyButton}
                      disabled={isDeletingProperty}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                  <div className={styles.propertyAvailabilityContainer}>
                    <div className={styles.propertyAvailabilityInfo}>
                      {renderNightInfoBlock(userProperty, "peak")}
                      {renderNightInfoBlock(userProperty, "off")}
                      {renderNightInfoBlock(userProperty, "lastMinute")}
                    </div>
                  </div>
                </div>
              </div>
              {error && (
                <Typography color="error" className={styles.errorMessage}>
                  {error}
                </Typography>
              )}
            </Card>
          );
        }
      )}
      <ConfirmationModal
        show={deleteModal.show}
        onHide={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirm Remove"
        message={`Are you sure you want to remove property for this user?`}
        confirmLabel="Remove"
        cancelLabel="Cancel"
      />
    </div>
  );
};

export default PropertyTab;
