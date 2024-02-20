import { Component, ReactNode } from "react";
import { ReduxActions, reduxConnect } from "../Store/ConfingRedux";
import { ConnectedProps } from "react-redux";
import { BrowserCache } from "../Utils/BrowserCache";
import Utils from "../Utils/Utils";

type MusicStateProp = {} & ConnectedProps<typeof reduxConnect>;

// 음악상태 전역 관리용 컴포넌트
class MusicStateComponet extends Component<MusicStateProp, any> {
    reduxState = this.props.reduxResponce.musicPlayState;
    reduxStateRecv = this.reduxState.recv;
    currIndex = this.reduxState.startIndex;
    currItem = this.reduxState.queue[this.currIndex] || undefined;
    audioRef?: HTMLAudioElement;

    /** 뮤직플레이어 쪽에서 온 redux 데이터를 받는 함수 */
    private redexRecv(before: typeof this.reduxStateRecv, after: typeof this.reduxStateRecv) {
        const audio = this.audioRef!!;

        // 진행률 변화
        if (before.progress !== after.progress && after.progress !== -1) {
            audio.currentTime = (audio.duration * after.progress) / 100;
        }

        // 재생 변화
        if (before.isPlay !== after.isPlay && after.isPlay !== "") {
            if (after.isPlay === "play") audio.play();
            else audio.pause();
        }

        // 볼륨변화
        if (before.volume !== after.volume && after.volume !== -1) {
            audio.volume = after.volume;
        }
    }

    shouldComponentUpdate(nextProps: Readonly<MusicStateProp>, nextState: Readonly<any>, nextContext: any): boolean {
        const before = this.props.reduxResponce.musicPlayState;
        const next = nextProps.reduxResponce.musicPlayState;

        if (before.recv !== next.recv) {
            this.redexRecv(before.recv, next.recv);
            return false;
        }

        // send 데이터만 바뀐경우 갱신안함
        if (next.send !== before.send) {
            return false
        }

        return true;
    }

    componentDidUpdate(prevProps: Readonly<MusicStateProp>, prevState: Readonly<any>, snapshot?: any): void {
        if (!this.currItem || !this.audioRef) {
            return;
        }

        const before = prevProps.reduxResponce.musicPlayState;

        /** 음악 갱신시 */
        if (before.queue[before.startIndex] !== this.currItem) {
            this.audioRef.load();

            // 크롬에 미디어 정보 날리기
            navigator.mediaSession.metadata = new MediaMetadata({
                album: this.currItem.albumName,
                artist: this.currItem.musicMeta.artist!!,
                title: this.currItem.musicMeta.title!!,
                artwork: [{ src: this.currItem.albumArtUrl }],
            });
        }
    }

    componentDidMount(): void {
        if (!this.audioRef) {
            return;
        }
        this.audioRef.volume = this.reduxState.defaultVolume;

        /* Media Session API를 통한 미디어 컨트롤 */
        navigator.mediaSession.setActionHandler("nexttrack", () => {
            //다음곡
            const selectIndexMusic = ReduxActions.selectIndexMusic({ index: this.currIndex + 1 });
            this.props.dispatch(selectIndexMusic);
        });

        navigator.mediaSession.setActionHandler("previoustrack", () => {
            // 이전 곡
            const selectIndexMusic = ReduxActions.selectIndexMusic({ index: this.currIndex - 1 });
            this.props.dispatch(selectIndexMusic);
        });
    }

    render(): ReactNode {
        // 변수들 갱신
        this.reduxState = this.props.reduxResponce.musicPlayState;
        this.reduxStateRecv = this.reduxState.recv;
        this.currIndex = this.reduxState.startIndex;
        this.currItem = this.reduxState.queue[this.currIndex] || undefined;

        return (
            <audio
                ref={(target) => {
                    this.audioRef = target!!;
                }}
                autoPlay
                onVolumeChange={(e) => {
                    const sendVolume = ReduxActions.sendVolume({
                        value: Utils.VolumeToInt(e.currentTarget.volume),
                    });
                    this.props.dispatch(sendVolume);
                }}
                onEnded={() => {
                    //다음곡
                    if (this.currIndex + 1 === this.reduxState.queue.length) {
                        //막곡인 경우 중단
                        return;
                    }

                    const selectIndexMusic = ReduxActions.selectIndexMusic({ index: this.currIndex + 1 });
                    this.props.dispatch(selectIndexMusic);
                }}
                onDurationChange={(e) => {
                    const musicSetDuration = ReduxActions.sendDuration({ duration: e.currentTarget.duration });
                    this.props.dispatch(musicSetDuration);
                }}
                onTimeUpdate={(e) => {
                    // 약 0.5초 마다 갱신
                    const musicSetNowProgress = ReduxActions.sendProgress({
                        progress: e.currentTarget.currentTime,
                    });
                    this.props.dispatch(musicSetNowProgress);
                }}
                onPlay={() => {
                    const sendPlayState = ReduxActions.sendPlayState({
                        isPlay: "play",
                    });
                    this.props.dispatch(sendPlayState);
                }}
                onPause={() => {
                    const sendPlayState = ReduxActions.sendPlayState({
                        isPlay: "pause",
                    });
                    this.props.dispatch(sendPlayState);
                }}
            >
                <source src={this.currItem?.url}></source>
            </audio>
        );
    }
}

// 클래스 컴포넌트에서 redux 재어를 위한
export default reduxConnect(MusicStateComponet);
