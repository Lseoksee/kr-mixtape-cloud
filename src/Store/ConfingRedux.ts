import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { connect } from "react-redux";

/** Slice 를 이용한 Reducer 구현
 * 해당 reducers함수에서 state값이 변경되면 Provider 컴포넌트 내의 있는 모든 컴포넌트는 재갱신 한다
 */
const mainSlice = createSlice({
    name: "mainReducer",
    initialState: {
        musicPlayState: {
            startIndex: -1,
            queue: [],
        },
    } as ReduxType.state,
    reducers: {
        /** 선택된 음악을 재생하고 이전 및 다음 대기열을 설정 합니다. */
        setStartMusic(
            state,
            action: PayloadAction<{ loadMusicInfo: AlbumCompType.loadMusicInfo[]; startIndex: number }>
        ) {
            state.musicPlayState.queue = action.payload.loadMusicInfo;
            state.musicPlayState.startIndex = action.payload.startIndex;
        },

        selectIndexMusic(state, action: PayloadAction<{Index: number }>) {
            state.musicPlayState.startIndex = action.payload.Index;
        }
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
