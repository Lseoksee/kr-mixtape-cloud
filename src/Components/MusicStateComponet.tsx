import { Component, ReactNode } from "react";
import { ReduxActions, reduxConnect } from "../Store/ConfingRedux";
import { ConnectedProps } from "react-redux";
import { BrowserCache } from "../Utils/BrowserCache";

type MusicStateProp = {} & ConnectedProps<typeof reduxConnect>;

// 음악상태 전역 관리용 컴포넌트
class MusicStateComponet extends Component<MusicStateProp, any> {
    currItem?: AlbumCompType.loadMusicInfo;
    currIndex: number = -1;
    audioRef?: HTMLAudioElement;

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
        const musicPlayState = this.props.reduxResponce.musicPlayState;
        this.currIndex = musicPlayState.startIndex;
        this.currItem = musicPlayState.queue[this.currIndex];

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
                    if (this.currIndex + 1 === musicPlayState.queue.length) {
                        //막곡인 경우 중단
                        return;
                    }

                    const selectIndexMusic = ReduxActions.selectIndexMusic({ index: this.currIndex + 1 });
                    this.props.dispatch(selectIndexMusic);
                }}
            >
                <source src={this.currItem?.url}></source>
            </audio>
        );
    }
}

// 클래스 컴포넌트에서 redux 재어를 위한
export default reduxConnect(MusicStateComponet);