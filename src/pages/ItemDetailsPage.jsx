import React from "react";
import { useParams } from "react-router-dom";

import { Button, TextField, Autocomplete } from "@mui/material";
import { Row, Col } from "react-bootstrap";

const top100Films = [
  { label: "The Shawshank Redemption", year: 1994 },
  { label: "The Godfather", year: 1972 },
  { label: "The Godfather: Part II", year: 1974 },
  { label: "The Dark Knight", year: 2008 },
  { label: "12 Angry Men", year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: "Pulp Fiction", year: 1994 },
  {
    label: "The Lord of the Rings: The Return of the King",
    year: 2003,
  },
  { label: "The Good, the Bad and the Ugly", year: 1966 },
  { label: "Fight Club", year: 1999 },
  {
    label: "The Lord of the Rings: The Fellowship of the Ring",
    year: 2001,
  },
];

const ItemDetailsPage = () => {
  const { id } = useParams();

  return (
    <div className="item-details-page">
      <form className="item-details-container">
        <Row style={{ margin: "10px auto" }}>
          <Col
            sm={12}
            md={6}
            style={{ margin: "10px auto", textAlign: "center" }}
          >
            <Autocomplete
              disablePortal
              fullWidth
              id="combo-box-demo"
              options={top100Films}
              renderInput={(params) => (
                <TextField fullWidth {...params} label="التصنيف" />
              )}
            />
          </Col>
          <Col
            sm={12}
            md={6}
            style={{ margin: "10px auto", textAlign: "center" }}
          >
            <Autocomplete
              disablePortal
              fullWidth
              id="combo-box-demo"
              options={top100Films}
              renderInput={(params) => (
                <TextField fullWidth {...params} label="البند" />
              )}
            />
          </Col>
          <Col
            sm={12}
            md={6}
            style={{ margin: "10px auto", textAlign: "center" }}
          >
            <TextField fullWidth autoComplete="off" label="اسم الصنف" />
          </Col>
          <Col
            sm={12}
            md={6}
            style={{ margin: "10px auto", textAlign: "center" }}
          >
            <TextField fullWidth autoComplete="off" label="رقم الصنف" />
          </Col>
          <Col
            sm={12}
            md={6}
            style={{ margin: "10px auto", textAlign: "center" }}
          >
            <TextField fullWidth autoComplete="off" label="كود الصنف" />
          </Col>
          <Col
            sm={12}
            md={6}
            style={{ margin: "10px auto", textAlign: "center" }}
          >
            <TextField fullWidth autoComplete="off" label="الباركود" />
          </Col>
          <Col
            sm={12}
            md={6}
            style={{ margin: "10px 0", textAlign: "center", width: "100%" }}
          >
            <TextField fullWidth autoComplete="off" label="الوصف" />
          </Col>
        </Row>
        <Row style={{ margin: "60px auto 10px auto" }}>
          <Col
            sm={12}
            md={6}
            style={{ margin: "10px auto", textAlign: "center" }}
          >
            {id ? (
              <Button
                variant="contained"
                className="primary-btn"
                style={{
                  width: "80%",
                  height: "50px",
                  maxWidth: "400px",
                  margin: "auto",
                }}
              >
                حفظ
              </Button>
            ) : (
              <Button
                variant="contained"
                className="primary-btn"
                style={{
                  width: "80%",
                  height: "50px",
                  maxWidth: "400px",
                  margin: "auto",
                }}
              >
                إضافة
              </Button>
            )}
          </Col>
          <Col
            sm={12}
            md={6}
            style={{ margin: "10px auto", textAlign: "center" }}
          >
            <Button
              variant="contained"
              className="secondary-btn"
              style={{
                width: "80%",
                height: "50px",
                maxWidth: "400px",
                margin: "auto",
              }}
            >
              رجوع
            </Button>
          </Col>
        </Row>
      </form>
    </div>
  );
};

export default ItemDetailsPage;
