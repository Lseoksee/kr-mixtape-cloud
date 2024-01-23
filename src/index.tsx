import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Pages/App";
import { Buffer } from "buffer";
import "./index.css";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { mainReducer } from "./Utils/ConfingRedux";

window.process = require("process");
window.Buffer = Buffer;

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <Provider store={configureStore({ reducer: mainReducer })}>
        <App />
    </Provider>
);
