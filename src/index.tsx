import React from "react";
import ReactDOM from "react-dom/client";
import { Buffer } from "buffer";
import "./index.css";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { mainReducer } from "./Store/ConfingRedux";
import MusicPlayerComponet from "./Components/MusicPlayerComponet";
import SearchSideBarComponet from "./Components/SearchSideBarComponet";
import ListSideBarComponet from "./Components/ListSideBarComponet";
import { BrowserRouter, Route, Routes, useNavigate, useParams } from "react-router-dom";
import App from "./Pages/App";
import ArtistPage from "./Pages/ArtistPage";
import constants from "./constants";

window.process = require("process");
window.Buffer = Buffer;

// 라우팅 페이지 관리
function RoutePage(): JSX.Element {
    return (
        <Routes>
            <Route path={constants.MAIN_PAGE} element={<App />} />
            <Route path={`${constants.ARTIST_PAGE}/:artistName`} element={<ArtistPage />} />
        </Routes>
    );
}

// 모든 컴포넌트 모음
function AppComp(): JSX.Element {
    // Class 컴포넌트 Props RouterHook 전달
    const router: RouterType.RouterHook = {
        navigate: useNavigate(),
        params: useParams(),
    };

    return (
        <Provider store={configureStore({ reducer: mainReducer })}>
            <SearchSideBarComponet router={router} />
            <RoutePage />
            <ListSideBarComponet />
            <MusicPlayerComponet />
        </Provider>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <BrowserRouter>
        <AppComp />
    </BrowserRouter>
);
