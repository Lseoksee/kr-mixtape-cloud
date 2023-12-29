import React from "react";
import "./App.css";
import * as musicMetadata from "music-metadata-browser";
import { Buffer } from "buffer";
window.process = require("process");
window.Buffer = Buffer;

const mediaParms = "uc?export=download&id=1Y6IvAa_57y3i-184Nuf0h5NbZDyEQE6z";

const getMetadata = async () => {
    const metadata = await musicMetadata.fetchFromUrl(`media/${mediaParms}`);

    console.log(metadata.common);
};

function App() {
    getMetadata();
    return <h1>하이</h1>;
}

export default App;
