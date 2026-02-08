import ReactDOM from "react-dom/client";
import { Buffer } from "buffer";
import Process from "process";
import "./index.css";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { mainReducer } from "./Store/ConfingRedux";
import MusicStateComponet from "./Components/MusicStateComponet";
import SearchSideBarComponet from "./Components/SearchSideBarComponet";
import ListSideBarComponet from "./Components/ListSideBarComponet";
import { Outlet, RouterProvider, createBrowserRouter, useLocation, useNavigate, useParams } from "react-router-dom";
import App from "./Pages/App";
import ArtistPage from "./Pages/ArtistPage";
import constants from "./constants";
import ErrorPage from "./Pages/ErrorPage";
import AWSUtiil from "./Utils/AWSUtill";
import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import MainPlayerComponet from "./Components/MainPlayerComponet";
import { MUITheme } from "./Style/StyleComponents/MUICustum";
import { BrowserCache } from "./Utils/BrowserCache";

window.process = Process;
window.Buffer = Buffer;

/* 라우팅 설정 */
const RoutePage = createBrowserRouter([
	{
		path: "/",
		element: <GlobalPage />,
		loader: async () => {
			// 스토리지 버전 유효성 검사
			BrowserCache.verifiedStorageVerson();

			/* S3 접근 토큰 발급하기 (페이지 접속시에만 작동) */
			const now = new Date();
			const tempCredentials = BrowserCache.getCredentials();

			if (!tempCredentials || now.getTime() > tempCredentials.exp) {
				const credentials = await AWSUtiil.getCredentials();
				AWSUtiil.setS3Client(credentials);
				AWSUtiil.autoRefreshS3(credentials);
				return credentials;
			} else {
				AWSUtiil.setS3Client(tempCredentials);
				AWSUtiil.autoRefreshS3(tempCredentials);
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
				errorElement: <ErrorPage />,
			},
		],
	},
], {basename: constants.BASE_NAME});

/* 전역컴포넌트와 같이가는 */
function GlobalPage() {
	//클래스 컴포넌트 라우팅 훅 사용
	const router: RouterType.RouterHook = {
		navigate: useNavigate(),
		params: useParams(),
		location: useLocation(),
	};

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
