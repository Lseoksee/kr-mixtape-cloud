import { Component, ReactNode } from "react";
import { ReduxActions, reduxConnect } from "../Store/ConfingRedux";
import { ConnectedProps } from "react-redux";
import { BrowserCache } from "../Utils/BrowserCache";

type MusicStateProp = {} & ConnectedProps<typeof reduxConnect>;

// 음악상태 전역 관리용 컴포넌트
class MusicStateComponet extends Component<MusicStateProp, any> {
    reduxState = this.props.reduxResponce.musicPlayState;
    reduxStateRecv = this.reduxState.recv;
    currIndex =  this.reduxState.startIndex;
    currItem = this.reduxState.queue[this.currIndex] || undefined;
    audioRef?: HTMLAudioElement;

    /** redex로 뮤직 플레이어 컴포넌트에 데이터 보내는 함수들 */
    redexSender = {
        /** 재생시간 정보 보내기 */
        sendDuration(thisObject: MusicStateComponet, duration: number) {
            const musicSetDuration = ReduxActions.sendDuration({ duration: duration });
            thisObject.props.dispatch(musicSetDuration);
        },

        /** 현재 진행중인 시간정보 보내기 */
        sendProgress(thisObject: MusicStateComponet, currentTime: number) {
            const musicSetNowProgress = ReduxActions.sendProgress({
                progress: currentTime,
            });
            thisObject.props.dispatch(musicSetNowProgress);
        },
    };

    shouldComponentUpdate(nextProps: Readonly<MusicStateProp>, nextState: Readonly<any>, nextContext: any): boolean {        
        const before = this.props.reduxResponce.musicPlayState;
        const next = nextProps.reduxResponce.musicPlayState;
        if (before.queue[before.startIndex] === next.queue[next.startIndex]) {
            return false;
        }

        return true;
    }

    componentDidMount(): void {
        if (!this.audioRef) {
            return;
        }
        this.audioRef.volume = BrowserCache.getVolume();

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

    componentDidUpdate(prevProps: Readonly<MusicStateProp>, prevState: Readonly<any>, snapshot?: any): void {
        if (!this.currItem || !this.audioRef) {
            return;
        }
        this.audioRef.load();

        // 크롬에 미디어 정보 날리기
        navigator.mediaSession.metadata = new MediaMetadata({
            album: this.currItem.albumName,
            artist: this.currItem.musicMeta.artist!!,
            title: this.currItem.musicMeta.title!!,
            artwork: [{ src: this.currItem.albumArtUrl }],
        });
    }

    render(): ReactNode {
        // 변수들 갱신 
        this.reduxState = this.props.reduxResponce.musicPlayState;
        this.reduxStateRecv = this.reduxState.recv;
        this.currIndex =  this.reduxState.startIndex;
        this.currItem = this.reduxState.queue[this.currIndex] || undefined;

        return (
            <audio
                ref={(target) => {
                    this.audioRef = target!!;
                }}
                autoPlay
                onVolumeChange={(e) => {
                    // 볼륨 바뀔때 마다 localstorge에 저장
                    BrowserCache.saveVolume(e.currentTarget.volume);
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
                    this.redexSender.sendDuration(this, e.currentTarget.duration);
                }}
                onTimeUpdate={(e) => {
                    // 약 0.5초 마다 갱신
                    this.redexSender.sendProgress(this, e.currentTarget.currentTime);
                }}
            >
                <source src={this.currItem?.url}></source>
            </audio>
        );
    }
}

// 클래스 컴포넌트에서 redux 재어를 위한
export default reduxConnect(MusicStateComponet);
