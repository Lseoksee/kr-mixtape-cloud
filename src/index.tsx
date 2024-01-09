import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Pages/App";
import { Buffer } from "buffer";
import "./index.css";

window.process = require("process");
window.Buffer = Buffer;

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(<App />);
