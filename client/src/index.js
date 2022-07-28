import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import CssBaseline from "@mui/material/CssBaseline";
import "@fontsource/roboto";
import "./styles/index.css";

const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: "50px",
  // you can also just use 'scale'
  transition: transitions.SCALE,
};

const Root = () => (
  <AlertProvider template={AlertTemplate} {...options}>
    <App />
  </AlertProvider>
);

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <CssBaseline />
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
