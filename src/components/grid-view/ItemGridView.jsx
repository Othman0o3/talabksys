import React from "react";

import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  {
    field: "number",
    headerName: "الرقم",
    width: 150,
    editable: false,
  },
  {
    field: "name",
    headerName: "الإسم",
    width: 100,
    editable: false,
  },
  {
    field: "price",
    headerName: "السعر",
    width: 100,
    editable: false,
  },
  {
    field: "code",
    headerName: "الكود",
    type: "text",
    width: 210,
    editable: false,
  },
  {
    field: "category",
    headerName: "التصنيف",
    width: 160,
  },
  {
    field: "type",
    headerName: "البند",
    type: "number",
    width: 110,
    editable: false,
  },
  {
    field: "description",
    headerName: "الوصف",
    type: "number",
    width: 200,
    editable: false,
  },
];
const rows = [
  {
    id: 1,
    number: 5826,
    name: "Chain BRAC rs",
    price: 20.0,
    code: 96339,
    category: "المقاس",
    type: "XS",
    description: "سلسة تعليقة Naruto",
  },
];

const ItemGridView = () => {
  return (
    <Box className="settlements-grid">
      <DataGrid
        style={{ backgroundColor: "var(--background-color)" }}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default ItemGridView;
