import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Autocomplete, TextField, Fab, CircularProgress } from "@mui/material";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import SearchIcon from "@mui/icons-material/Search";
import { getItemMove, getItems } from "../redux/actions/itemActions";

const columns = [
  {
    field: "docNumber",
    headerName: "رقم المستند",
    width: 150,
  },
  {
    field: "date",
    headerName: "التاريخ",
    width: 200,
  },
  {
    field: "description",
    headerName: "البيان",
    type: "text",
    width: 400,
  },
  {
    field: "income",
    headerName: "الوارد",
    width: 200,
  },
  {
    field: "outcome",
    headerName: "الصادر",
    type: "number",
    width: 200,
    editable: true,
  },
  {
    field: "balance",
    headerName: "الرصيد",
    type: "number",
    width: 200,
    editable: true,
  },
];

const ItemMovePage = () => {
  const dispatch = useDispatch();

  const { loginInfo } = useSelector((state) => state.userLogin);
  const { loadingItems, items } = useSelector((state) => state.items);
  const { loadingItemMove, itemMove } = useSelector((state) => state.itemMove);

  const [rows, setRows] = useState([]);
  const [item, setItem] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(getItemMove(loginInfo.BranchID, item.ID));
  };

  useEffect(() => {
    setRows(
      itemMove.map((i, index) => {
        return {
          id: ++index,
          docNumber: i.InfoNo,
          description: i.Byan,
          date: new Date(i.IDate.date).toLocaleDateString("en-GB"),
          income: i.income,
          outcome: i.outcome,
          balance: i.cumulative_balance,
        };
      })
    );
  }, [itemMove]);

  useEffect(() => {
    dispatch(getItems(loginInfo.BranchID));
  }, []);

  return (
    <div className="item-move-page">
      {loadingItems ? (
        <CircularProgress style={{ margin: "auto" }} />
      ) : (
        <>
          <form onSubmit={handleSubmit} className="item-move-page-top-bar">
            <Autocomplete
              disablePortal
              style={{ flexGrow: "1" }}
              options={items}
              getOptionLabel={(option) => option.Name}
              value={item}
              onChange={(e, newValue) => setItem(newValue)}
              renderInput={(params) => (
                <TextField required fullWidth {...params} label="الصنف" />
              )}
            />
            <Fab
              variant="contained"
              type="submit"
              style={{
                zIndex: "0",
                backgroundColor: "var(--primary-color)",
                color: "#fff",
              }}
            >
              <SearchIcon />
            </Fab>
          </form>
          {loadingItemMove ? (
            <CircularProgress style={{ margin: "auto" }} />
          ) : (
            <>
              <Box className="settlements-grid">
                <DataGrid
                  style={{ backgroundColor: "var(--background-color)" }}
                  rows={rows}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 50,
                      },
                    },
                  }}
                  pageSizeOptions={[50]}
                  disableRowSelectionOnClick
                />
              </Box>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ItemMovePage;
