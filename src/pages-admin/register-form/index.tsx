import React, { useState, useEffect } from "react";
import styles from "./register.module.css";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../store/slice/auth/register";
import { fetchProperties } from "@/store/slice/auth/propertiesSlice";
import { fetchRoles } from "@/store/slice/roles";
import { RootState } from "@/store/reducers";
import Loader from "@/components/loader";
import CustomizedSnackbars from "@/components/customized-snackbar";
import { ChangeEvent } from "react";
import { AppDispatch } from "@/store";
import { Plus, Save, Trash2, X, Edit } from "lucide-react";

interface RegisterFormContentProps {
  onClose: () => void;
}

const RegisterFormContent: React.FC<RegisterFormContentProps> = ({
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    addressLine1: "",
    phoneNumber: "",
    roleId: 0,
    propertyID: 0,
    noOfShares: 1,
    acquisitionDate: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    addressLine1: "",
    phoneNumber: "",
    roleId: "",
    propertyID: "",
    noOfShares: "",
    acquisitionDate: "",
    userPropertyDetails: "null",
  });

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  // const [showPropertyFields, setShowPropertyFields] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [addedProperties, setAddedProperties] = useState<any[]>([]);
  const [numberstate, setNumberstate] = useState<number[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const properties = useSelector(
    (state: RootState) => state.property.properties || []
  );
  const propertiesStatus = useSelector(
    (state: RootState) => state.property.status
  );
  const roles = useSelector((state: RootState) => state.roles.roles || []);
  const rolesStatus = useSelector((state: RootState) => state.roles.status);

  useEffect(() => {
    dispatch(fetchProperties());
    dispatch(fetchRoles()); // Dispatch fetchRoles action
  }, [dispatch]);

  useEffect(() => {
    if (properties.length > 0) {
      updateShareholderLimits(properties[0].id);
    }
  }, [properties]);

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    const newValue = parseInt(value, 10);
    setFormValues({
      ...formValues,
      [name]: newValue,
    });
    if (name === "propertyID") {
      updateShareholderLimits(newValue);
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFormValues({
      ...formValues,
      acquisitionDate: value,
    });
  };

  const addProperty = () => {
    if (formValues.propertyID === 0) {
      setSnackbarMessage("Please select a property");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
      return;
    }

    if (formValues.noOfShares <= 0) {
      setSnackbarMessage("Number of shares must be greater than 0");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
      return;
    }

    if (!formValues.acquisitionDate) {
      setSnackbarMessage("Please select an acquisition date");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
      return;
    }

    if (editIndex !== null) {
      setAddedProperties((prev) => {
        const updatedProperties = [...prev];
        updatedProperties[editIndex] = {
          ...formValues,
          propertyName: properties.find(
            (property) => property.id === formValues.propertyID
          )?.propertyName,
        };
        return updatedProperties;
      });
      setEditIndex(null);
    } else {
      setAddedProperties((prev) => [
        ...prev,
        {
          ...formValues,
          propertyName: properties.find(
            (property) => property.id === formValues.propertyID
          )?.propertyName,
        },
      ]);
    }
    setFormValues({
      ...formValues,
      propertyID: 0,
      noOfShares: 1,
      acquisitionDate: new Date().toISOString().split("T")[0],
    });
    // setShowPropertyFields(false);
    setSnackbarMessage("Property details successfully saved");
    setSnackbarSeverity("success");
    setShowSnackbar(true);
  };

  const handleEditProperty = (index: number) => {
    setAddedProperties((prev) =>
      prev.map((property, i) =>
        i === index ? { ...property, isEditing: !property.isEditing } : property
      )
    );

    if (addedProperties[index].isEditing && index !== -1) {
      setSnackbarMessage("Successfully saved");
      setSnackbarSeverity("success");
      setShowSnackbar(true);
    }
  };

  const handlecancelProperty = (index: number) => {
    setAddedProperties((prev) =>
      prev.map((property, i) =>
        i === index ? { ...property, isEditing: !property.isEditing } : property
      )
    );
  };

  const handleDeleteProperty = (index: number) => {
    setAddedProperties((prev) => prev.filter((_, i) => i !== index));
  };

  const updateShareholderLimits = (propertyId: number) => {
    const selectedProperty = properties.find((prop) => prop.id === propertyId);
    if (selectedProperty) {
      const maxShares = selectedProperty.propertyRemainingShare;
      setNumberstate(Array.from({ length: maxShares }, (_, i) => i + 1));
    } else {
      setNumberstate([]);
    }
  };

  const validate = () => {
    let hasErrors = false;

    const newErrors: any = {};

    if (!formValues.firstName) {
      newErrors.firstName = "First name is required";
      hasErrors = true;
    }
    if (!formValues.lastName) {
      newErrors.lastName = "Last name is required";
      hasErrors = true;
    }
    if (!formValues.email) {
      newErrors.email = "Email is required";
      hasErrors = true;
    }
    if (!formValues.addressLine1) {
      newErrors.addressLine1 = "Address Line 1 is required";
      hasErrors = true;
    }
    if (!formValues.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
      hasErrors = true;
    }
    if (formValues.roleId === 0) {
      newErrors.roleId = "Role is required";
      hasErrors = true;
    }
    if (addedProperties.length === 0) {
      errors.userPropertyDetails = "Property should not be empty";
      hasErrors = true;
    }
    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validate()) {
      setIsLoading(true);
      const payload = {
        email: formValues.email.trim().toLowerCase(),
        firstName: formValues.firstName.trim(),
        lastName: formValues.lastName.trim(),
        addressLine1: formValues.addressLine1.trim(),
        addressLine2: "",
        state: "Tamil Nadu",
        country: "India",
        city: "Salem",
        zipcode: "123456",
        phoneNumber: formValues.phoneNumber.trim(),
        roleId: formValues.roleId,
        updatedBy: 1,
        createdBy: 1,
        userPropertyDetails: addedProperties.map((property) => ({
          propertyID: property.propertyID,
          noOfShares: property.noOfShares,
          acquisitionDate: property.acquisitionDate,
        })),
      };

      try {
        const register = await dispatch(registerUser(payload)).unwrap();
        setIsLoading(false);
        if (register.message === "Invite sent successfully") {
          setSnackbarMessage(register.message);
          setSnackbarSeverity("success");
          setShowSnackbar(true);
          setFormValues({
            firstName: "",
            lastName: "",
            email: "",
            addressLine1: "",
            phoneNumber: "",
            roleId: 0,
            propertyID: 0,
            noOfShares: 1,
            acquisitionDate: new Date().toISOString().split("T")[0],
          });
          setAddedProperties([]);
          setTimeout(() => {
            onClose();
          }, 1000);
        } else {
          setSnackbarMessage(register.message);
          setSnackbarSeverity("error");
          setShowSnackbar(true);
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Registration Error:", error);
        setSnackbarMessage("Registration failed. Please try again.");
        setSnackbarSeverity("error");
        setShowSnackbar(true);
      }
    } else {
      if (errors.userPropertyDetails) {
        setSnackbarMessage(errors.userPropertyDetails);
        setSnackbarSeverity("error");
        setShowSnackbar(true);
      } else {
        setSnackbarMessage("Please correct the errors");
        setSnackbarSeverity("error");
        setShowSnackbar(true);
      }
    }
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  return (
    <>
      <div className={styles.modalContent}>
        {(isLoading ||
          propertiesStatus === "loading" ||
          rolesStatus === "loading") && <Loader />}{" "}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formContent}>
            <div className={styles.leftContent}>
              <h3 className={styles.sectionTitle}>BASIC DETAILS</h3>
              <div className={styles.inputGroup}>
                <select
                  id="roleId"
                  name="roleId"
                  value={formValues.roleId}
                  onChange={handleSelectChange}
                >
                  <option value={0}>Select Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.roleName}
                    </option>
                  ))}
                </select>
                {errors.roleId && (
                  <span className={styles.error}>{errors.roleId}</span>
                )}
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  value={formValues.firstName}
                  onChange={handleTextFieldChange}
                />
                {errors.firstName && (
                  <span className={styles.error}>{errors.firstName}</span>
                )}
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  value={formValues.lastName}
                  onChange={handleTextFieldChange}
                />
                {errors.lastName && (
                  <span className={styles.error}>{errors.lastName}</span>
                )}
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={formValues.email}
                  onChange={handleTextFieldChange}
                />
                {errors.email && (
                  <span className={styles.error}>{errors.email}</span>
                )}
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  id="addressLine1"
                  name="addressLine1"
                  placeholder="Address Line 1"
                  value={formValues.addressLine1}
                  onChange={handleTextFieldChange}
                />
                {errors.addressLine1 && (
                  <span className={styles.error}>{errors.addressLine1}</span>
                )}
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formValues.phoneNumber}
                  onChange={handleTextFieldChange}
                />
                {errors.phoneNumber && (
                  <span className={styles.error}>{errors.phoneNumber}</span>
                )}
              </div>
            </div>
            <div className={styles.rightContent}>
              <div className="flex justify-between items-center mb-[.8rem]">
                <h3 className={styles.sectionTitle}>Property Details</h3>
                {/* <button
                  type="button"
                  className='border-1 px-2 py-1 text-sm rounded-sm border-[#008a99] bg-[#007988] text-white hover:bg-[#008a99] flex items-center gap-1'
                  onClick={() => setShowPropertyFields(true)}
                >
                  <Plus size={18} />Add Property
                </button> */}
              </div>

              <div className={styles.addPropertySection}>
                <h2>Add a Property</h2>
                <div className={styles.inlineInputGroup}>
                  <div className={styles.propertyGroup}>
                    <select
                      id="propertyID"
                      name="propertyID"
                      value={formValues.propertyID}
                      onChange={handleSelectChange}
                      className={styles.addselectProperty}
                    >
                      <option value={0}>Select Property</option>
                      {properties
                        .filter(
                          (property) =>
                            !addedProperties.some(
                              (added) => added.propertyID === property.id
                            )
                        )
                        .map((property) => (
                          <option key={property.id} value={property.id}>
                            {property.propertyName}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className={styles.propertyGroupshare}>
                    <select
                      id="noOfShares"
                      name="noOfShares"
                      value={formValues.noOfShares}
                      onChange={handleSelectChange}
                      className={styles.addselectshare}
                    >
                      {numberstate.map((shareCount) => (
                        <option key={shareCount} value={shareCount}>
                          {shareCount}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.propertyGroup}>
                    <input
                      type="date"
                      id="acquisitionDate"
                      name="acquisitionDate"
                      value={formValues.acquisitionDate}
                      onChange={handleDateChange}
                      className={styles.addproptydate}
                    />
                  </div>
                  <button
                    type="button"
                    className='p-2 text-[#e28f25] rounded text-sm flex items-center gap-1'
                    onClick={addProperty}
                  >
                    <Plus size={15} /> Add
                  </button>
                  {/* <button
                    type="button"
                    className='p-2 text-[#e28f25] rounded'
                    onClick={() => {
                      setShowPropertyFields(false);
                    }}
                  >
                    <X size={18} />
                  </button> */}
                </div>
              </div>

              {addedProperties.length !== 0 ? (
                <div className={styles.addedPropertiesList}>
                  {addedProperties.map((property, index) => (
                    <div key={index} className={styles.propertyItem}>
                      {property.isEditing ? (
                        <>
                          <div className={styles.inlineInputGroup}>
                            <div className={styles.propertyGroup}>
                              <select
                                className={styles.propertylist}
                                value={property.propertyID}
                                onChange={(e) =>
                                  setAddedProperties((prev) =>
                                    prev.map((prop, i) =>
                                      i === index
                                        ? {
                                          ...prop,
                                          propertyID: parseInt(
                                            e.target.value,
                                            10
                                          ),
                                        }
                                        : prop
                                    )
                                  )
                                }
                              >
                                {properties.map((prop) => (
                                  <option key={prop.id} value={prop.id}>
                                    {prop.propertyName}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className={styles.propertyGroup}>
                              <select
                                className={styles.propertyshare}
                                value={property.noOfShares}
                                onChange={(e) =>
                                  setAddedProperties((prev) =>
                                    prev.map((prop, i) =>
                                      i === index
                                        ? {
                                          ...prop,
                                          noOfShares: parseInt(
                                            e.target.value,
                                            10
                                          ),
                                        }
                                        : prop
                                    )
                                  )
                                }
                              >
                                {numberstate.map((shareCount) => (
                                  <option key={shareCount} value={shareCount}>
                                    {shareCount}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className={styles.propertyGroup}>
                              <input
                                className={styles.propertydate}
                                type="date"
                                value={property.acquisitionDate}
                                onChange={(e) =>
                                  setAddedProperties((prev) =>
                                    prev.map((prop, i) =>
                                      i === index
                                        ? {
                                          ...prop,
                                          acquisitionDate: e.target.value,
                                        }
                                        : prop
                                    )
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className={styles.inlinebutton}>
                            <button
                              type="button"
                              className='text-[#e28f25] rounded hover:text-[#e28f25]'
                              onClick={() => handleEditProperty(index)}
                            >
                              <Save size={18} />
                            </button>
                            <button
                              type="button"
                              className='text-[#e28f25] rounded hover:text-[#e28f25]'
                              onClick={() => handlecancelProperty(index)}
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className={styles.propertylistview}>
                            {property.propertyName}
                          </span>
                          <span className={styles.propertyshareview}>
                            {property.noOfShares}
                          </span>
                          <span className={styles.propertydateview}>
                            {property.acquisitionDate}
                          </span>
                          <span className={styles.editsavebutton}>
                            <button
                              type="button"
                              className={styles.editButton}
                              onClick={() => handleEditProperty(index)}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              type="button"
                              className={styles.deleteButton}
                              onClick={() => handleDeleteProperty(index)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )
                :
                <div className={styles.noProperty}>
                  <span>No property Selected</span>
                </div>
              }
            </div>
          </div>
          <div className='flex md:justify-end gap-3 p-2.5 border-t sticky bottom-0 bg-[#fcfcfc] justify-between'>
            <button
              type="button"
              className='px-4 py-1.5 bg-white font-medium text-sm rounded-sm text-slate-800 hover:bg-slate-50 border-1 border-[#227ed7b] hover:border-slate-300 focus:ring-slate-300'
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className='px-4 py-1.5 bg-[#f09200] font-medium rounded-sm text-sm text-white hover:bg-[#e28f25] shadow-sm hover:shadow-md focus:ring-slate-500 border-1 border-[#227ed7b]'
              onClick={() => handleSubmit}
            >
              Register
            </button>
          </div>
        </form>
      </div>
      {showSnackbar && (
        <CustomizedSnackbars
          message={snackbarMessage}
          severity={snackbarSeverity}
          handleClose={handleSnackbarClose}
          open={showSnackbar}
        />
      )}
    </>
  );
};

export default RegisterFormContent;
