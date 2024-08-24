/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { CFormInput, CInputGroup, CInputGroupText } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilCalendar } from "@coreui/icons";

function CustomDateRangePicker({ onDateRangeChange }) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (onDateRangeChange) {
      onDateRangeChange({ startTime, endTime });
    }
  }, [startTime, endTime]);

  return (
    <div className="d-flex align-items-center">
      <CInputGroup className="me-3">
        <CInputGroupText>
          Start Date
          <span style={{ marginLeft: "0.5rem" }}>
            <CIcon icon={cilCalendar} />
          </span>
        </CInputGroupText>
        <CFormInput
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          placeholder="Start Date"
        />
      </CInputGroup>
      <CInputGroup className="me-3">
        <CInputGroupText>
          End Date
          <span style={{ marginLeft: "0.5rem" }}>
            <CIcon icon={cilCalendar} />
          </span>
        </CInputGroupText>
        <CFormInput
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          placeholder="End Date"
        />
      </CInputGroup>
    </div>
  );
}

export default CustomDateRangePicker;
