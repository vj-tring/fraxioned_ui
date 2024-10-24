import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { SelectChangeEvent } from "@mui/material";
import { Image } from "../property-listing-page";
import { Card } from "../../store/slice/auth/property-slice";
import { Dropdown } from "primereact/dropdown";
import "../booking/trackingMyNights.css";

interface RootState {
  properties: {
    cards: Card[];
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

  useEffect(() => {
    if (properties.length > 0) {
      setSelectedPropertyId(properties[0].id);
    }
  }, [properties]);

  const handlePropertyChange = (event: SelectChangeEvent<number>) => {
    setSelectedPropertyId(event.target.value as number);
  };

  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setSelectedYear(event.target.value as number);
  };

  const selectedProperty = properties.find(
    (property) => property.id === selectedPropertyId
  );

  // Safely access property details with fallback
  const propertyDetails = selectedProperty?.details?.[selectedYear] || {
    offAllottedNights: 0,
    offUsedNights: 0,
    offBookedNights: 0,
    offRemainingNights: 0,
    offAllottedHolidayNights: 0,
    offUsedHolidayNights: 0,
    offBookedHolidayNights: 0,
    offRemainingHolidayNights: 0,
    peakAllottedNights: 0,
    peakUsedNights: 0,
    peakBookedNights: 0,
    peakRemainingNights: 0,
    peakAllottedHolidayNights: 0,
    peakUsedHolidayNights: 0,
    peakBookedHolidayNights: 0,
    peakRemainingHolidayNights: 0,
  };

  const availableYears = selectedProperty?.details
    ? Object.keys(selectedProperty.details).map((year) => parseInt(year))
    : [new Date().getFullYear()];

  const showselectedimage = (id: number) => {
    const filteredImage = properties
      .filter((image) => image.propertyId === id)
      .sort((a: Image, b: Image) => a.displayOrder - b.displayOrder);
    return filteredImage[0]?.coverImageUrl;
  };

  const formatDate = (dateStr: string | number | Date | undefined) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getOffSeasonDates = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) {
      return {
        offSeasonBefore: { startDate: "", endDate: "" },
        offSeasonAfter: { startDate: "", endDate: "" },
      };
    }

    const peakStart = new Date(startDate);
    const peakEnd = new Date(endDate);

    const offSeasonBeforeStart = {
      startDate: new Date(peakStart.getFullYear(), 12, 1),
      endDate: new Date(
        peakStart.getFullYear(),
        peakStart.getMonth(),
        peakStart.getDate() - 1
      ),
    };

    const offSeasonAfterEnd = {
      startDate: new Date(
        peakEnd.getFullYear(),
        peakEnd.getMonth(),
        peakEnd.getDate() + 1
      ),
      endDate: new Date(peakEnd.getFullYear(), 11, 31),
    };

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

  const { offSeasonBefore, offSeasonAfter } = getOffSeasonDates(
    selectedProperty?.peakSeasonStartDate || "",
    selectedProperty?.peakSeasonEndDate || ""
  );

  const [selectedProperty1, setSelectedProperty1] = useState<number | null>(
    null
  );

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
          <div className="p-2.5">
            <Dropdown
              value={selectedProperty1}
              onChange={(e) => {
                setSelectedProperty1(e.value);
                handlePropertyChange(e);
              }}
              options={properties.map((property) => ({
                label: property.propertyName,
                value: property.id,
                style: {
                  backgroundColor: "white",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  width: "250px",
                  paddingLeft: "25px",
                  fontSize: "small",
                  display: "flex",
                },
              }))}
              optionLabel="label"
              placeholder="Select a Property"
              className="w-full md:w-14rem DropdownLabel"
            />
          </div>

          <hr className="vl mt-2" />

          <div className="p-2.5">
            <Dropdown
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.value);
                handleYearChange(e);
              }}
              options={availableYears.map((year) => ({
                label: year.toString(),
                value: year,
                style: {
                  backgroundColor: "white",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  width: "100px",
                  paddingLeft: "27px",
                  fontSize: "small",
                },
              }))}
              optionLabel="label"
              placeholder="Select Year"
              className="w-full md:w-14rem DropdownLabel1"
            />
          </div>
        </div>
      </div>

      <div className="container3 mt-3 pt-4 d-flex">
        <div className="cardImg">
          <img
            src={
              showselectedimage(selectedProperty?.propertyId ?? 1) ||
              "https://placehold.jp/150x150.png"
            }
            className="PropImg1"
            alt="Property"
            loading="lazy"
          />
          <div className="d-flex flex-column Prop-sec">
            <span className="Prop">
              {selectedProperty?.propertyName || "Select a property"}
            </span>
            <span className="Prop1">
              {selectedProperty?.address || "Address"}
            </span>
            <span className="Prop">
              {selectedProperty?.propertyShare
                ? `You Own ${selectedProperty.share}/${selectedProperty?.propertyShare}th share`
                : "Share information not available"}
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
            <div className="Total-Nights pt-3">
              <table style={{ width: "90%" }}>
                <tbody>
                  <tr>
                    <th>Total Nights</th>
                    <th className="TableValues">
                      {propertyDetails?.offAllottedNights}
                    </th>
                  </tr>
                  <tr>
                    <td>Nights Used</td>
                    <td className="TableValues">
                      {propertyDetails?.offUsedNights}
                    </td>
                  </tr>
                  <tr>
                    <td>Nights Booked</td>
                    <td className="TableValues">
                      {propertyDetails?.offBookedNights}
                    </td>
                  </tr>
                  <tr>
                    <td>Nights Remaining</td>
                    <td className="TableValues">
                      {propertyDetails?.offRemainingNights}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="Total-Holiday pt-3">
              <table style={{ width: "90%" }}>
                <tbody>
                  <tr>
                    <th>Total Holidays</th>
                    <th className="TableValues">
                      {propertyDetails?.offAllottedHolidayNights}
                    </th>
                  </tr>
                  <tr>
                    <td>Nights Used</td>
                    <th className="TableValues">
                      {propertyDetails?.offUsedHolidayNights}
                    </th>
                  </tr>
                  <tr>
                    <td>Nights Booked</td>
                    <th className="TableValues">
                      {propertyDetails?.offBookedHolidayNights}
                    </th>
                  </tr>
                  <tr>
                    <td>Nights Remaining</td>
                    <th className="TableValues">
                      {propertyDetails?.offRemainingHolidayNights}
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="PeakSea d-flex">
            <div className="Off-season">
              <li className="OffHead">Peak-Season</li>
              <li>
                {formatDate(selectedProperty?.peakSeasonStartDate)} -{" "}
                {formatDate(selectedProperty?.peakSeasonEndDate)}
              </li>
            </div>
            <div className="Total-Nights pt-4">
              <table style={{ width: "90%" }}>
                <tbody>
                  <tr>
                    <th>Total Nights</th>
                    <th className="TableValues">
                      {propertyDetails?.peakAllottedNights}
                    </th>
                  </tr>
                  <tr>
                    <td>Nights Used</td>
                    <td className="TableValues">
                      {propertyDetails?.peakUsedNights}
                    </td>
                  </tr>
                  <tr>
                    <td>Nights Booked</td>
                    <td className="TableValues">
                      {propertyDetails?.peakBookedNights}
                    </td>
                  </tr>
                  <tr>
                    <td>Nights Remaining</td>
                    <td className="TableValues">
                      {propertyDetails?.peakRemainingNights}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="Total-Holiday pt-4">
              <table style={{ width: "90%" }}>
                <tbody>
                  <tr>
                    <th>Total Holidays</th>
                    <td className="TableValues">
                      {propertyDetails?.peakAllottedHolidayNights}
                    </td>
                  </tr>
                  <tr>
                    <td>Nights Used</td>
                    <td className="TableValues">
                      {propertyDetails?.peakUsedHolidayNights}
                    </td>
                  </tr>
                  <tr>
                    <td>Nights Booked</td>
                    <td className="TableValues">
                      {propertyDetails?.peakBookedHolidayNights}
                    </td>
                  </tr>
                  <tr>
                    <td>Nights Remaining</td>
                    <td className="TableValues">
                      {propertyDetails?.peakRemainingHolidayNights}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingMyNigts;
