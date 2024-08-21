import React, { useState, useEffect } from "react";
import styles from "./register.module.css";
import { IoMdClose } from "react-icons/io";
import { FaSave, FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { registerUser } from "../../store/slice/auth/register";
import { AppDispatch } from "../../store";
import { getProperties, getRoles } from "../../api";
import Loader from "@/components/loader";
import CustomizedSnackbars from "@/components/customized-snackbar";
import { ChangeEvent } from "react";

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

  const [roles, setRoles] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
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
  });

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showPropertyFields, setShowPropertyFields] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [addedProperties, setAddedProperties] = useState<any[]>([]);
  const [numberstate, setNumberstate] = useState<number[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getProperties();
        setProperties(response.data);
        if (response.data.length > 0) {
          updateShareholderLimits(response.data[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch properties", error);
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await getRoles();
        console.log("Roles fetched:", response.data.roles);
        setRoles(response.data.roles);
      } catch (error) {
        console.error("Failed to fetch roles", error);
      }
    };

    fetchRoles();
    fetchProperties();
  }, []);

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
    setShowPropertyFields(false);
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

    if (addedProperties[index].isEditing) {
      setSnackbarMessage("Successfully saved");
      setSnackbarSeverity("success");
      setShowSnackbar(true);
    }
  };

  const handleDeleteProperty = (index: number) => {
    setAddedProperties((prev) => prev.filter((_, i) => i !== index));
  };

  const updateShareholderLimits = (propertyId: number) => {
    const selectedProperty = properties.find((prop) => prop.id === propertyId);
    if (selectedProperty) {
      const maxShares = selectedProperty.propertyShare;
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

      console.log("Payload:", payload);
      try {
        const register = await dispatch(registerUser(payload)).unwrap();
        console.log("Register response:", register);
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
      setSnackbarMessage("Please correct the errors");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
    }
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  return (
    <>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          {isLoading && <Loader />}
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Create a New Account</h2>
            <button className={styles.modalCloseButton} onClick={onClose}>
              <IoMdClose size={20} />
            </button>
          </div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formContent}>
              <div className={styles.leftContent}>
                <h3 className={styles.sectionTitle}>Basic Details</h3>
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
              </div>
              <div className={styles.rightContent}>
                <h3 className={styles.sectionTitle}>Property Details</h3>

                <div className="add-property"></div>
                <div className={styles.addPropertySection}>
                  <button
                    type="button"
                    className={styles.addButton}
                    onClick={() => setShowPropertyFields(true)}
                  >
                    Add Property
                  </button>

                  {showPropertyFields && (
                    <div className={styles.propertyFields}>
                      <div className={styles.inlineInputGroup}>
                        <div className={styles.inputGroup}>
                          <select
                            id="propertyID"
                            name="propertyID"
                            value={formValues.propertyID}
                            onChange={handleSelectChange}
                          >
                            <option value={0}>Select Property</option>
                            {properties.map((property) => (
                              <option key={property.id} value={property.id}>
                                {property.propertyName}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className={styles.inputGroup}>
                          <select
                            id="noOfShares"
                            name="noOfShares"
                            value={formValues.noOfShares}
                            onChange={handleSelectChange}
                          >
                            {numberstate.map((shareCount) => (
                              <option key={shareCount} value={shareCount}>
                                {shareCount}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className={styles.inputGroup}>
                          <input
                            type="date"
                            id="acquisitionDate"
                            name="acquisitionDate"
                            value={formValues.acquisitionDate}
                            onChange={handleDateChange}
                          />
                        </div>
                      </div>
                      <div className={styles.propertyButtons}>
                        <button
                          type="button"
                          className={styles.saveButton}
                          onClick={addProperty}
                        >
                          <FaSave />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.addedPropertiesList}>
                  {addedProperties.map((property, index) => (
                    <div key={index} className={styles.propertyItem}>
                      {property.isEditing ? (
                        <>
                          <div className={styles.inlineInputGroup}>
                            <div className={styles.inputGroup}>
                              <select
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
                            <div className={styles.inputGroup}>
                              <select
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
                            <div className={styles.inputGroup}>
                              <input
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
                          <button
                            type="button"
                            className={styles.saveButton}
                            onClick={() => handleEditProperty(index)}
                          >
                            <FaSave />
                          </button>
                        </>
                      ) : (
                        <>
                          <span>{property.propertyName}</span>
                          <span>{property.noOfShares}</span>
                          <span>{property.acquisitionDate}</span>
                          <button
                            type="button"
                            className={styles.editButton}
                            onClick={() => handleEditProperty(index)}
                          >
                            <FaEdit />
                            Edit
                          </button>
                          <button
                            type="button"
                            className={styles.deleteButton}
                            onClick={() => handleDeleteProperty(index)}
                          >
                            <FaTrash />
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                type="submit"
                className={styles.submitButton}
                onClick={() => handleSubmit}
              >
                Register
              </button>
            </div>
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
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
