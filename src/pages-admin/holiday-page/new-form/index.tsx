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
import CloseIcon from "@mui/icons-material/Close";
import EventIcon from "@mui/icons-material/Event";
import styles from "./new-form.module.css";
import { useSelector, useDispatch } from "react-redux";
import Loader from "@/components/loader";
import { RootState } from "@/store/reducers";
import { AppDispatch } from "@/store";
import { addHoliday } from "@/store/slice/auth/holidaySlice";
import { fetchProperties } from "@/store/slice/auth/propertiesSlice";
import {NewFormProps} from '../holiday.types';


const NewForm: React.FC<NewFormProps> = ({ onClose, onHolidayAdded }) => {
  const [name, setName] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedProperties, setSelectedProperties] = useState<number[]>([]);
  const [allPropertiesSelected, setAllPropertiesSelected] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [yearError, setYearError] = useState<string | null>(null);
  const [startDateError, setStartDateError] = useState<string | null>(null);
  const [endDateError, setEndDateError] = useState<string | null>(null);
  const [propertiesErrors, setPropertiesError] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { properties, status: propertiesStatus, error: propertiesError } = useSelector((state: RootState) => state.property);
  const { loading: holidayLoading, error: holidayError } = useSelector((state: RootState) => state.holiday);

  useEffect(() => {
    if (propertiesStatus === 'idle') {
      dispatch(fetchProperties());
    }
  }, [propertiesStatus, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setPropertiesError("User ID not found. Please log in again.");
      return;
    }

    let valid = true;

    if (!name) {
      setNameError("Fill in the Name");
      valid = false;
    } else {
      setNameError(null);
    }

    if (!year) {
      setYearError("Fill in the Year");
      valid = false;
    } else {
      setYearError(null);
    }

    if (!startDate) {
      setStartDateError("Fill in the Start Date");
      valid = false;
    } else {
      setStartDateError(null);
    }

    if (!endDate) {
      setEndDateError("Fill in the End Date");
      valid = false;
    } else {
      setEndDateError(null);
    }

    if (selectedProperties.length === 0) {
      setPropertiesError("Select at least one property");
      valid = false;
    } else {
      setPropertiesError(null);
    }

    if (!valid) {
      return;
    }

    try {
      const holidayData = {
        name,
        year: Number(year),
        startDate: startDate?.toISOString().split("T")[0] ?? "",
        endDate: endDate?.toISOString().split("T")[0] ?? "",
        properties: allPropertiesSelected
          ? properties.map((property) => ({ id: property.id }))
          : selectedProperties.map((id) => ({ id })),
        createdBy: {
          id: userId,
        },
      };
      
      const resultAction = await dispatch(addHoliday(holidayData));
      
      if (addHoliday.fulfilled.match(resultAction)) {
        onHolidayAdded();
        onClose();
      } else if (addHoliday.rejected.match(resultAction)) {
        setPropertiesError(resultAction.payload as string || "Failed to add holiday. Please try again.");
      }
    } catch (err) {
      console.error("Error adding holiday:", err);
      setPropertiesError("Failed to add holiday. Please try again.");
    }
  };

  const handlePropertyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    if (name === "allProperties") {
      handleAllPropertiesChange(checked);
    } else {
      const propertyId = parseInt(name);
      if (checked) {
        setSelectedProperties((prev) => [...prev, propertyId]);
      } else {
        setSelectedProperties((prev) => prev.filter((id) => id !== propertyId));
      }
      updateAllPropertiesSelected();
    }
  };

  const handleAllPropertiesChange = (checked: boolean) => {
    setAllPropertiesSelected(checked);
    if (checked) {
      setSelectedProperties(properties.map((property) => property.id));
    } else {
      setSelectedProperties([]);
    }
  };

  const updateAllPropertiesSelected = () => {
    setAllPropertiesSelected(selectedProperties.length === properties.length);
  };

  if (propertiesStatus === 'loading') {
    return <Loader />;
  }

  if (propertiesStatus === 'failed') {
    return <Typography color="error">{propertiesError}</Typography>;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.formContainer}>
        <Paper elevation={9} className={styles.formPaper}>
          <Box className={styles.formHeader}>
            <EventIcon className={styles.headerIcon} />
            <Typography variant="h4" className={styles.formTitle}>
              Add Holiday
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
                  variant="outlined"
                  className={styles.inputField}
                  error={!!nameError}
                  helperText={nameError}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value) || "")}
                  fullWidth
                  variant="outlined"
                  className={styles.inputField}
                  error={!!yearError}
                  helperText={yearError}
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
                        error: !!startDateError,
                        helperText: startDateError,
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
                        error: !!endDateError,
                        helperText: endDateError,
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
                  error={!!propertiesError}
                >
                  <div className={styles.scrollableContainer}>
                    <FormGroup>
                      <Grid container>
                        <Grid item xs={6}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={allPropertiesSelected}
                                onChange={(e) => handlePropertyChange(e)}
                                name="allProperties"
                              />
                            }
                            label="All Properties"
                            className={styles.formControlLabel}
                          />
                        </Grid>
                        {properties.map((property) => (
                          <Grid item xs={6} key={property.id}>
                            <FormControlLabel
                              sx={{
                                fontSize: "small",
                              }}
                              control={
                                <Checkbox
                                  checked={selectedProperties.includes(
                                    property.id
                                  )}
                                  onChange={handlePropertyChange}
                                  name={property.id.toString()}
                                />
                              }
                              label={property.propertyName}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </FormGroup>
                  </div>
                  {propertiesError && (
                    <Typography
                      color="error"
                      variant="body2"
                      className={styles.propertiesError}
                    >
                      {propertiesError}
                    </Typography>
                  )}
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
                {holidayLoading ? "Adding..." : "Add Holiday"}
              </Button>
            </Box>
          </form>
          {holidayError && (
            <Typography color="error" className={styles.errorMessage}>
              {holidayError}
            </Typography>
          )}
        </Paper>
      </div>
    </div>
  );
};

export default NewForm;