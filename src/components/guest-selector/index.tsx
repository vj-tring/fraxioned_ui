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
import { AlertCircle, CircleMinus, CirclePlus } from "lucide-react";
import { updateCount } from "@/store/slice/auth/propertyGuestSlice";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import { Alert, AlertDescription } from "../ui/alert";


const names = [
  { label: "Adults", description: "Ages 13+", icon: <PeopleIcon /> },
  {
    label: "Children",
    description: "Ages 2-12",
    icon: <ChildFriendlyIcon />,
  },
  { label: "Pets", description: "Animal friend", icon: <PetsIcon /> },
];

interface MultipleSelectProps {
  showIcons?: boolean;
  initialCount: number;
  initialCounts?: { [key: string]: number };
  onChange: (newCount: number) => void;
  onClose: () => void;
}

const MultipleSelect: React.FC<MultipleSelectProps> = ({
  showIcons = true,
  initialCount,
  onChange,
  onClose,
  initialCounts,
}) => {
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
      
      dynamicMsg = `Maximum ${noOfGuestsAllowed} guests (including children). No pets allowed.`;
    } else {
      dynamicMsg = `Maximum ${noOfGuestsAllowed} guests (including children) and ${noOfPetsAllowed} pets.`;
    }
    setDynamicMessage(dynamicMsg);

    return message === "";
  };

  const getTotalGuests = () => {
    return counts.Adults + counts.Children;
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
          setValidationMessage(
            `You can't have more than ${noOfPetsAllowed} pets.`
          );
          return;
        }
      } else {
        const totalGuests = counts.Adults + counts.Children;
        if (totalGuests >= noOfGuestsAllowed) {
          setValidationMessage(
            `You can't have more than ${noOfGuestsAllowed} guests.`
          );
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

    const newTotalGuests =
      name === "Pets"
        ? counts.Adults + counts.Children
        : counts.Adults + counts.Children - currentCount + newCount;
    const onChange = (newTotalGuests: number) => {};

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
    <Box sx={{ width: showIcons ? "16%" : "100%"}}>
      <Button
        disableRipple
        aria-controls="basic-menu"
        aria-haspopup="true"
        onClick={handleOpen}
        className="PropertyBtn"
        sx={{
          width: showIcons ? 160 : "100%",
          height: showIcons ? 56 : 48,
          border: "none",
          cursor: "pointer",
          paddingRight: showIcons ? 2 : 1,
          gap: 1,
          justifyContent: showIcons ? "flex-start" : "space-between",
        }}
      >
        {showIcons && (
          <PersonAddAlt1OutlinedIcon
            sx={{
              color: "grey",
              fontSize: "1.25rem",
            }}
          />
        )}

        <div
          className="d-flex align-items-start flex-column"
          style={{ paddingLeft: showIcons ? 0 : 13 }}
        >
          <span className="DateHead1 monsterrat text-sm">Who</span>
          <p className="property1 monsterrat text-xs">{getTotalGuests()} guests</p>
        </div>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: showIcons ? 315 :320,
            borderRadius: "8px",
            maxHeight: "320px",
            overflowY: "auto",
            padding: showIcons ? ".3rem 0": "0.3rem 7px",
            marginTop: "7px",
          },
        }}
      >
        {names.map((item) => (
          <MenuItem
            key={item.label}
            sx={{
              width: "100%",
              padding: showIcons ? "0 1.5rem" : "0.25rem 1.5rem",
              margin: ".4rem .1rem",
              height: showIcons ? "3.2rem" : "auto",
            }}
            disableRipple
          >
            <div className="d-flex justify-content-between align-items-center w-100 gap-2 monsterrat">
              {showIcons && (
                <Avatar
                  sx={{
                    backgroundColor: "#DF9526",
                    width: 32,
                    height: 32,
                  }}
                  className="monsterrat"
                >
                  {item.icon}
                </Avatar>
              )}
              <div className={showIcons ? "w-40" : ""}>
                <b className="text-sm">{item.label}</b>
                <p className="text-xs text-gray-600">{item.description}</p>
              </div>
              <div className="d-flex items-center gap-1 pb-2">
                <button
                  className="monsterrat p-1"
                  disabled={counts[item.label] === 0}
                  onClick={() => handleCountChange(item.label, "decrease")}
                >
                  <CircleMinus
                    size={showIcons ? 20 : 20}
                    strokeWidth={0.75}
                    color="grey"
                  />
                </button>
                <p className="Ad-count monsterrat pb-1 px-2">{counts[item.label]}</p>
                <button
                  className="p-1"
                  onClick={() => handleCountChange(item.label, "increase")}
                >
                  <CirclePlus
                    size={showIcons ? 20 : 20}
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
                    }`}
                  />
                </button>
              </div>
            </div>
          </MenuItem>
        ))}
          {validationMessage && (
            <Alert className="destructive">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-6 pr-2 text-red-600" />
                <AlertDescription className="text-red-600">{validationMessage}</AlertDescription>
              </div>
            </Alert>
          )}
        <div className="text-gray-600 text-[11px] px-4 pt-2 pb-2 leading-tight">
          <p>{dynamicMessage}</p>
        </div>
      </Menu>
    </Box>
  );
};

export default MultipleSelect;
