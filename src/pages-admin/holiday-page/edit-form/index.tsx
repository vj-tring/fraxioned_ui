import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import styles from "./edit-form.module.css";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector, useDispatch } from "react-redux";
import Loader from "@/components/loader";
import { RootState } from "@/store/reducers";
import EventIcon from "@mui/icons-material/Event";
import { fetchProperties } from "@/store/slice/auth/propertiesSlice";
import { AppDispatch } from "@/store";
import { fetchPropertyHoliday, updateHoliday } from "@/store/slice/auth/holidaySlice";
import {EditFormProps} from '../holiday.types';


const EditForm: React.FC<EditFormProps> = ({
  onClose,
  onHolidayUpdated,
  holidayData,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState(holidayData.name);
  const [year, setYear] = useState<number>(holidayData.year);
  const [startDate, setStartDate] = useState<Date | null>(
    new Date(holidayData.startDate)
  );
  const [endDate, setEndDate] = useState<Date | null>(
    new Date(holidayData.endDate)
  );
  const [selectedProperties, setSelectedProperties] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const properties = useSelector((state: RootState) => state.property.properties);
  const propertyStatus = useSelector((state: RootState) => state.property.status);
  const propertyError = useSelector((state: RootState) => state.property.error);
  
  // New selectors for holiday state
  const selectedHoliday = useSelector((state: RootState) => state.holiday.selectedHoliday);
  const holidayLoading = useSelector((state: RootState) => state.holiday.loading);
  const holidayError = useSelector((state: RootState) => state.holiday.error);

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchPropertyHoliday(holidayData.id));
  }, [dispatch, holidayData.id]);

  useEffect(() => {
    if (selectedHoliday?.propertySeasonHolidays) {
      const holidayProperties = selectedHoliday.propertySeasonHolidays.map(
        (psh) => psh.property.id
      );
      setSelectedProperties(holidayProperties);
    }
  }, [selectedHoliday]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError("User ID not found. Please log in again.");
      return;
    }

    const updatedHolidayData = {
      name,
      year,
      startDate: startDate?.toISOString().split("T")[0],
      endDate: endDate?.toISOString().split("T")[0],
      updatedBy: {
        id: userId,
      },
      properties: selectedProperties.map((id) => ({ id })),
    };

    try {
      await dispatch(updateHoliday({ 
        id: holidayData.id, 
        updatedHolidayData 
      })).unwrap();
      onHolidayUpdated();
      onClose();
    } catch (err) {
      console.error("Error updating holiday:", err);
      setError("Failed to update holiday. Please try again.");
    }
  };

  const handlePropertyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    const propertyId = parseInt(name);
    if (checked) {
      setSelectedProperties((prev) => [...prev, propertyId]);
    } else {
      setSelectedProperties((prev) => prev.filter((id) => id !== propertyId));
    }
  };

  if (propertyStatus === 'loading' || holidayLoading) {
    return <Loader />;
  }

  if (propertyStatus === 'failed') {
    return <Typography color="error">{propertyError || "An error occurred loading properties"}</Typography>;
  }

  if (holidayError) {
    return <Typography color="error">{holidayError}</Typography>;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.formContainer}>
        <Paper elevation={9} className={styles.formPaper}>
          <Box className={styles.formHeader}>
            <EventIcon className={styles.headerIcon} />
            <Typography variant="h4" className={styles.formTitle}>
              Edit Holiday
            </Typography>
            <IconButton
              onClick={onClose}
              className={styles.closeButton}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Name"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  className={styles.inputField}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value) || 0)}
                  fullWidth
                  required
                  variant="outlined"
                  className={styles.inputField}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    className={styles.datePicker}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        className: styles.inputField,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    className={styles.datePicker}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        className: styles.inputField,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  className={styles.checkboxGroupLabel}
                >
                  Select Properties
                </Typography>
                <FormControl
                  component="fieldset"
                  className={styles.checkboxGroup}
                >
                  <div className={styles.scrollableContainer}>
                    <FormGroup>
                      <Grid container>
                        {properties.map((property) => (
                          <Grid item xs={3} key={property.id}>
                            <div className="d-flex ">
                              <FormControlLabel
                                sx={{
                                  marginRight: "5px",
                                  marginLeft: "6px",
                                }}
                                control={
                                  <Checkbox
                                    sx={{
                                      padding: "0px",
                                    }}
                                    checked={selectedProperties.includes(
                                      property.id
                                    )}
                                    onChange={handlePropertyChange}
                                    name={property.id.toString()}
                                  />
                                }
                                label={undefined}
                              />
                              <div className={styles.formControlLabel}>
                                {property.propertyName}
                              </div>
                            </div>
                          </Grid>
                        ))}
                      </Grid>
                    </FormGroup>
                  </div>
                </FormControl>
              </Grid>
            </Grid>
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
                className={styles.addButton}
                disabled={holidayLoading}
              >
                {holidayLoading ? "Updating..." : "Update Holiday"}
              </Button>
            </Box>
          </form>
        </Paper>
      </div>
    </div>
  );
};

export default EditForm;