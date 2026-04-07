import React from "react";

import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const CustomDatePicker = ({
  label,
  defaultValue = Date.now(),
  value,
  setValue,
  style = {},
  containerStyle = {},
  format = "YYYY-MM-DD",
  disabled=false
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker"]} sx={containerStyle}>
        <DatePicker
          label={label}
          value={dayjs(value)}
          onChange={(newValue) => setValue(Date.parse(newValue))}
          defaultValue={dayjs(defaultValue)}
          format={format}
          sx={style}
          disabled={disabled}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
