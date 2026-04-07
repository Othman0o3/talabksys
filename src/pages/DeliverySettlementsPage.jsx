import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  getDeliverySettlements,
  getSettlements,
} from "../redux/actions/settlementsACtions";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    field: "docNumber",
    headerName: "رقم المستند",
    width: 200,
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
    width: 300,
  },
  {
    field: "amount",
    headerName: "المبلغ",
    width: 200,
  },
  {
    field: "paid",
    headerName: "المدفوع",
    width: 200,
  },
  {
    field: "balance",
    headerName: "الرصيد",
    width: 200,
  },
];

const DeliverySettlementsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loginInfo } = useSelector((state) => state.userLogin);
  const { loadingDeliverySettlements, deliverySettlements } = useSelector(
    (state) => state.deliverySettlements
  );

  const [rows, setRows] = useState([]);

  useEffect(() => {
    let lastRowTotal = 0;
    setRows(
      deliverySettlements.map((row, index) => {
        lastRowTotal = lastRowTotal + (row.Debit - row.Ciradet);
        return {
          id: row.ID,
          docNumber: row.DocNum,
          date: new Date(row.MDate.date).toLocaleDateString("en-GB"),
          description: row.Note,
          amount: parseFloat(row.Debit).toLocaleString("en-GB"),
          paid: parseFloat(row.Ciradet).toLocaleString("en-GB"),
          balance: parseFloat(lastRowTotal).toLocaleString("en-GB"),
        };
      })
    );
  }, [deliverySettlements]);

  useEffect(() => {
    dispatch(getDeliverySettlements(loginInfo.BranchID));
  }, []);

  return (
    <div className="settlements-page">
      {loadingDeliverySettlements ? (
        <CircularProgress style={{ margin: "auto" }} />
      ) : (
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
      )}
    </div>
  );
};

export default DeliverySettlementsPage;
