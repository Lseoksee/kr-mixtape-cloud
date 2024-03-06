import { Component, ReactNode } from "react";
import "../Style/MainPlayerComponet.css";
import { ReduxActions, reduxConnect } from "../Store/ConfingRedux";
import { ConnectedProps } from "react-redux";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import tempAlbumArt from "../Assets/tempAlbumArt.png";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import RepeatIcon from "@mui/icons-material/Repeat";
import RepeatOneIcon from "@mui/icons-material/RepeatOne";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import Utils from "../Utils/Utils";
import { BrowserCache } from "../Utils/BrowserCache";
import { ProgressBar, VolumeSlider } from "./StyleComponet";

type MainPlayerProp = {} & ConnectedProps<typeof reduxConnect>;

type MainPlayerState = {
    progressBarHover: {
        hover: boolean;
        value: number;
    };
};

class MainPlayerComponet extends Component<MainPlayerProp, MainPlayerState> {
    reduxState = this.props.reduxResponce.musicPlayState;
    reduxStateRecv = this.reduxState.send;
    currIndex = this.reduxState.startIndex;
    currItem = this.reduxState.queue[this.currIndex] || undefined;
    volume = this.reduxState.volume; // 볼륨값

    state: Readonly<MainPlayerState> = {
        progressBarHover: {
            hover: false,
            value: -1,
        },
    };

    // 플레어어 제어 아이콘 클릭 이벤트 처리
    playerIconClickEvent = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        let action: any;

        if (e.currentTarget.id === "play") {
            // 재생버튼
            action = ReduxActions.reqUpdatePlayState({ isPlay: "play" });
        } else if (e.currentTarget.id === "pause") {
            // 일시정지 버튼
            action = ReduxActions.reqUpdatePlayState({ isPlay: "pause" });
        } else if (e.currentTarget.id === "prev") {
            // 이전곡 버튼
            action = ReduxActions.selectIndexMusic({ index: this.currIndex - 1 });
        } else if (e.currentTarget.id === "next") {
            // 다음곡 버튼
            action = ReduxActions.selectIndexMusic({ index: this.currIndex + 1 });
        }

        this.props.dispatch(action);
    };

    shouldComponentUpdate(nextProps: Readonly<MainPlayerProp>, nextState: Readonly<any>, nextContext: any): boolean {
        const before = this.props.reduxResponce.musicPlayState;
        const next = nextProps.reduxResponce.musicPlayState;

        // recv 데이터만 바뀐경우 갱신안함
        if (before.recv !== next.recv && before.send === next.send) return false;

        return true;
    }

    render(): ReactNode {
        // 변수들 갱신
        this.reduxState = this.props.reduxResponce.musicPlayState;
        this.reduxStateRecv = this.reduxState.send;
        this.currIndex = this.reduxState.startIndex;
        this.currItem = this.reduxState.queue[this.currIndex] || undefined;
        this.volume = this.reduxState.volume; // 볼륨값

        let progressPer = Utils.whatPercent(this.reduxStateRecv.nowProgress, this.reduxStateRecv.duration);
        let nowProgress = this.reduxStateRecv.nowProgress;
        if (this.state.progressBarHover.hover) {
            progressPer = this.state.progressBarHover.value;
            nowProgress = Utils.whatPercentValue(this.reduxStateRecv.duration, progressPer);
        }

        let playIcon = <PlayArrowIcon id="play" className="controlIcon" onClick={this.playerIconClickEvent} />;
        if (this.reduxStateRecv.isPlay === "play") {
            playIcon = <PauseIcon className="controlIcon" id="pause" onClick={this.playerIconClickEvent} />;
        }

        return (
            <div className="playerLayout">
                <div className="playerDiv">
                    <div className="musicInfoDiv">
                        <img
                            src={this.currItem?.albumArtUrl || tempAlbumArt}
                            alt="앨범아트"
                            height="100%"
                            className="albumArt"
                        />
                        <div className="infoText">
                            <p className="songName">{this.currItem?.musicMeta.title}</p>
                            <p className="songArtist">{this.currItem?.musicMeta.artist}</p>
                        </div>
                    </div>
                    <div className="musicControlDiv">
                        <div className="musicControl">
                            <ShuffleIcon className="controlIcon" />
                            <SkipPreviousIcon className="controlIcon" onClick={this.playerIconClickEvent} id="prev" />
                            {playIcon}
                            <SkipNextIcon className="controlIcon" onClick={this.playerIconClickEvent} id="next" />
                            <RepeatIcon className="controlIcon" />
                        </div>
                        <div className="progressBar">
                            <p className="progressTime">{Utils.secToMin(nowProgress)}</p>
                            <ProgressBar
                                onChange={(_, value) => {
                                    if (this.currItem) {
                                        this.setState({
                                            progressBarHover: { hover: true, value: value as number },
                                        });
                                    }
                                }}
                                onChangeCommitted={(_, value) => {
                                    this.setState({ progressBarHover: { hover: false, value: -1 } });
                                    const reqUpdateProgress = ReduxActions.reqUpdateProgress({
                                        progress: value as number,
                                    });
                                    this.props.dispatch(reqUpdateProgress);
                                }}
                                value={progressPer}
                            />
                            <p className="progressTime" style={{ textAlign: "right" }}>
                                {Utils.secToMin(this.reduxStateRecv.duration)}
                            </p>
                        </div>
                    </div>
                    <div className="volumeControlDiv">
                        <div className="volumeControl">
                            <VolumeUpIcon />
                            <VolumeSlider
                                value={Utils.VolumeToInt(this.volume)}
                                onChange={(_, value) => {
                                    const setVolume = ReduxActions.setVolume({ value: value as number });
                                    this.props.dispatch(setVolume);
                                }}
                                onChangeCommitted={(_, value) => {
                                    BrowserCache.saveVolume(Utils.VolumeToformatt(value as number));
                                }}
                            />
                            <p className="volumePer">{Utils.VolumeToInt(this.volume)}%</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// 클래스 컴포넌트에서 redux 재어를 위한
export default reduxConnect(MainPlayerComponet);
