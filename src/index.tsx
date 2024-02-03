import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./Pages/App";
import { Buffer } from "buffer";
import "./index.css";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { mainReducer } from "./Contexts/ConfingRedux";
import MusicPlayerComponet from "./Components/MusicPlayerComponet";
import ContextStore, { ContextType } from "./Contexts/ConfingContext";

window.process = require("process");
window.Buffer = Buffer;

// Context 지원을 위한
function AppComp() {
    const [state, setState] = useState<{
        musicInfo?: AlbumCompType.loadMusicInfo;
    }>();

    return (
        <ContextStore.Provider value={{
            setMusicState(albumInfo) {
                setState(ref => ({...ref, musicInfo: albumInfo}));
            }
        } as ContextType }>
            <App />
            <MusicPlayerComponet musicInfo={state?.musicInfo} />
        </ContextStore.Provider>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <Provider store={configureStore({ reducer: mainReducer })}>
        <AppComp />
    </Provider>
);
