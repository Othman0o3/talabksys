import React from "react";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import RTL from "./RTL"; // Import the RTL component we created earlier
import "./fonts.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme"; // Import the custom theme
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import "./bootstrap.min.css";
// import "./components/chart.min.js";
import App from "./App";
import store from "./redux/store";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <RTL>
        <App />
      </RTL>
    </Provider>
  </ThemeProvider>
);

serviceWorkerRegistration.register();
