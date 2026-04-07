import React from "react";
import { useNavigate } from "react-router-dom";

import ItemGridView from "../components/grid-view/ItemGridView";
import { Button, IconButton } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

const ItemPage = () => {
  const navigate = useNavigate();

  return (
    <div className="item-page">
      <div className="item-page-top-bar">
        <Button
          variant="contained"
          className="primary-btn"
          onClick={() => navigate("/item-details")}
        >
          إضافة صنف
        </Button>
        <div className="search-input-text-container">
          <input type="text" className="search-input-text" placeholder="بحث" />
          <IconButton style={{ color: "var(--primary-color)" }}>
            <SearchIcon />
          </IconButton>
        </div>
      </div>
      <ItemGridView />
    </div>
  );
};

export default ItemPage;
