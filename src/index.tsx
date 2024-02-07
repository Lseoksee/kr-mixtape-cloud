import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Buffer } from "buffer";
import "./index.css";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { mainReducer } from "./Contexts/ConfingRedux";
import MusicPlayerComponet from "./Components/MusicPlayerComponet";
import ContextStore, { ContextType } from "./Contexts/ConfingContext";
import SearchSideBarComponet from "./Components/SearchSideBarComponet";
import ListSideBarComponet from "./Components/ListSideBarComponet";
import { BrowserRouter, Route, Routes, useNavigate, useParams } from "react-router-dom";
import App from "./Pages/App";
import ArtistPage from "./Pages/ArtistPage";
import constants from "./constants";

window.process = require("process");
window.Buffer = Buffer;

// Context 지원을 위한
function AppComp(): JSX.Element {
    const [state, setState] = useState<{
        musicInfo?: AlbumCompType.loadMusicInfo;
    }>();

    const Provider: ContextType = {
        setMusicState(albumInfo) {
            setState((ref) => ({ ...ref, musicInfo: albumInfo }));
        },
    };

    // Class 컴포넌트 Props RouterHook 전달
    const router: RouterType.RouterHook = {
        navigate: useNavigate(),
        params: useParams()
    }

    return (
        <ContextStore.Provider value={Provider}>
            <SearchSideBarComponet router={router} />
            <RoutePage />
            <ListSideBarComponet />
            <MusicPlayerComponet musicInfo={state?.musicInfo} />
        </ContextStore.Provider>
    );
}

// 라우팅 페이지 관리
function RoutePage(): JSX.Element {
    return (
        <Routes>
            <Route path={constants.MAIN_PAGE} element={<App />} />
            <Route path={`${constants.ARTIST_PAGE}/:artistName`} element={<ArtistPage />} />
        </Routes>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <Provider store={configureStore({ reducer: mainReducer })}>
        <BrowserRouter>
            <AppComp />
        </BrowserRouter>
    </Provider>
);
