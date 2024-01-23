import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Pages/App";
import { Buffer } from "buffer";
import "./index.css";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { AlbumCache, SongCache } from "./Utils/BrowserCache";

window.process = require("process");
window.Buffer = Buffer;

// Redux 비동기 보호 데이터(state 가 직접 수정이 안되므로 이렇게 관리)
const AsyncSafeData: {
    LoadAlbum: AlbumCompType.album[];
    LoadSong: AlbumCompType.songCache[];
} = { LoadAlbum: [], LoadSong: [] };

// Redux 처리함수
function Reducer(state: ReduxType.state = {}, action: ReduxType.action): ReduxType.state {
    console.log(action);
    switch (action.type) {
        // 앨범 케싱준비
        case "AlbumConunt":
            return { ...state, AlbumConunt: action.payload.AlbumConunt };

        // 모든 앨범이 로드됬다는 신호를 받으면 케싱하기
        case "LoadAlbum":
            AsyncSafeData.LoadAlbum.push(action.payload.LoadAlbum!!);

            if (state.AlbumConunt === AsyncSafeData.LoadAlbum.length) {
                AlbumCache.applyCache(AsyncSafeData.LoadAlbum);
                AsyncSafeData.LoadAlbum = [];
            }
            break;

        // 모든 앨범이 로드됬다는 신호를 받으면 케싱하기
        case "LoadSong":
            AsyncSafeData.LoadSong.push(action.payload.LoadSong!!);

            if (state.AlbumConunt === AsyncSafeData.LoadSong.length) {
                SongCache.applyCache(AsyncSafeData.LoadSong);
                AsyncSafeData.LoadAlbum = [];
            }
            break;
    }

    return state;
}

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <Provider store={configureStore({ reducer: Reducer })}>
        <App />
    </Provider>
);
