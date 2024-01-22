import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Pages/App";
import { Buffer } from "buffer";
import "./index.css";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { AlbumCache } from "./Utils/BrowserCache";

window.process = require("process");
window.Buffer = Buffer;

// Redux 처리함수
function Reducer(state: ReduxType.state = {}, action: ReduxType.action): ReduxType.state {
    console.log(action);
    switch (action.type) {
        // 앨범 케싱준비
        case "AlbumConunt":
            return {...state, AlbumConunt: action.data.AlbumConunt};
        // 모든 앨범이 로드됬다는 신호를 받으면 케싱하기
        case "LoadAlbum":
            let copyArr = state.loadAlbum || [];
            copyArr = [...copyArr, action.data.LoadAlbum!!]; 
            
            if (state.AlbumConunt === copyArr.length) {
                AlbumCache.applyCache(copyArr);
            }

            return {...state, loadAlbum: copyArr }
    }
}

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <Provider store={configureStore({ reducer: Reducer })}>
        <App />
    </Provider>
);
