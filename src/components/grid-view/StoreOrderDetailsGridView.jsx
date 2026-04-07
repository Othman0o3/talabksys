import React from "react";

import { Box, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";

const StoreOrderDetailsGridView = ({
  setRows,
  preventUpdate,
  id,
  rows = [],
}) => {
  const handleDeleteButtonClick = (row) => {
    // Delete row logic here
    setRows(rows.filter((r) => r.id !== row.id));
  };

  const renderDeleteButton = (params) => (
    <IconButton
      style={{ color: "var(--primary-color" }}
      onClick={() => handleDeleteButtonClick(params.row)}
      disabled={params.row.isDisabled} // Optional: Disable button based on row data
    >
      <DeleteIcon />
    </IconButton>
  );

  const columns = [
    {
      field: "itemNum",
      headerName: "الرقم",
      width: 200,
    },
    {
      field: "itemName",
      headerName: "الإسم",
      type: "text",
      width: 300,
    },
    {
      field: "price",
      headerName: "السعر",
      width: 200,
    },
    {
      field: "outcome",
      headerName: "الكمية",
      width: 200,
    },
    {
      field: "Total",
      headerName: "الإجمالي",
      width: 200,
    },
  ];
  // preventUpdate === false &&
  !id &&
    columns.push({
      field: "delete",
      headerName: "إلغاء",
      width: 100,
      renderCell: renderDeleteButton,
    });

  return (
    <Box className="settlements-grid">
      <DataGrid
        style={{ backgroundColor: "var(--background-color)" }}
        rows={rows}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default StoreOrderDetailsGridView;
