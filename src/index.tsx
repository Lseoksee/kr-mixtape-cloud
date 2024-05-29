import ReactDOM from "react-dom/client";
import { Buffer } from "buffer";
import "./index.css";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { mainReducer } from "./Store/ConfingRedux";
import MusicStateComponet from "./Components/MusicStateComponet";
import SearchSideBarComponet from "./Components/SearchSideBarComponet";
import ListSideBarComponet from "./Components/ListSideBarComponet";
import { Outlet, RouterProvider, createBrowserRouter, useLoaderData, useLocation, useNavigate, useParams } from "react-router-dom";
import App from "./Pages/App";
import ArtistPage from "./Pages/ArtistPage";
import constants from "./constants";
import ErrorPage from "./Pages/ErrorPage";
import AWSUtiil from "./Utils/AWSUtill";
import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import MainPlayerComponet from "./Components/MainPlayerComponet";
import { MUITheme } from "./Style/StyleComponents/MUICustum";
import { BrowserCache } from "./Utils/BrowserCache";

window.process = require("process");
window.Buffer = Buffer;

/* 라우팅 설정 */
const RoutePage = createBrowserRouter(
    [
        {
            path: "/",
            element: <GlobalPage />,
            loader: async () => {
                /* S3 접근 토큰 발급하기 (페이지 접속시에만 작동) */
                const now = new Date();
                const tempCredentials = BrowserCache.getCredentials();

                if (!tempCredentials || now.getTime() > tempCredentials.exp) {
                    return AWSUtiil.getCredentials();
                } else {
                    return tempCredentials;
                }
            },
            children: [
                {
                    index: true /* 맨 첫번째 패이지로 지정 */,
                    element: <App />,
                },
                {
                    path: `${constants.ARTIST_PAGE}/:artistName`,
                    element: <ArtistPage />,
                    loader: async ({ params }) => {
                        //페이지 로딩시 앨범 리스트 얻기
                        const ctor = await AWSUtiil.getAWSUtiil();
                        return ctor.getFilelist(params.artistName!!);
                    },
                    errorElement: <ErrorPage />,
                },
            ],
        },
    ],
    { basename: process.env.PUBLIC_URL }
);

/* 전역컴포넌트와 같이가는 */
function GlobalPage() {
    //클래스 컴포넌트 라우팅 훅 사용
    const router: RouterType.RouterHook = {
        navigate: useNavigate(),
        params: useParams(),
        location: useLocation(),
    };

    const loder = useLoaderData() as ConstValType.credentials;
    const now = new Date();
    const outTime = loder.exp - now.getTime();
    console.log(outTime);
    
    
    // 만료 되기 1분전 갱신 요청
    setInterval(() => {
        AWSUtiil.getCredentials();
    }, outTime)

    return (
        <>
            <SearchSideBarComponet router={router} />
            <Outlet /> {/* 여기에 각각 라우팅 페이지 컴포넌트가 랜더링  */}
            <ListSideBarComponet />
            <MusicStateComponet />
            <MainPlayerComponet />
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <StyledEngineProvider injectFirst>
        <ThemeProvider theme={MUITheme.defaultTheme}>
            <Provider store={configureStore({ reducer: mainReducer })}>
                <RouterProvider router={RoutePage} />
            </Provider>
        </ThemeProvider>
    </StyledEngineProvider>
);
