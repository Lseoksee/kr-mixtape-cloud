import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { connect } from "react-redux";
import { BrowserCache } from "../Utils/BrowserCache";
import Utils from "../Utils/Utils";

/** 메인 액션 (별일 없으면 여기다 둘듯) */
const MainActions = {
    /** 선택된 음악을 재생하고 이전 및 다음 대기열을 설정 합니다. */
    setStartMusic(
        state: ReduxType.state,
        action: PayloadAction<{ loadMusicInfo: AlbumCompType.loadMusicInfo[]; startIndex: number }>
    ) {
        state.musicPlayState.queue = action.payload.loadMusicInfo;
        state.musicPlayState.startIndex = action.payload.startIndex;
    },

    /** 해당 인덱스로 곡을 바꿉니다. */
    selectIndexMusic(state: ReduxType.state, action: PayloadAction<{ index: number }>) {
        if (action.payload.index <= 0) {
            // 만일 설정하려는 인덱스가 가장 처음 곡인경우
            state.musicPlayState.startIndex = 0;
            return;
        } else if (action.payload.index >= state.musicPlayState.queue.length) {
            // 만일 설정하려는 인덱스가 가장 끝 곡인 경우
            return;
        }

        state.musicPlayState.startIndex = action.payload.index;
    },
};

/** MusicStateComponet 쪽에서 보내는 액션 */
const MusicSendActions = {
    /** 현재 재생중인 음악에 길이를 보냅니다. */
    sendDuration(state: ReduxType.state, action: PayloadAction<{ duration: number }>) {
        state.musicPlayState.send.duration = action.payload.duration;
    },

    /** 현재 재생중인 음악에 길이를 보냅니다. */
    sendProgress(state: ReduxType.state, action: PayloadAction<{ progress: number }>) {
        if (state.musicPlayState.send.duration) {
            // 상태가 겹쳐서 업데이트가 안될 수도 있기 때문에 기본값으로 바꿈
            state.musicPlayState.recv.progress = -1;
            state.musicPlayState.send.nowProgress = action.payload.progress;
        }
    },

    /** 현재 재생 상태를 보냅니다. */
    sendPlayState(state: ReduxType.state, action: PayloadAction<{ isPlay: "play" | "pause" }>) {
        // 상태가 겹쳐서 업데이트가 안될 수도 있기 때문에 기본값으로 바꿈
        state.musicPlayState.recv.isPlay = "";
        state.musicPlayState.send.isPlay = action.payload.isPlay;
    },

    /** 현재 볼륨값을 보냅니다. */
    sendVolume(state: ReduxType.state, action: PayloadAction<{ value: number }>) {
        state.musicPlayState.send.volume = Utils.VolumeToformatt(action.payload.value);
    },
};

/** MusicStateComponet 쪽에서 받는 액션 */
const MusicRecvActions = {
    /** MusicStateComponet에 현재 재생시간 업데이트를 요청합니다. */
    reqUpdateProgress(state: ReduxType.state, action: PayloadAction<{ progress: number }>) {
        state.musicPlayState.recv.progress = action.payload.progress;
    },

    /** MusicStateComponet에 현재 재생상테 업데이트를 요청합니다.  */
    reqUpdatePlayState(state: ReduxType.state, action: PayloadAction<{ isPlay: "play" | "pause" }>) {
        state.musicPlayState.recv.isPlay = action.payload.isPlay;
    },

    /** MusicStateComponet에 오디오 볼륨 업데이트를 요청합니다.   */
    reqUpdateVolume(state: ReduxType.state, action: PayloadAction<{ value: number }>) {        
        state.musicPlayState.recv.volume = Utils.VolumeToformatt(action.payload.value);
    },
};

class ConfingRedux {
    /** Slice 를 이용한 Reducer 구현
     * 해당 reducers함수에서 state값이 변경되면 Provider 컴포넌트 내의 있는 모든 컴포넌트는 재갱신 한다
     */
    static mainSlice = createSlice({
        name: "mainReducer",
        initialState: {
            musicPlayState: {
                startIndex: -1,
                queue: [],
                defaultVolume: BrowserCache.getVolume(),
                send: {
                    isPlay: "",
                    duration: 0, //전체길이
                    nowProgress: 0, //현재 갱신 길이
                    volume: -1,
                },
                recv: {
                    isPlay: "",
                    progress: -1,
                    volume: -1,
                },
            },
            // 강제 re-render가 필요한 경우 해당 값을 업데이트 하자
            forceUpdate: 0.0,
        } as ReduxType.state,
        reducers: {
            ...MainActions,
            ...MusicSendActions,
            ...MusicRecvActions,
        },
    });

    /** 클래스 컴포넌트 Reducer 응답 및 요청
     * this.props.reduxResponce 로 state 값 받아볼 수 있고
     * this.props.this.props.dispatch(ReduxActions.요청할 함수) 이렇게 요청
     */
    static reduxConnect = connect((state: ReduxType.state) => ({
        reduxResponce: state,
    }));

    static ReduxActions = ConfingRedux.mainSlice.actions;

    static mainReducer = ConfingRedux.mainSlice.reducer;
}

export const { ReduxActions, mainReducer, reduxConnect } = ConfingRedux;
