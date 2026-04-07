import React, { useEffect, useState } from "react";
import { Slide } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Container } from "react-bootstrap";
import Nav from "../components/Nav";
import NavDrawer from "../components/NavDrawer";
// import Footer from "../components/Footer";
import AlertMessage from "../components/AlertMessage";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import { useRouteLoaderData } from "react-router-dom";

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const MainContainer = ({ children }) => {
  const [onlineAlert, setOnlineAlert] = useState("");

  const handleClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOnlineAlert("");
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleOnline = () =>
      navigator.onLine === true
        ? setOnlineAlert("تم إستعادة الإتصال بالإنترنت")
        : setOnlineAlert("أنت غير متصل بالإنترنت");
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOnline);
    };
  }, []);

  return (
    <>
      <Nav open={drawerOpen} setOpen={setDrawerOpen} />
      <NavDrawer open={drawerOpen} setOpen={setDrawerOpen} />
      <Container fluid className="main-container">
        <AlertMessage />
        {children}
      </Container>
      {/* <Footer /> */}
      <Snackbar
        open={onlineAlert ? true : false}
        autoHideDuration={navigator.onLine ? 6000 : 9999999999}
        onClose={handleClose}
        message={onlineAlert}
        action={navigator.onLine && action}
        TransitionComponent={SlideTransition}
      />
    </>
  );
};

export default MainContainer;
