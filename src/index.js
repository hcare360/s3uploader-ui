import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import "@cloudscape-design/global-styles/index.css";
import App from "./App";

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById("root")
);
