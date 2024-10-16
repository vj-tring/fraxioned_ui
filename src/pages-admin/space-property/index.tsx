import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import styles from "./spaceproperty.module.css";
import { RootState } from "@/store/reducers";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { fetchAllSpaces } from "@/store/slice/space";
import { Space } from "@/store/model";
import {
  createNewSpaceProperty,
  fetchSpacePropertiesById,
} from "@/store/slice/space/property";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate

const SpaceProperty: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate(); // Initialize useNavigate hook
  const { id } = useParams<{ id: string }>();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const spaces = useSelector((state: RootState) => state.spaces.spaces || []);
  const propertySpace = useSelector(
    (state: RootState) => state.spaceProperties.spaceProperties || []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await dispatch(fetchAllSpaces()).unwrap();
        await dispatch(fetchSpacePropertiesById(Number(id))).unwrap();
      } catch (error) {
        setError("Failed to load spaces or properties");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, id]);

  const handleAddSpace = async () => {
    if (selectedSpace) {
      const spacePropertyData: any = {
        property: { id: Number(id) },
        space: { id: selectedSpace.id },
        createdBy: { id: userId },
      };
      try {
        setLoading(true);
        await dispatch(createNewSpaceProperty(spacePropertyData)).unwrap();
        await dispatch(fetchSpacePropertiesById(Number(id))).unwrap();
        setIsDialogOpen(false);
        setSelectedSpace(null);
      } catch (error) {
        setError("Error creating space property");
      } finally {
        setLoading(false);
      }
    }
  };

  // Navigate to space details page when a space is clicked
  const handleSpaceClick = (space: any) => {
    navigate(`/admin/property/${id}/rooms/${space.space.id}`, {
      state: { space },
    }); // Pass space details in state
  };

  return (
    <div className={styles.fullContainer}>
      {loading && <div>Loading...</div>}
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.headersection}>
        <h2>Add Space Property</h2>
        <div className={styles.addspace} onClick={() => setIsDialogOpen(true)}>
          <FaPlus style={{ fontSize: ".8rem" }} /> Add Space
        </div>
      </div>

      {/* Main Section for Added Spaces */}
      <div className={styles.mainsection}>
        <div
          className={`${styles.spaceList} ${
            !propertySpace || propertySpace.length === 0 ? styles.noRooms : ""
          }`}
        >
          {Array.isArray(propertySpace) && propertySpace.length > 0 ? (
            propertySpace.map((space, index) => (
              <div
                key={index}
                className={styles.spaceItem}
                onClick={() => handleSpaceClick(space)}
              >
                <div className={styles.spaceCard}>
                  <div className={styles.spaceImageRow}>
                    <img
                      src={"https://via.placeholder.com/150"} // Placeholder image
                      alt={space.space.name}
                      className={styles.spaceImage}
                    />
                  </div>
                  <div className={styles.spaceNameRow}>
                    <p>
                      {space.space.name} {space.instanceNumber}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.error}>No Rooms Available for this property</p>
          )}
        </div>
      </div>

      {/* Dialog for adding space */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Choose a Room or Space</DialogTitle>
        <DialogContent>
          {spaces.length === 0 ? (
            <Typography>No spaces available to select</Typography>
          ) : (
            <Grid container spacing={3}>
              {spaces.map((space, index) => (
                <Grid item xs={6} key={index}>
                  <div
                    onClick={() => setSelectedSpace(space)}
                    style={{
                      cursor: "pointer",
                      padding: "10px",
                      textAlign: "center",
                      border:
                        selectedSpace?.id === space.id
                          ? "2px solid blue"
                          : "1px solid #ddd",
                    }}
                  >
                    <img
                      src={space.s3_url || "https://via.placeholder.com/150"} // Placeholder image
                      alt={space.name}
                      style={{
                        width: "100%",
                        height: "100px",
                        marginBottom: "10px",
                      }}
                    />
                    <Typography>{space.name}</Typography>
                  </div>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleAddSpace}
            color="primary"
            disabled={!selectedSpace || loading}
          >
            {loading ? "Adding..." : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SpaceProperty;
