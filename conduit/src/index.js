import React from "react";

import ReactDom from "react-dom";
import "./stylesheets/index.css";
import App from "./Components/App";
import { BrowserRouter } from "react-router-dom";

ReactDom.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  </React.StrictMode>,
  document.getElementById('root')
)