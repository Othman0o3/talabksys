import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ThemeProvider, createTheme, CssBaseline , StyledEngineProvider } from "@mui/material"; 
import talabkTheme from './theme';
import storeRoutes from "./routes/storeRoutes";
import deliveryRoutes from "./routes/deliveryRoutes";
import {marketerRoutes} from "./routes/marketerRoutes";
function App() {
  const { loginInfo } = useSelector((state) => state.userLogin);

const routes = loginInfo
  ? loginInfo.stats == 1 
    ? storeRoutes     
    : loginInfo.stats == 2
      ? deliveryRoutes 
      : loginInfo.stats == 4
        ? marketerRoutes 
        : storeRoutes   
  : storeRoutes;

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={talabkTheme}>
        <CssBaseline /> 
        <HashRouter>
          <Routes>
            {routes.map((route, index) => {
              if ((route.isPrivate === true) && (loginInfo === null))
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={<Navigate to={"/login"} />}
                  />
                );
              else if ((route.mustLogout === true) && (loginInfo !== null))
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={<Navigate to={"/"} />}
                  />
                );
              return (
                <Route key={index} path={route.path} element={route.element} />
              );
            })}
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
export default App;