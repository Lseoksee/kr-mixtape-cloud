import { Component, ReactNode } from "react";
import "../Style/MusicPlayerComponet.css";
import { reduxConnect } from "../Contexts/ConfingRedux";
import { ConnectedProps } from "react-redux";

type MusicPlayerProp = {
    musicInfo?: AlbumCompType.loadMusicInfo;
};

class MusicPlayerComponet extends Component<MusicPlayerProp & ConnectedProps<typeof reduxConnect>, any> {
    render(): ReactNode {
        return (
            <div className="musicPlayerDiv">
                <audio
                    controls
                    className="musicPlayer"
                    ref={(target) => {
                        if (this.props.musicInfo?.url) {
                            target?.load();
                        }

                        // 크롬에 미디어 정보 날리기
                        navigator.mediaSession.metadata = new MediaMetadata({
                            album: this.props.musicInfo?.albumName,
                            artist: this.props.musicInfo?.musicMeta.artist,
                            title: this.props.musicInfo?.musicMeta.title!!,
                        });
                    }}
                    autoPlay
                >
                    <source src={this.props.musicInfo?.url}></source>
                </audio>
            </div>
        );
    }
}

// 클래스 컴포넌트에서 redux 재어를 위한
const useClassRedux = reduxConnect(MusicPlayerComponet);

export default useClassRedux;
