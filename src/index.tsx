import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { initWsConnection } from "./utils";

// stupidly retry until we get the connection
function initApp() {
  initWsConnection()
    .then((api) => {
      console.log("Got WS connection");
      ReactDOM.render(
        <React.StrictMode>
          <App api={api} />
        </React.StrictMode>,
        document.getElementById("root")
      );
    })
    .catch((_) => {
      initApp();
    });
}

initApp();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
