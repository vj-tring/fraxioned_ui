import { useState } from "react";
import { Grid, Typography, Button } from "@mui/material"; // Updated import for Material-UI components
import "./things-to-know.css";
const HouseRules = () => {
  const [showMore, setShowMore] = useState(false);

  const houseRules = [
    "Check-in after 4:00 PM",
    "Check-out before 11:00 PM",
    "9 Guest Maximum",
    "Please dispose of trash properly.",
    "Respect your neighbors.",
    "Keep the noise to a minimum.",
    "No parties allowed.",
  ];

  const visibleRules = showMore ? houseRules : houseRules.slice(0, 4);

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
              className="monsterrat1 RuleList
"
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

const ThingsToKnow = () => {
  return (
    <div className="mt-3">
      <Typography variant="h4" className="ThingstoHead1 monsterrat">
        Things to Know
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <HouseRules />
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
