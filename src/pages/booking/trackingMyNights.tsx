import React, { useState, useEffect } from "react";
// import PropImg from "../../assests/room-interior-hotel-bedroom.jpg";
import PropImg1 from "../../assests/room-interior-hotel-bedroom.jpg";
import PropImg2 from "../../assests/blue-bear-lake.jpg";
import PropImg3 from "../../assests/bear-lake-bluffs.jpg";
import PropImg4 from "../../assests/lake-escape.jpg";
import "../booking/trackingMyNights.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { MenuItem, Select } from "@mui/material";

interface Property {
  id: number;
  propertyName?: string;
  address?: string;
  propertyShare?: string;
  details: {
    [year: number]: {
      offSeason: string;
      peakSeason: string;
      peakHoliday: string;
      offSeasonHoliday: string;
      peakRemainingNights: number;
      offRemainingNights: number;
      lastMinuteRemainingNights: number;
      offRemainingHolidayNights: number;
      peakRemainingHolidayNights: number;
      maximumStayLength: number;
    };
  };
}

interface RootState {
  properties: {
    cards: Property[];
    loading: boolean;
    error: string | null;
  };
}

const TrackingMyNigts: React.FC = () => {
  const properties = useSelector((state: RootState) => state.properties.cards);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    null
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const propertyImages: { [key: number]: string } = {
    1: PropImg1,
    2: PropImg2,
    3: PropImg3,
    4: PropImg4,
  };

  useEffect(() => {
    if (properties.length > 0) {
      setSelectedPropertyId(properties[0].id);
    }
  }, [properties]);

  const handlePropertyChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedPropertyId(event.target.value as number);
  };

  const handleYearChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedYear(event.target.value as number);
  };

  const selectedProperty = properties.find(
    (property) => property.id === selectedPropertyId
  );
  const propertyDetails = selectedProperty?.details[selectedYear] || {};

  const availableYears = Object.keys(selectedProperty?.details || {}).map(
    (year) => parseInt(year)
  );
  const imageSrc = selectedPropertyId
    ? propertyImages[selectedPropertyId]
    : PropImg1;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getOffSeasonDates = (startDate: string, endDate: string) => {
    const peakStart = new Date(startDate);
    const peakEnd = new Date(endDate);

    const offSeasonBeforeStart = {
      startDate: new Date(peakStart.getFullYear(), 12, 1), // Dec 31 of the current year
      endDate: new Date(
        peakStart.getFullYear(),
        peakStart.getMonth(),
        peakStart.getDate() - 1
      ), // Day before peak season starts
    };

    const offSeasonAfterEnd = {
      startDate: new Date(
        peakEnd.getFullYear(),
        peakEnd.getMonth(),
        peakEnd.getDate() + 1
      ), // Day after peak season ends
      endDate: new Date(peakEnd.getFullYear(), 11, 31), // Dec 30 of the same year
    };

    // Handle cases where peak season spans across years
    if (peakStart.getMonth() < 11) {
      offSeasonBeforeStart.endDate = new Date(
        peakStart.getFullYear(),
        peakStart.getMonth(),
        peakStart.getDate()
      );
    }
    if (
      peakEnd.getMonth() > 0 ||
      peakEnd.getFullYear() > peakStart.getFullYear()
    ) {
      offSeasonAfterEnd.startDate = new Date(
        peakEnd.getFullYear(),
        peakEnd.getMonth(),
        peakEnd.getDate() + 2
      );
    }

    return {
      offSeasonBefore: {
        startDate: offSeasonBeforeStart.startDate.toISOString().split("T")[0],
        endDate: offSeasonBeforeStart.endDate.toISOString().split("T")[0],
      },
      offSeasonAfter: {
        startDate: offSeasonAfterEnd.startDate.toISOString().split("T")[0],
        endDate: offSeasonAfterEnd.endDate.toISOString().split("T")[0],
      },
    };
  };

  const { offSeasonBefore, offSeasonAfter } = selectedProperty
    ? getOffSeasonDates(
        selectedProperty.details[selectedYear]?.peakSeasonStartDate || "",
        selectedProperty.details[selectedYear]?.peakSeasonEndDate || ""
      )
    : {
        offSeasonBefore: { startDate: "", endDate: "" },
        offSeasonAfter: { startDate: "", endDate: "" },
      };

  return (
    <div className="Container">
      <div className="My-nights">
        <h1 className="Trac-Nig">Tracking My Nights</h1>
        <p className="Trac-sec">
          Select the property and year you would like to track
        </p>
      </div>

      <div className="bar-btn-head">
        <div className="d-flex bar-btn">
          <Select
            value={selectedPropertyId || ""}
            onChange={handlePropertyChange}
            displayEmpty
            className="PropertyButton"
            sx={{
              width: "270px",
              color: "#808080",
              border: "none",
              borderRadius: "50px",
              "& .MuiSelect-select": {
                padding: "10px 14px",
                // fontSize: "16px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiOutlinedInput-root.Mui-focused": {
                boxShadow: "none",
              },
              "& .MuiSelect-icon": {
                color: "#ffffff",
                display:"none"
              },
              backgroundColor: "none",
            }}
          >
            {properties.map((property) => (
              <MenuItem key={property.id} value={property.id}>
                <div className="d-flex flex-column propertyMenu">
                  <MenuItem disableRipple className="ProperName monsterrat">
                    {property.propertyName}
                  </MenuItem>
                </div>
              </MenuItem>
            ))}
          </Select>
          <hr className="vl mt-2"></hr>
          <Select
            disableRipple
            value={selectedYear}
            onChange={handleYearChange}
            displayEmpty
            className="Year-btn"
            sx={{
              width: "150px",
              color: "#808080",
              border: "none",
              borderRadius: "50px",
              paddingLeft: "30px",
              fontFamily: "Montserrat, sans-serif",

              "& .MuiSelect-select": {
                padding: "10px 14px",
                // fontSize: "16px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiSelect-icon": {
                color: "#ffffff",
              },
              "& .MuiOutlinedInput-root.Mui-focused": {
                boxShadow: "none ",
              },
              backgroundColor: "none",
              // border:"none",
            }}
          >
            {availableYears.map((year) => (
              <MenuItem
                disableRipple
                key={year}
                value={year}
                className="monsterrat Year"
              >
                {year}
              </MenuItem>
            ))}
          </Select>
          {/* <hr className="vl mt-3"></hr> */}
          <button className="Track-btn">
            <span>Track</span>
            <FontAwesomeIcon icon={faSearch} style={{ color: "#ffffff" }} />
          </button>
        </div>
      </div>

      <div className="container3 mt-3 pt-4 d-flex">
        <div className="cardImg">
          <img src={imageSrc} className="PropImg1" alt="Property" />
          <div className="d-flex flex-column Prop-sec">
            {/* <span className="Prop">Property</span> */}
            <span className="Prop">
              {selectedProperty?.propertyName || "Select a property"}
            </span>
            <span className="Prop1">
              {selectedProperty?.address || "Address"}
            </span>
            <span className="Prop">
              {selectedProperty?.propertyShare || "Ownership"}
            </span>
          </div>
        </div>
        <div className="Total ">
          <div className="OffSea mb-4  ">
            <div className="Off-season">
              <li className="OffHead">Off-Season </li>
              <li>{`${formatDate(offSeasonBefore.startDate)} - ${formatDate(
                offSeasonBefore.endDate
              )}`}</li>

              <li>{`${formatDate(offSeasonAfter.startDate)} - ${formatDate(
                offSeasonAfter.endDate
              )}`}</li>
            </div>
            <div className="Total-Nights pt-3 ">
              <table style={{ width: "90%" }}>
                {/* <tbody> */}
                <tr>
                  <th>Total Nights</th>
                  <th className="TableValues">
                    {propertyDetails.offAllottedNights}
                  </th>
                </tr>
                <tr>
                  <td>Nights Used</td>
                  <td className="TableValues">
                    {propertyDetails.offUsedNights}
                  </td>
                </tr>
                <tr>
                  <td>Nights Booked</td>
                  <td className="TableValues">
                    {propertyDetails.offBookedNights}
                  </td>
                </tr>
                <tr>
                  <td>Nights Remaining</td>
                  <td className="TableValues">
                    {propertyDetails.offRemainingNights}
                  </td>
                </tr>
                {/* </tbody> */}
              </table>
            </div>
            <div className="Total-Holiday pt-3">
              <table style={{ width: "90%" }}>
                {/* <tbody> */}
                <tr>
                  <th>Total Holidays</th>
                  <th className="TableValues">
                    {propertyDetails.offAllottedHolidayNights}
                  </th>
                </tr>
                <tr>
                  <td>Nights Used</td>
                  <th className="TableValues">
                    {propertyDetails.offUsedHolidayNights}
                  </th>
                </tr>
                <tr>
                  <td>Nights Booked</td>
                  <th className="TableValues">
                    {propertyDetails.offBookedHolidayNights}
                  </th>
                </tr>
                <tr>
                  <td>Nights Remaining</td>
                  <th className="TableValues">
                    {propertyDetails.offRemainingHolidayNights}
                  </th>
                </tr>
                {/* </tbody> */}
              </table>
            </div>
          </div>
          <div className="PeakSea d-flex">
            <div className="Off-season">
              <li className="OffHead">Peak-Season</li>
              <li>
                {formatDate(propertyDetails.peakSeasonStartDate)} -{" "}
                {formatDate(propertyDetails.peakSeasonEndDate)}
              </li>

              {/* <li>Dec 31 - May 31</li> */}
              {/* <li>Sept 21 - Dec 30</li> */}
            </div>
            <div className="Total-Nights pt-4">
              <table style={{ width: "90%" }}>
                {/* <tbody> */}
                <tr>
                  <th>Total Nights</th>
                  <th className="TableValues">
                    {propertyDetails.peakAllottedNights}
                  </th>
                </tr>
                <tr>
                  <td>Nights Used</td>
                  <td className="TableValues">
                    {propertyDetails.peakUsedNights}
                  </td>
                </tr>
                <tr>
                  <td>Nights Booked</td>
                  <td className="TableValues">
                    {propertyDetails.peakBookedNights}
                  </td>
                </tr>
                <tr>
                  <td>Nights Remaining</td>
                  <td className="TableValues">
                    {propertyDetails.peakRemainingNights}
                  </td>
                </tr>
                {/* </tbody> */}
              </table>
            </div>
            <div className="Total-Holiday pt-4">
              <table style={{ width: "90%" }}>
                {/* <tbody> */}
                <tr>
                  <th>Total Holidays</th>
                  <td className="TableValues">
                    {propertyDetails.peakAllottedHolidayNights}
                  </td>
                </tr>
                <tr>
                  <td>Nights Used</td>
                  <td className="TableValues">
                    {propertyDetails.peakUsedHolidayNights}
                  </td>
                </tr>
                <tr>
                  <td>Nights Booked</td>
                  <td className="TableValues">
                    {propertyDetails.peakBookedHolidayNights}
                  </td>
                </tr>
                <tr>
                  <td>Nights Remaining</td>
                  <td className="TableValues">
                    {propertyDetails.peakRemainingHolidayNights}
                  </td>
                </tr>
                {/* </tbody> */}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingMyNigts;
