import React from "react";
import { IconButton } from "@mui/material";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";
const PageCard = ({ name, number, image, handleClick }) => {
  return (
    <div className="page-card">
      <div className="page-card-header">
        <span>{name}</span>
        <IconButton className="page-card-icon" onClick={handleClick}>
          <KeyboardBackspaceRoundedIcon />
        </IconButton>
      </div>
      <hr style={{ width: "100%" }} />
      <div className="page-card-body">
        <span className="page-card-number">{number}</span>
        <div className="page-card-image" onClick={handleClick}>
          {image}
        </div>
      </div>
    </div>
  );
};

export default PageCard;
