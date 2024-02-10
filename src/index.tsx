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
import { Outlet, RouterProvider, createBrowserRouter, useNavigate, useParams } from "react-router-dom";
import App from "./Pages/App";
import ArtistPage from "./Pages/ArtistPage";
import constants from "./constants";
import ErrorPage from "./Pages/ErrorPage";

window.process = require("process");
window.Buffer = Buffer;

/* 라우팅 설정 */
const RoutePage = createBrowserRouter([
    {
        path: "/",
        element: <GlobalPage />,
        children: [
            {
                index: true /* 맨 첫번째 패이지로 지정 */,
                element: <App />,
            },
            {
                path: `${constants.ARTIST_PAGE}/:artistName`,
                element: <ArtistPage />,
                errorElement: <ErrorPage />,
            },
        ],
    },
]);

/* 전역컴포넌트와 같이가는 */
function GlobalPage() {

    //클래스 컴포넌트 라우팅 훅 사용
    const router: RouterType.RouterHook = {
        navigate: useNavigate(),
        params: useParams(),
    };

    return (
        <>
            <SearchSideBarComponet router={router} />
            <Outlet /> {/* 여기에 각각 라우팅 페이지 컴포넌트가 랜더링  */}
            <ListSideBarComponet />
            <MusicPlayerComponet />
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <Provider store={configureStore({ reducer: mainReducer })}>
        <RouterProvider router={RoutePage} />
    </Provider>
);
