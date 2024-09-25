import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import PeopleIcon from "@mui/icons-material/People";
import ChildFriendlyIcon from "@mui/icons-material/ChildFriendly";
import PetsIcon from "@mui/icons-material/Pets";
import "./guest-selector.css";
import { RootState } from "@/store/reducers";
import { CircleMinus, CirclePlus } from "lucide-react";
import {
  updateCount,
} from "@/store/slice/auth/propertyGuestSlice";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";


const names = [
  { label: "Adults", description: "Ages 13 or above", icon: <PeopleIcon /> },
  { label: "Children",description: "Ages 2 to 12", icon: <ChildFriendlyIcon />,},
  { label: "Pets", description: "Bringing a service?", icon: <PetsIcon /> },
];



interface MultipleSelectProps {
  showIcons?: boolean;
  initialCount: number;
  initialCounts?: { [key: string]: number };
  onChange: (newCount: number) => void;
  onClose: () => void;
}


const MultipleSelect: React.FC<MultipleSelectProps> = ({ showIcons = true, initialCount, onChange, onClose, initialCounts, }) => {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const [dynamicMessage, setDynamicMessage] = useState<string>("");

  const selectedPropertyLimits = useSelector(
    (state: RootState) => state.properties.selectedPropertyLimits
  );
  const bookingSuccessMessage = useSelector(
    (state: RootState) => state.bookings.successMessage
  );
  const [counts, setCountsLocal] = useState<{ [key: string]: number }>({
    Adults: initialCounts?.Adults || 1,
    Children: initialCounts?.Children || 0,
    Pets: initialCounts?.Pets || 0,
  });
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [noOfguest, setNoOfGuestsAllowed] = useState<number>(0);
  const [noOfPets, setNoOfPetsAllowed] = useState<number>(0);

  useEffect(() => {
    if (initialCounts) {
      setCountsLocal(initialCounts);
    }
  }, [initialCounts]);

  useEffect(() => {
    validateCounts();
  }, [selectedPropertyLimits, counts]);

  const currentBooking = useSelector((state: RootState) => state.limits.counts);

  useEffect(() => {
    if (currentBooking) {
      setCountsLocal({
        Adults: currentBooking.Adults,
        Children: currentBooking.Children,
        Pets: currentBooking.Pets,
      });
      // dispatch(resetLimits());
    }
  }, [bookingSuccessMessage, dispatch]);

  const validateCounts = () => {
    if (!selectedPropertyLimits) return;
    const { noOfGuestsAllowed, noOfPetsAllowed } = selectedPropertyLimits;
    setNoOfGuestsAllowed(noOfGuestsAllowed);
    setNoOfPetsAllowed(noOfPetsAllowed);
    const totalGuests = counts.Adults + counts.Children;
    const totalPets = counts.Pets;
    let message = "";
    if (counts.Adults < 1) {
      message = "At least one adult is required.";
    } else if (totalGuests > noOfGuestsAllowed) {
      message = `The total number of guests cannot exceed ${noOfGuestsAllowed}.`;
    } else if (totalPets > noOfPetsAllowed) {
      message = `The number of pets cannot exceed ${noOfPetsAllowed}.`;
    }
    setValidationMessage(message);
    let dynamicMsg;

    if (noOfPetsAllowed === 0) {
      dynamicMsg = `This property allows a maximum of ${noOfGuestsAllowed} guests, including children. Pets aren't allowed.`;
    } else {
      dynamicMsg = `This property allows a maximum of ${noOfGuestsAllowed} guests, including children and ${noOfPetsAllowed} pets.`;
    }
    setDynamicMessage(dynamicMsg);

    return message === "";
  };

  const getTotalGuests = () => {
    return isEditMode ? initialCount : counts.Adults + counts.Children;
  };
  const handleCountChange = (name: string, action: "increase" | "decrease") => {
    if (!selectedPropertyLimits) {
      setValidationMessage("Please select a property before making changes.");
      return;
    }

    const { noOfGuestsAllowed, noOfPetsAllowed } = selectedPropertyLimits;
    const currentCount = counts[name];
    let newCount = currentCount;

    if (action === "increase") {
      if (name === "Pets") {
        if (currentCount >= noOfPetsAllowed) {
          setValidationMessage(`You can't have more than ${noOfPetsAllowed} pets.`);
          return;
        }
      } else {
        const totalGuests = counts.Adults + counts.Children;
        if (totalGuests >= noOfGuestsAllowed) {
          setValidationMessage(`You can't have more than ${noOfGuestsAllowed} guests.`);
          return;
        }
      }
      newCount = currentCount + 1;
    } else {
      if (name === "Adults" && currentCount <= 1) {
        setValidationMessage("At least one adult is required.");
        return;
      }
      newCount = Math.max(currentCount - 1, 0);
    }

    setCountsLocal((prevCounts) => ({
      ...prevCounts,
      [name]: newCount,
    }));

    dispatch(updateCount({ name, count: newCount }));

    const newTotalGuests = name === "Pets" 
      ? counts.Adults + counts.Children 
      : (counts.Adults + counts.Children - currentCount + newCount);

    onChange(newTotalGuests);
    validateCounts();
  };

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setValidationMessage("");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (open) {
        handleClose();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [open]);

  return (

    <Box sx={{ width: showIcons ? "20%" : "100%" }}>
      <Button
        disableRipple
        aria-controls="basic-menu"
        aria-haspopup="true"
        onClick={handleOpen}
        className="PropertyBtn"
        sx={{
          width: showIcons ? 200 : "100%",
          height: showIcons ? 70 : 56,
          border: "none",
          cursor: "pointer",
          paddingRight: showIcons ? 9 : 2,
          gap: 2,
          justifyContent: showIcons ? "flex-start" : "space-between",
        }}
      >

        {showIcons && (<PersonAddAlt1OutlinedIcon sx={{color:"grey"}} />)}

        <div className="d-flex align-items-start flex-column" style={{ paddingLeft: showIcons ? 0 : 15 }}>
          <span className="DateHead1 monsterrat" >Who</span>
          <p className="property1 monsterrat">{getTotalGuests()} guests</p>
        </div>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: showIcons ? 380 : 370,
            borderRadius: "10px",
            maxHeight: "400px",
            overflowY: "auto",
            padding: ".2rem 0",
          },
        }}
      >
        {names.map((item) => (
          <>
            <MenuItem
              key={item.label}
              sx={{
                width: "100%",
                padding: showIcons ? "0 2rem" : "0.5rem 2.5rem",
                margin: ".5rem 0",
                height: showIcons ? "4rem" : "auto",
              }}
              disableRipple
            >

            <div className={`d-flex justify-content-between align-items-center ${showIcons ? 'gap-2.5' : 'gap-2.5'} w-100 monsterrat`}>
            {showIcons && (
                <Avatar
                  sx={{
                    backgroundColor: "#DF9526",
                  }}
                  className="monsterrat"
                >
                  {item.icon}
                </Avatar>
              )}
                 <div className={showIcons ? "w-40" : ""}>
                  <b>{item.label}</b>
                  <p className="DescFont monsterrat">{item.description}</p>
                </div>
                <div className={`d-flex justify-content-around ${showIcons ? 'w-50' : 'w-40'} text-center`}>
                <button
                    className=" monsterrat"
                    disabled={counts[item.label] === 0}
                    onClick={() => handleCountChange(item.label, "decrease")}
                  >
                  <CircleMinus size={showIcons ? 29 : 29} strokeWidth={0.75} color="grey" />
                  </button>
                  <p className="Ad-count monsterrat">{counts[item.label]}</p>
                  <button
                    onClick={() => handleCountChange(item.label, "increase")}
                  >
                    <CirclePlus
                      size={showIcons ? 29 : 29}
                      strokeWidth={0.75}
                      className={`${
                        item.label === "Pets"
                          ? counts.Pets === noOfPets
                            ? "circleplusdisable"
                            : "circleplus"
                          : ""
                      } ${
                        item.label === "Adults" || item.label === "Children"
                        ? counts.Adults + counts.Children === noOfguest
                          ? "circleplusdisable"
                          : "circleplus"
                        : ""
                    } `}
                    />
                  </button>
                </div>
              </div>
            </MenuItem>
            {!(names.indexOf(item) === names.length - 1) && (
              <hr
                style={{
                  opacity: 0.08,
                  margin: "0 2.1rem",
                }}
              />
            )}
          </>
        ))}
        {validationMessage && (
          <div className="validationMsg monsterrat">
            <p style={{ color: "red" }}>{validationMessage}</p>
          </div>
        )}
        <div className="dynamicMsg monsterrat">
          <p>{dynamicMessage}</p>
        </div>
      </Menu>
    </Box>
  );
};

export default MultipleSelect;
