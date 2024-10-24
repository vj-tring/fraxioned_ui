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
import { createNewSpaceProperty, fetchSpacePropertiesById } from "@/store/slice/space/property";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAllImages } from "@/store/slice/space/images";
import Loader from "@/components/loader";
import { fetchPropertyAllRooms } from "@/store/slice/properties/propertyallrooms/action";
import { PropertySpace, SpaceImage } from "@/store/model/property-all-rooms.types";

const SpaceProperty: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const userId = useSelector((state: RootState) => state.auth.user?.id);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
    const [loading, setLoading] = useState(true);
    const spaces = useSelector((state: RootState) => state.spaces.spaces || []);
    const propertySpaceImages = useSelector((state: RootState) => state.spaceImage.images || []);
    const propertyAllRooms = useSelector((state: RootState) => state.propertyAllRooms.data || [])


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await dispatch(fetchAllSpaces()).unwrap();
                await dispatch(fetchSpacePropertiesById(Number(id))).unwrap();
            } catch (error) {
                console.log("Failed to load spaces or properties");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [dispatch, id]);

    useEffect(() => {
        dispatch(fetchAllImages());
    }, [dispatch])

    useEffect(() => {
        dispatch(fetchPropertyAllRooms(Number(id)));
    }, [dispatch])

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
                await dispatch(fetchPropertyAllRooms(Number(id)))
                setIsDialogOpen(false);
                setSelectedSpace(null);
            } catch (error) {
                console.log("Error creating space property");
            } finally {
                setLoading(false);
            }
        }
    };

    const getSpaceImage = (spaceImages: SpaceImage[]) => {
        if (spaceImages.length === 1) {
            spaceImages.sort((a, b) => a.displayOrder - b.displayOrder);
            if (spaceImages.length > 0) {
                return spaceImages[0].url;
            }
        }
        else {
            return spaceImages[0].url;
        }
    };


    // Navigate to space details page when a space is clicked
    const handleSpaceClick = (space: PropertySpace) => {
        // Sending all rooms, regardless of isBedTypeAllowed or isBathroomTypeAllowed
        navigate(`/admin/property/${id}/rooms/${space.spaceId}`, { state: { space } });
    };

    return (
        <div className={styles.fullContainer}>
            {loading && <Loader />}
            <div className={styles.headersection}>
                <h2>Add Space Property</h2>
                <div className={styles.addspace} onClick={() => setIsDialogOpen(true)}>
                    <FaPlus style={{ fontSize: '.8rem' }} /> Add Space
                </div>
            </div>

            <div className={styles.mainsection}>
                <div className={`${styles.spaceList} ${(!propertyAllRooms.propertySpaces || propertyAllRooms.propertySpaces.length === 0) ? styles.noRooms : ''}`}>
                    {Array.isArray(propertyAllRooms.propertySpaces) && propertyAllRooms.propertySpaces.length > 0 ? (
                        propertyAllRooms.propertySpaces.map((space: PropertySpace, index: number) => (
                            <div key={index} className={styles.spaceItem} onClick={() => handleSpaceClick(space)}>
                                <div className={styles.spaceCard}>
                                    <div className={styles.spaceImageRow}>
                                        <img
                                            src={getSpaceImage(space.propertySpaceImages)}
                                            alt={space.propertySpaceName}
                                            className={styles.spaceImage}
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className={styles.spaceNameRow}>
                                        <p className={styles.spaceName}>
                                            {space.propertySpaceName}
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
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Choose a Room or Space</DialogTitle>
                <DialogContent>
                    {spaces.length === 0 ? (
                        <Typography>No spaces available to select</Typography>
                    ) : (
                        <Grid container spacing={3}>
                            {spaces.map((space, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <div
                                        onClick={() => setSelectedSpace(space)}
                                        style={{
                                            cursor: 'pointer',
                                            padding: '10px',
                                            textAlign: 'center',
                                            border: selectedSpace?.id === space.id ? '2px solid blue' : '1px solid #ddd',
                                            borderRadius: '5px',
                                            backgroundColor: '#f9f9f9',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                            transition: 'transform 0.2s ease',
                                        }}
                                    >
                                        <img
                                            src={space.s3_url || "https://via.placeholder.com/150"}
                                            alt={space.name}
                                            loading="lazy"
                                            style={{
                                                width: '100%',
                                                height: '100px',
                                                marginBottom: '10px',
                                                borderRadius: '5px 5px 0 0', // Rounded top corners for the image
                                            }}
                                        />
                                        <Typography variant="h6">{space.name}</Typography>
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
                    <Button onClick={handleAddSpace} color="primary" disabled={!selectedSpace || loading}>
                        {loading ? "Adding..." : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SpaceProperty;
