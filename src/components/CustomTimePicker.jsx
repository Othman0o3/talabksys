import React, { useState } from "react";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

export default function CustomTimePicker({
  label,
  defaultValue = Date.now(),
  value,
  setValue,
  style = {},
  containerStyle = {},
  format = "hh:mm:ss A",
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["TimePicker"]} sx={containerStyle}>
        <TimePicker
          label={label}
          sx={style}
          defaultValue={dayjs(defaultValue)}
          value={dayjs(value)}
          onChange={(newValue) => setValue(newValue)}
          format={format}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
