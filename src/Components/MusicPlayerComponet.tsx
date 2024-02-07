import { Component, ReactNode } from "react";
import "../Style/MusicPlayerComponet.css";
import { reduxConnect } from "../Store/ConfingRedux";
import { ConnectedProps } from "react-redux";

type MusicPlayerProp = {

} & ConnectedProps<typeof reduxConnect>;


class MusicPlayerComponet extends Component<MusicPlayerProp, any> {

    currItem?: AlbumCompType.loadMusicInfo
    currIndex : number = -1;

    render(): ReactNode {
        const musicPlayState = this.props.reduxResponce.musicPlayState;
        this.currIndex = musicPlayState.startIndex;
        this.currItem = musicPlayState.queue[this.currIndex];

        return (
            <div className="musicPlayerDiv">
                <audio
                    controls
                    className="musicPlayer"
                    ref={(target) => {
                        if (!this.currItem) {
                            return;
                        }
                        target?.load();

                        // 크롬에 미디어 정보 날리기
                        navigator.mediaSession.metadata = new MediaMetadata({
                            album: this.currItem.albumName,
                            artist: this.currItem.musicMeta.artist!!,
                            title: this.currItem.musicMeta.title!!,
                            artwork: [{ src: this.currItem.albumArtUrl }],
                        });
                    }}
                    autoPlay
                >
                    <source src={this.currItem?.url}></source>
                </audio>
            </div>
        );
    }
}

// 클래스 컴포넌트에서 redux 재어를 위한
export default reduxConnect(MusicPlayerComponet);
