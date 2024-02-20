import { Component, ReactNode } from "react";
import "../Style/MainPlayerComponet.css";
import { ReduxActions, reduxConnect } from "../Store/ConfingRedux";
import { ConnectedProps } from "react-redux";
import { MUIComponet } from "../Style/StyleComponents/MUICustum";
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

type MainPlayerProp = {} & ConnectedProps<typeof reduxConnect>;

class MainPlayerComponet extends Component<MainPlayerProp, any> {
    reduxState = this.props.reduxResponce.musicPlayState;
    reduxStateRecv = this.reduxState.send;
    currIndex = this.reduxState.startIndex;
    currItem = this.reduxState.queue[this.currIndex] || undefined;

    /** redex로 MusicStateComponet에 데이터 보내는 함수들 */
    redexSender = {
        /** 재생시간 갱신요청 */
        reqUpdateProgress(thisObject: MainPlayerComponet, progress: number) {
            const reqUpdateProgress = ReduxActions.reqUpdateProgress({ progress: progress });
            thisObject.props.dispatch(reqUpdateProgress);
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

    render(): ReactNode {
        // 변수들 갱신
        this.reduxState = this.props.reduxResponce.musicPlayState;
        this.reduxStateRecv = this.reduxState.send;
        this.currIndex = this.reduxState.startIndex;
        this.currItem = this.reduxState.queue[this.currIndex] || undefined;

        const progressPer = (this.reduxStateRecv.nowProgress / this.reduxStateRecv.duration) * 100 || 0;

        let playIcon: JSX.Element;
        if (this.reduxStateRecv.isPlay === "play") {
            playIcon = <PauseIcon className="controlIcon" id="pause" onClick={this.playerIconClickEvent} />;
        } else {
            playIcon = <PlayArrowIcon id="play" className="controlIcon" onClick={this.playerIconClickEvent} />;
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
                            <p className="songName">{this.currItem?.musicMeta.title || "제목"}</p>
                            <p className="songArtist">{this.currItem?.musicMeta.artist || "아티스트"}</p>
                        </div>
                    </div>
                    <div className="musicControlDiv">
                        <div className="musicControl">
                            <ShuffleIcon className="controlIcon" />
                            <SkipPreviousIcon className="controlIcon" onClick={this.playerIconClickEvent} id="prev"/>
                            {playIcon}
                            <SkipNextIcon className="controlIcon" onClick={this.playerIconClickEvent} id="next" />
                            <RepeatIcon className="controlIcon" />
                        </div>
                        <div className="progressBar">
                            <p className="progressTime">{Utils.secToMin(this.reduxStateRecv.nowProgress)}</p>
                            <MUIComponet.ProgressBar
                                onChangeCommitted={(_, value) => {
                                    this.redexSender.reqUpdateProgress(this, value as number);
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
                            <MUIComponet.VolumeSlider />
                            <p>0%</p> {/* 바꿀 부분 */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// 클래스 컴포넌트에서 redux 재어를 위한
export default reduxConnect(MainPlayerComponet);
