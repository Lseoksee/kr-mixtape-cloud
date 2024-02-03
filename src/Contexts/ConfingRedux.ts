import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AlbumCache, SongCache } from "../Utils/BrowserCache";
import { connect } from "react-redux";

// Redux 비동기 보호 데이터(state 가 직접 수정이 안되므로 이렇게 관리)
const AsyncSafeData: {
    LoadAlbum: AlbumCompType.album[];
    LoadSong: AlbumCompType.songCache[];
} = { LoadAlbum: [], LoadSong: [] };

/** Slice 를 이용한 Reducer 구현   */
const mainSlice = createSlice({
    name: "mainReducer",
    initialState: {
        AlbumConunt: 0,
    } as ReduxType.state,
    reducers: {
        /** 로드할 엘범 아트 개수를 Reducer에 알림 */
        setAlbumConunt(state, action: PayloadAction<{ AlbumConunt: number }>) {
            state.AlbumConunt = action.payload.AlbumConunt;
        },

        /** 앨범아트 로드를 Reducer에 알림 */
        albumArtLoadEvent(state, action: PayloadAction<{ LoadAlbum: AlbumCompType.album }>) {
            AsyncSafeData.LoadAlbum.push(action.payload.LoadAlbum!!);

            if (state.AlbumConunt === AsyncSafeData.LoadAlbum.length) {
                AlbumCache.applyCache(AsyncSafeData.LoadAlbum);
                AsyncSafeData.LoadAlbum = [];
            }
        },

        /** 곡 목록 로드를 Reducer에 알림 */
        SongLoadEvent(state, action: PayloadAction<{ LoadSong: AlbumCompType.songCache }>) {
            AsyncSafeData.LoadSong.push(action.payload.LoadSong!!);

            if (state.AlbumConunt === AsyncSafeData.LoadSong.length) {
                SongCache.applyCache(AsyncSafeData.LoadSong);
                AsyncSafeData.LoadSong = [];
            }
        },
    },
});

class ConfingRedux {
    /** 클래스 컴포넌트 Reducer 응답 및 요청
     * this.props.reduxResponce 로 state 값 받아볼 수 있고
     * this.props.this.props.dispatch(ReduxActions.요청할 함수) 이렇게 요청
     */
    static reduxConnect = connect((state: ReduxType.state) => ({
        reduxResponce: state,
    }));

    static ReduxActions = mainSlice.actions;

    static mainReducer = mainSlice.reducer;
}

export const { ReduxActions, mainReducer, reduxConnect } = ConfingRedux;
