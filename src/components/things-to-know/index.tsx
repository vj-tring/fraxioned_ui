import { useState, useEffect, FC } from "react";
import { Grid, Typography, Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/store"; 
import "./things-to-know.css";
import {
  selectPropertyDetails,
  selectLoading,
  selectError,
  fetchPropertyDetailsById,
} from "@/store/slice/auth/ThingstoknowSlice";

interface HouseRulesProps {
  prop: number;
}
const convertTo12HourFormat = (hour: number): string => {
  const period = hour >= 12 ? "PM" : "AM";
  const adjustedHour = hour % 12 || 12;
  return `${adjustedHour}:00 ${period}`;
};
const HouseRules: FC<HouseRulesProps> = ({ prop }) => {
  const [showMore, setShowMore] = useState(false);

  const propertyDetails = useSelector(selectPropertyDetails);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
console.log("pd:", propertyDetails)
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (prop) {
      dispatch(fetchPropertyDetailsById(prop)); 
    }
  }, [dispatch, prop]);

  const houseRules = [
    propertyDetails ? `Check-in after ${convertTo12HourFormat(propertyDetails.checkInTime)}` : " ",
    propertyDetails ? `Check-out before ${convertTo12HourFormat(propertyDetails.checkOutTime)}` : " ",
    propertyDetails ? `Maximum ${propertyDetails.noOfGuestsAllowed} Guests Allowed` : " ",
    propertyDetails ? `${propertyDetails.petPolicy}` : " ",
  ];

  const visibleRules = showMore ? houseRules : houseRules.slice(0, 3);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div className="mt-4">
      <Typography variant="h6" className="ThingstoHead monsterrat" gutterBottom>
        House Rules
      </Typography>
      <Typography variant="body1" paragraph>
        <ul>
          {visibleRules.map((rule, index) => (
            <li
              key={index}
              style={{ marginBottom: "8px" }}
              className="monsterrat1 RuleList"
            >
              {rule}
            </li>
          ))}
        </ul>
        <Button
          variant="text"
          color="primary"
          onClick={() => setShowMore(!showMore)}
          style={{
            fontSize: "14px",
            textDecoration: "underline",
            textTransform: "capitalize",
            color: "black",
            fontWeight: "600",
            margin: 0,
            padding: 0,
          }}
          className="monsterrat shwmore"
        >
          {showMore ? "< Show Less " : "Show more >"}
        </Button>
      </Typography>
    </div>
  );
};

const SafetyAndProperty = () => {
  const [showMore, setShowMore] = useState(false);

  const safetyRules = ["Carbon monoxide alarm", "Smoke alarm."];

  const visibleSafetyRules = showMore ? safetyRules : safetyRules.slice(0, 4);

  return (
    <div style={{ padding: "16px" }} className="ThingsHead">
      <Typography variant="h6" className="ThingstoHead monsterrat" gutterBottom>
        Safety & Property
      </Typography>
      <Typography variant="body1" paragraph>
        <ul>
          {visibleSafetyRules.map((rule, index) => (
            <li
              key={index}
              style={{ marginBottom: "8px" }}
              className="monsterrat1 RuleList"
            >
              {rule}
            </li>
          ))}
        </ul>
        <Button
          variant="text"
          color="primary"
          onClick={() => setShowMore(!showMore)}
          style={{
            fontSize: "14px",
            textDecoration: "underline",
            textTransform: "capitalize",
            color: "black",
            fontWeight: "600",
            margin: 0,
            padding: 0,
          }}
          className="monsterrat shwmore"
        >
          {showMore ? "< Show Less " : "Show more >"}
        </Button>
      </Typography>
    </div>
  );
};

const CancellationPolicy = () => {
  const [showMore, setShowMore] = useState(false);

  const policyText = [
    "Add your trip details to get the cancellation details for this stay.",
  ];

  const visiblePolicyText = showMore ? policyText : policyText.slice(0, 2);

  return (
    <div style={{ padding: "16px" }} className="ThingsHead">
      <Typography variant="h6" className="ThingstoHead monsterrat" gutterBottom>
        Cancellation Policy
      </Typography>
      <Typography variant="body1" paragraph>
        <ul>
          {visiblePolicyText.map((text, index) => (
            <li
              key={index}
              style={{ marginBottom: "8px" }}
              className="monsterrat1 RuleList"
            >
              {text}
            </li>
          ))}
        </ul>
        <Button
          variant="text"
          color="primary"
          onClick={() => setShowMore(!showMore)}
          style={{
            fontSize: "14px",
            textDecoration: "underline",
            textTransform: "capitalize",
            color: "black",
            fontWeight: "600",
            margin: 0,
            padding: 0,
          }}
          className="monsterrat addDate"
        >
          {"Add Dates >"}
          {/* {showMore ? '< Add dates ' : 'Add Dates >'} */}
        </Button>
      </Typography>
    </div>
  );
};

interface Thinkprop {
  propId : number;
}

const ThingsToKnow: FC<Thinkprop>= (prop) => {
  return (
    <div className="mt-3">
      <Typography variant="h4" className="ThingstoHead1 monsterrat">
        Things to Know
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <HouseRules prop={prop.propId} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SafetyAndProperty />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CancellationPolicy />
        </Grid>
      </Grid>
    </div>
  );
};

export default ThingsToKnow;
