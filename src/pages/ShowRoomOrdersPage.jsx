import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { Box, IconButton, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CustomDatePicker from "../components/CustomDatePicker";

// icons
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";

import { changeStoreOrderSearchType } from "../redux/actions/orderActions";
import { getShowRoomOrders } from "../redux/actions/orderActions";

const columns = [
  {
    field: "orderNumber",
    headerName: "رقم الطلب",
    width: 150,
  },
  {
    field: "date",
    headerName: "التاريخ",
    width: 200,
  },
  {
    field: "code",
    headerName: "الكود",
    width: 200,
  },
  {
    field: "item",
    headerName: "الصنف",
    width: 300,
  },
  {
    field: "quantity",
    headerName: "الكمية",
    width: 150,
  },
  {
    field: "price",
    headerName: "السعر",
    width: 150,
  },
  {
    field: "total",
    headerName: "الإجمالي",
    width: 200,
  },
];

const ShowRoomOrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loginInfo } = useSelector((state) => state.userLogin);
  const { loadingStoreOrders, storeOrders, totalRecords } = useSelector(
    (state) => state.storeOrders
  );

  // const { dateFrom, dateTo } = useSelector(
  //   (state) => state.storeOrdersSearchDate
  // );

  const [rows, setRows] = useState([]);
  // const [localDateFrom, setLocalDateFrom] = useState(dateFrom);
  // const [localDateTo, setLocalDateTo] = useState(dateTo);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 50,
    rowCount: totalRecords,
  });
  const [isDateSearching, setIsDateSearching] = useState(false);

  // const handleSearch = () => {
  //   setIsDateSearching(true);
  //   dispatch(changeOrderSearchType("date"));
  //   dispatch(getOrdersByDate(loginInfo.BranchID, localDateFrom, localDateTo));
  // };

  const handlePaginationChange = (e) => {
    if (isDateSearching) return;
    const page = e.page;
    dispatch(getShowRoomOrders(loginInfo.BranchID));

    setPagination(e);
  };

  useEffect(() => {
    storeOrders
      ? setRows(
          storeOrders.map((row, index) => {
            return {
              id: ++index,
              orderNumber: row.OrderNum,
              date: new Date(row.IDate.date).toLocaleDateString("en-GB"),
              code: row.Code,
              item: row.Name,
              quantity: row.outcome,
              price: row.Pric,
              total: row.outcome * row.Pric,
            };
          })
        )
      : setRows([]);
  }, [storeOrders]);

  useEffect(() => {
    changeStoreOrderSearchType("show-room");
    !isDateSearching && handlePaginationChange(pagination);

    return () => {
      changeStoreOrderSearchType("all");
    };
  }, []);

  return (
    <div className="orders-page">
      {/* <Row className="orders-page-tool-bar">
        <Col sm={12} md={4}>
          <div className="orders-tool-bar-buttons-container">
            <IconButton
              style={{ color: "var(--secondary-color)" }}
              onClick={() => navigate("/store-order-details")}
            >
              <AddCircleIcon />
            </IconButton>
            <IconButton
              style={{ color: "var(--secondary-color)" }}
              onClick={handleSearch}
            >
              <SearchIcon />
            </IconButton>
          </div>
        </Col>

        <Col sm={12} md={8}>
          <Row>
            <Col>
              <div
                className="orders-tool-bar-buttons-container"
                style={{ flexWrap: "wrap" }}
              >
                <div className="orders-tool-bar-dtp-container">
                  <CustomDatePicker
                    label={"من"}
                    value={localDateFrom}
                    setValue={setLocalDateFrom}
                  />
                  <CustomDatePicker
                    label={"إلى"}
                    value={localDateTo}
                    setValue={setLocalDateTo}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row> */}
      {loadingStoreOrders ? (
        <CircularProgress style={{ margin: "auto" }} />
      ) : (
        <Box sx={{ width: "100%", height: "650px", marginTop: "30px" }}>
          <DataGrid
            style={{ backgroundColor: "var(--background-color)" }}
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: !isDateSearching
                  ? pagination
                  : { pageSize: 50 },
              },
            }}
            paginationMode={!isDateSearching ? "server" : "client"}
            onPaginationModelChange={
              !isDateSearching ? handlePaginationChange : () => {}
            }
            pageSizeOptions={[50]}
            disableRowSelectionOnClick
            rowCount={totalRecords}
          />
        </Box>
      )}
    </div>
  );
};

export default ShowRoomOrdersPage;
